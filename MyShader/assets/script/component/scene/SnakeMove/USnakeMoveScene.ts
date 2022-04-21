import CoordinateTranslationUtils from "../../../utils/CoordinateTranslationUtils";
import { USceneComponent } from "../../USceneComponent";

const { ccclass, property, menu } = cc._decorator;

@ccclass()
@menu("自定义组件/场景脚本/蛇移动场景")
export class USnakeMoveScene extends USceneComponent {

    @property({ displayName: "蛇节点", type: cc.Prefab })
    public snakeNode: cc.Prefab = null;
    @property({ displayName: "根节点", type: cc.Node })
    public rootNode: cc.Node = null;

    private _snakeCtrl: SnakeCtrl;
    private num = 3;
    private bIsTouch = false;
    private touchPos = null;

    onLoad(): void {
        cc.log(typeof this);
        cc.log(this);
        this.initSnakeObj();
        this.initTouchManager();
    }
    update(dt): void {
        // this._snakeCtrl?.execute(dt);
        this.addMovePos();
    }
    initSnakeObj(): void {
        this._snakeCtrl = new SnakeCtrl();

        for (let index = 0; index < this.num; index++) {
            let obj = this._snakeCtrl.genNode(index, cc.instantiate(this.snakeNode), this.rootNode);
            obj.speed = 15;
            cc.log(obj);
        }
    }
    initTouchManager(): void {
        this.rootNode.on(cc.Node.EventType.TOUCH_START, (inTouch: cc.Event.EventTouch) => {
            this.bIsTouch = true;
            this.touchPos = inTouch.getLocation();
        }, this)
        this.rootNode.on(cc.Node.EventType.TOUCH_MOVE, (inTouch: cc.Event.EventTouch) => {
            this.touchPos = inTouch.getLocation();
        }, this)
        this.rootNode.on(cc.Node.EventType.TOUCH_END, (inTouch: cc.Event.EventTouch) => {
            this.bIsTouch = false;
            this.touchPos = null;
        }, this)
        this.rootNode.on(cc.Node.EventType.TOUCH_CANCEL, (inTouch: cc.Event.EventTouch) => {
            this.bIsTouch = false;
            this.touchPos = null;
        }, this)
    }
    addMovePos(): void {
        if (this._snakeCtrl && this.bIsTouch && this.touchPos) {
            this._snakeCtrl.addMovePos(this.touchPos);
            this._snakeCtrl.updateNodePos();
        }
    }

}

export class SnakeCtrl {

    private _bIsFirst = true;
    private _spacing = 60;
    private _nodeArr: Array<SnakeModel> = new Array();
    private _posArr: Array<cc.Vec2> = new Array(); // 移动轨迹的数组

    execute(dt): void {
        if (this._bIsFirst) {
            this._bIsFirst = false;
            cc.log(this);
        }
        this.updateNodePos();
    }
    updateNodePos(): void {
        for (const iterator of this._nodeArr) {
            iterator.updateNodePos();
        }
    }
    addMovePos(inDPoint: cc.Vec2): void {
        let topObj = this._nodeArr[0];
        let nextPos = topObj.getPosByDirectVec(inDPoint);
        for (const iterator of this._nodeArr) {
            iterator.movePos.unshift(nextPos);
        }
    }
    genNode(index, node, parent): SnakeModel {
        let initPos = cc.v2(-index * this._spacing, 0);
        let obj = new SnakeModel();
        obj.node = node;
        this._nodeArr.push(obj);
        obj.node.setPosition(initPos);
        obj.node.setParent(parent);
        this._posArr.push(obj.getWorldPos());
        if (index >= 1) {
            obj.movePos.push(obj.getWorldPos());
            obj.movePos = this._nodeArr[index - 1].movePos.concat(obj.movePos);
        }

        return obj;
    }
}

export class SnakeModel {

    public speed: number = 10; // 移动速度
    public node: cc.Node;
    public movePos: Array<cc.Vec2> = new Array();

    // 根据方向获取下一个点的位置
    getPosByDirectVec(inDPoint: cc.Vec2): cc.Vec2 {
        let wPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let curPos = wPos;
        let vec: cc.Vec2 = inDPoint.sub(curPos);

        let nVec = vec.normalize();
        let result = curPos.add(nVec.mul(this.speed))

        return result;
    }
    getWorldPos(): cc.Vec2 {
        return CoordinateTranslationUtils.convertToCoordPos(this.node);
    }
    setNodePosition(pos: cc.Vec2): void {
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(pos));
    }
    updateNodePos(): void {
        let dis = this.speed;
        // let curPos = this.movePos.pop();
        let curPos = this.getWorldPos();

        while (dis > 0 && this.movePos.length > 0) {
            let nextPos = this.movePos[this.movePos.length - 1];
            let dif = nextPos.sub(curPos);
            if (dis <= dif.len()) {
                curPos = curPos.add(dif.normalize().mul(dis));
            } else {
                curPos = this.movePos.pop();
            }

            dis -= dif.len();
        }

        if (curPos) {
            // this.movePos.push(curPos);
            this.setNodePosition(curPos);
        }
    }

}