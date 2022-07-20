import Controller from "./Controller";

/**
 *  @description 动画管理类
 */
export default class ActionController extends Controller {


    /** 构造方法私有化 */
    private constructor() {
        super();
    }
    /** 返回单例 */
    public static GetInstance() {
        if (this._actionController) {
            return this._actionController;
        } else {
            this._actionController = new ActionController();
            return this._actionController;
        }
    }

    /** ------------------------------------基础属性-------------------------------------- */


    /** 动作实例 */
    private static _actionController: ActionController;
    /** 动作标签枚举 */
    public static ACTION_TAG_ENUM = cc.Enum({
        JUMP_ROTATE_MOVE: 1001,
        /** 被攻击闪红 */
        BE_HITED_BLINK: 1002,
    });
    /** 角色单位移动距离 */
    public static _unitMoveDis = 1;
    /** 总移动开关 */
    public static moveTrigger = true;
    /** 当前时间 */
    private _currentTime = 0; // 当前运动消耗的时间


    /** ------------------------------------动作控制方法-------------------------------------- */


    /** 动作停止通过TAG */
    public static stopActionByTag = (node: cc.Node, tag: number) => {
        if (tag) {
            node.stopActionByTag(tag);
        } else {
            node.stopAllActions();
        }
    }


    /** ------------------------------------动作方法-------------------------------------- */


    /** 跳跃旋转移动动作 */
    public static jumpRotateMove(node: cc.Node, toPos: cc.Vec2, callFunc?: Function, time: number = 0.6, rotate: number = 30, jumpH: number = 20, jumpNum: number = 1): cc.Action {
        let jumpAction = cc.jumpTo(time, toPos, jumpH, jumpNum);
        let rotateAction = cc.sequence(cc.rotateBy(time / 4, -rotate), cc.rotateBy(time / 2, 2 * rotate), cc.rotateBy(time / 4, -rotate));
        let seqAction = cc.sequence(cc.spawn(jumpAction, rotateAction), cc.callFunc(callFunc));
        seqAction.setTag(this.ACTION_TAG_ENUM.JUMP_ROTATE_MOVE);
        seqAction.setTarget(node);
        node.runAction(seqAction);
        return seqAction;
    }


    /** ------------------------------------移动方法-------------------------------------- */


    /** 角色通过移动次数和角度进行移动 */
    public static moveByNumAndRd(node: cc.Node, rd: number = 0, num: number = 1, callFunc?: Function, checkCallFunc?: Function): void {
        for (let i = 0; i < num; i++) {
            if (this.moveTrigger && node.ins.moveTrigger) {
                let jPos: cc.Vec3 = cc.v3(this._unitMoveDis * Math.cos(rd), this._unitMoveDis * Math.sin(rd)); // 需要移动的向量
                let tPos: cc.Vec3 = node.position.add(jPos);
                if (checkCallFunc) tPos = checkCallFunc(node, tPos); // 如果有检测回调方法的话
                node.setPosition(tPos);
            } else {
                callFunc && callFunc(node);
            }
        }
        callFunc && callFunc(node);
    }
    /** 传入角度、移动距离、移动速度移动 */
    public static moveByRdDisAndSpeed = (node: cc.Node, rd: number = 0, dis: number = 1000, time: number = 0.3, callFunc?: Function) => {
        let jPos = cc.v3(dis * Math.cos(rd), dis * Math.sin(rd));
        let tPos = node.position.add(jPos);
        let action = cc.tween(node).to(time, {
            position: tPos
        }).call(callFunc);
        action.start();
    }
    /** 传入间隔时间，时间移动 */
    public static moveByTime(dt: number) {

    }


    /** ------------------------------------显示效果方法-------------------------------------- */


    /** 角色受伤闪红 */
    public static beHitedBlinkChangeColor(node: cc.Node, callFunc?: Function, color: cc.Color = new cc.Color(255, 0, 0, 255), time: number = 0.2): cc.Action {
        let preColor: cc.Color = new cc.Color(255, 255, 255);
        let action = cc.tween(node).sequence(
            cc.tween(node).to(time / 2, {
                color: color
            }),
            cc.tween(node).to(time / 2, {
                color: preColor
            })
        ).call(callFunc);
        action.tag = this.ACTION_TAG_ENUM.BE_HITED_BLINK;
        action.start();
        return action;
    }
    /** 节点高亮 */
    public static beHurtedHighLight(node: cc.Node, callFunc?: Function, time: number = 8): void {
        let nodeMtl = node.getComponent(cc.Sprite).getMaterial(0);
        let flag = true;
        let count = 1;
        let changeColor = (params) => {
            if (flag) {
                count++;
            } else {
                count--;
            }
            params.setProperty('blendColor', [count, count, count, 1]);
            if (count >= 10) flag = false;
            if (count <= 1) {
                clearInterval(id);
            }
        };
        let id = setInterval(changeColor, time, nodeMtl);
    }
    /** 节点变色（可以变白色） */
    public static changeColorByColor(node: cc.Node, callFunc?: Function, color: cc.Color = new cc.Color(255, 255, 255, 1), time: number = 200): void {
        let nodeMtl = node.getComponent(cc.Sprite).getMaterial(0);
        nodeMtl.setProperty('blendColor', [color.r, color.g, color.b, color.a]);
        nodeMtl.setProperty('blendTrigger', 1);
        let action = cc.tween(node).sequence(
            cc.tween(node).to(0.1, {
                opacity: 100
            }),
            cc.tween(node).to(0.1, {
                opacity: 255
            })
        ).call();
        action.start();
        setTimeout((params) => {
            params[0].setProperty('blendTrigger', 0);
            params[1].opacity = 255;
        }, time, [nodeMtl, node]);
    }
    /** 节点x旋转 */
    public static rotationNodeByScaleX(node: cc.Node, callFunc?: Function, time: number = 0.3): cc.Tween {
        let action = cc.tween(node).sequence(
            cc.tween().to(time / 2, {
                scaleX: -1
            }),
            cc.tween().to(
                time / 2, {
                scaleX: 1
            }
            )
        ).call(callFunc);
        action.start();
        return action;
    }
    /** 节点原地旋转 */
    public static rotationNodeByAngle(node: cc.Node, callFunc?: Function, time: number = 0.9): cc.Tween {
        node.angle = 0;
        let action = cc.tween(node).repeatForever(
            cc.tween().sequence(
                cc.tween().to(time / 2, {
                    angle: 10,
                }),
                cc.tween().to(time / 2, {
                    angle: -10,
                }),
                // cc.tween().to(time / 2, {
                //     angle: 0
                // }),
                // cc.tween().delay(time),
            )
        );
        action.start().call(callFunc);
        return action;
    }


}