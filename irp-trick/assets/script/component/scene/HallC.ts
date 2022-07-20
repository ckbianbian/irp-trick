import SceneC from "../SceneC";
import GameController from "../../controller/GameController";
import SceneController from "../../controller/SceneController";
import FormulaController from "../../controller/FormulaController";
import NodeController from "../../controller/NodeController";
import RoleController from "../../controller/RoleController";
import ActionController from "../../controller/ActionController";

/**
 *  @description 大厅场景
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class HallC extends SceneC {


    /** ------------------------------------基础属性-------------------------------------- */


    /** ------------------------------------节点属性-------------------------------------- */


    @property({
        displayName: '游戏主节点',
        type: cc.Node
    })
    /** 场景game节点 */
    game: cc.Node = null;

    @property({
        displayName: '主相机',
        type: cc.Node
    })
    /** 主相机 */
    mainCamera: cc.Node = null;

    @property({
        displayName: 'UI相机',
        type: cc.Node
    })
    /** UI相机 */
    UICamera: cc.Node = null;

    @property({
        displayName: '地图',
        type: cc.Node
    })
    /** 地图 */
    map: cc.Node = null;


    /** ------------------------------------数值属性-------------------------------------- */


    /** 相机缩放倍数 */


    /** ------------------------------------基础方法-------------------------------------- */


    /** _onload方法 */
    _onLoad = (): void => {
        this._init();
    }
    /** start方法 */
    start = (): void => {
        cc.log(GameController.GameDataMap);
    }
    /** 初始化 */
    private _init(): void {
        let sceneName = cc.director.getScene().name;
        let sceneInfos = GameController.GameDataMap.get('scenes');
        let sceneInfo = null;
        for (let k in sceneInfos) {
            let v = sceneInfos[k];
            if (v.name == sceneName && k != 'default') {
                sceneInfo = v;
                break;
            }
        }
        this.preloadAssets(sceneInfo, () => {
            cc.log('资源加载完毕。');
            NodeController.getInstance().InitPool(sceneInfo.loadPrefabAssets);
            this._initGame();
        });
    }
    /** 初始化游戏 */
    private _initGame = (): void => {
        let rect = new cc.Rect(0, 0, 100, 100);
        rect.center.set(cc.v2(0, 0));
        let g = this.map.getComponent(cc.Graphics);

        g.rect(0, 0, 100, 100);
        g.fillColor = new cc.Color(255, 0, 0);
        g.fill();
        g.rect(-200, -200, 100, 100);
        g.fillColor = new cc.Color(0, 0, 255);
        g.fill();
        this.scheduleOnce(() => {
            let newNode = new cc.Node();
            this.node.addChild(newNode);
            let a = newNode.addComponent(cc.Graphics);
            a.rect(0, 0, 50, 50);
            a.fillColor = new cc.Color(0, 255, 0);
            a.fill();
            newNode.width = 100;
            newNode.height = 100;
            newNode.setPosition(0, 0);
            let action = cc.tween(newNode).repeatForever(
                cc.tween(newNode).sequence(
                    cc.tween(newNode).by(0.3,
                        { x: 100 }
                    ),
                    cc.tween(newNode).by(0.3,
                        { x: -100 }
                    )
                )
            );
            action.start();
        }, 3);
        // this.initHall();
        // this.initPlayer();
    }
    /** 初始化玩家 */
    public initPlayer = (): void => {
        try {
            let role = RoleController.GetHeroById('hero_01'); // 获取节点数据信息
            if (!role) return;
            let genAxisPos = cc.v2(12, 11);
            // let genPixelPos = this.map.ins.getPixelPosByAxisPos(genAxisPos); // 获取角色初始位置
            let node = NodeController.CreateNode(NodeController.NODE_ENUM.ROLE); // 创建角色节点
            node.addComponent(role.component); // 给节点绑定脚本组件
            this.map.ins.addNodeToMapLayerByLayer(node); // 添加节点到地图对象层中
            node.ins.obj = role; // 给角色实例传递角色数据信息
            node.setPosition(30, 30); // 设置角色位置
        } catch (error) {
            cc.log(error);
        }
    }
    /** 初始化大厅 */
    private initHall = (): void => {
        // this.listenTrigger(true); // 开启监听
    }


    /** ------------------------------------地图操作方法-------------------------------------- */


    /** 点击地图 */
    public clickMap = (touchPos: cc.Vec2): void => {
        let cvPos = this.map.convertToNodeSpaceAR(touchPos);
        let cameraPos = cc.v2(this.mainCamera.position);
        let judgePos = cvPos.add(cameraPos); // 点击地图中的位置
        let clickAxisPos = this.map.ins.getAxisPosByPixelPos(judgePos); // 获取被点击的地图格子位置
        let mvTPos = this.map.ins.getPixelPosByAxisPos(clickAxisPos); // 获取被点击的地图格子像素位置
        let heroNode = NodeController.getNodeByType(NodeController.TYPE_ENUM.HERO)[0]; // 获取英雄节点
        if (heroNode.ins._isMoving) { // 如果当前节点正在移动，则取消当前角色移动
            heroNode.ins.roleStopMoving();
        } else {
            this.moveHandler(null, heroNode, judgePos, () => { }); // 角色移动管理器
        }
    }


    /** ------------------------------------节点移动方法-------------------------------------- */


    /** 移动管理器 TODO: type的意义是什么？ */
    public moveHandler = (type: string, node: cc.Node, toPos: cc.Vec2, callFunc?: Function): void => {
        let moveTiled: Array<string> = node.ins.obj.moveTiled;
        let moveMap: Map<number, any> = new Map();
        for (let id of moveTiled) {
            let tiledInfo = GameController.GameDataMap.get(id);
            moveMap.set(tiledInfo.id, tiledInfo);
        }
        let moveArray = this.map.ins.getMovePosArrayByPixelPos(node.position, toPos, moveMap);
        if (moveArray.length > 0) { // 可以移动
            cc.log(moveArray);
            node.ins.roleMoveByBlockArray(node, moveArray, callFunc);
        } else { // 不可移动
            cc.log('can not move.');
        }
    }


    /** ------------------------------------触摸方法管理-------------------------------------- */


    /** 触摸管理器 */
    touchHandler = (type: number, eOne: cc.Event.EventTouch, eTwo?: cc.Event.EventTouch): void => {
        switch (type) {
            case this.OPER_ENUM.CLICK:
                /** 点击处理 */
                this.singleClick(eOne);
                break;
            case this.OPER_ENUM.DEFAULT:
                /** 默认处理 */
                this.defaultClick(eOne);
                break;
            case this.OPER_ENUM.MOVE:
                /** 点击移动处理 */
                this.moveClick(eOne);
                break;
            case this.OPER_ENUM.SCALE:
                /** 双指缩放处理 */
                this.doubleMoveClick(eOne, eTwo);
                break;
            default:
                break;
        }
    }
    /** 单次点击方法 */
    singleClick = (event: cc.Event.EventTouch): void => {
        let clickPos = event.getStartLocation();
        this.clickMap(clickPos);
    }
    /** 默认点击方法 */
    defaultClick = (event: cc.Event.EventTouch): void => {

    }
    /** 点击移动方法 */
    moveClick = (event: cc.Event.EventTouch): void => {
        let curTouchPos = event.getLocation();
        let preTouchPos = event.getPreviousLocation();
        let vec = curTouchPos.sub(preTouchPos);
        this.mainCamera.ins.cameraMove(vec);
    }
    /** 双指点击移动方法 */
    doubleMoveClick = (eOne: cc.Event.EventTouch, eTwo: cc.Event.EventTouch): void => {

    }


    /** ------------------------------------监听回调方法-------------------------------------- */


    /** 触摸开始回调 单点操作控制 */
    _onTouchStartCallFunc = (event: cc.Event.EventTouch): void => {
        if (this.touchPointArray.length < this.touchPointMax) {
            if (this.operation == this.OPER_ENUM.DEFAULT) this.operation = this.OPER_ENUM.CLICK;
            this.touchPointArray.push(event.getStartLocation());
        }
    }
    /** 触摸移动回调 */
    _onTouchMoveCallFunc = (event: cc.Event.EventTouch): void => {
        this.touchPointArray.find((elm, index) => {
            if (event.getStartLocation().equals(elm)) { // 是记录在触摸点数组中的触摸点
                let curTouchPos = event.getLocation();
                let vector = curTouchPos.sub(event.getStartLocation());
                let dis = vector.mag();
                if (dis > this.misOperDis && this.operation & this.OPER_ENUM.CLICK) {
                    this.operation = this.OPER_ENUM.MOVE;
                }
                this.touchHandler(this.OPER_ENUM.MOVE, event);
            }
        });
    }
    /** 触摸取消回调 */
    _onTouchCancelCallFunc = (event: cc.Event.EventTouch): void => {
        this.touchPointArray.find((elm, index) => {
            if (event.getStartLocation().equals(elm)) {
                if (this.operation & this.OPER_ENUM.CLICK) { // 如果是单点击事件
                    cc.log('click here.');
                    this.touchHandler(this.OPER_ENUM.CLICK, event);
                }
                this.touchPointArray.splice(index, 1);
                this.resetProperty();
            }
        });
    }
    /** 触摸结束回调 */
    _onTouchEndCallFunc = (event: cc.Event.EventTouch): void => {
        this.touchPointArray.find((elm, index) => {
            if (event.getStartLocation().equals(elm)) {
                if (this.operation & this.OPER_ENUM.CLICK) { // 如果是单点击事件
                    cc.log('click here.');
                    this.touchHandler(this.OPER_ENUM.CLICK, event);
                }
                this.touchPointArray.splice(index, 1);
                this.resetProperty();
            }
        });
    }
    /** 监听开关 */
    _listenTrigger = (flag: boolean, callFunc?: Function) => {
        if (flag) {
            this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartCallFunc, this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveCallFunc, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelCallFunc, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEndCallFunc, this);
        } else {
            this.node.off(cc.Node.EventType.TOUCH_START);
            this.node.off(cc.Node.EventType.TOUCH_MOVE);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL);
            this.node.off(cc.Node.EventType.TOUCH_END);
        }
    }


    /** ------------------------------------子类实现-------------------------------------- */


}