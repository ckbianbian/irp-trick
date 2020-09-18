import SceneC from "../SceneC";
import GameController from "../../controller/GameController";
import SceneController from "../../controller/SceneController";
import FormulaController from "../../controller/FormulaController";
import NodeController from "../../controller/NodeController";
import RoleController from "../../controller/RoleController";
import ActionController from "../../controller/ActionController";
import CollisionController from "../../controller/CollisionController";
import AlgorithmUtiles from "../../lib/AlgorithmUtiles";

/**
 *  @description 大厅场景
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleC extends SceneC {


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
    /** update方法 */
    update = (dt: number): void => {
        this.methodArrayHandler(this.updateMethodArray, dt); // 方法数组管理器
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
            NodeController.InitPool();
            this._initGame();
        });
    }
    /** 初始化游戏 */
    private _initGame = (): void => {
        this.initBattle();
        this.initPlayer((node) => {
            this.initMethodArray();
            this.collisionTrigger();
            this.initEnemy();
        });
    }
    /** 初始化角色 */
    public initRole = (): void => {

    }
    /** 初始化玩家 */
    public initPlayer = (callFunc?: Function): void => {
        try {
            let role = RoleController.GetHeroById('hero_01'); // 获取节点数据信息
            if (!role) return;
            let node = NodeController.CreateNode(NodeController.NODE_ENUM.ROLE); // 创建角色节点
            this.node.addChild(node);
            node.addComponent(role.component); // 给节点绑定脚本组件
            node.ins.obj = role; // 给角色实例传递角色数据信息
            node.setPosition(0, 0); // 设置角色位置
            callFunc && callFunc(node);
        } catch (error) {
            cc.log(error);
        }
    }
    /** 初始化敌人 */
    public initEnemy = (callFunc?: Function) => {
        try {
            let role = RoleController.GetHeroById('little_bee'); // 获取节点数据信息
            if (!role) return;
            let node = NodeController.CreateNode(NodeController.NODE_ENUM.ROLE); // 创建角色节点
            this.node.addChild(node);
            node.addComponent(role.component); // 给节点绑定脚本组件
            node.ins.obj = role; // 给角色实例传递角色数据信息
            node.setPosition(500, 0); // 设置角色位置
            callFunc && callFunc(node);
        } catch (error) {
            cc.log(error);
        }
    }
    /** 初始化战斗场景 */
    private initBattle = (): void => {
        this.listenTrigger(true); // 开启监听
    }
    /** 初始化碰撞 */
    public collisionTrigger = (): void => {
        CollisionController.CollisionTrigger(true, true);
    }
    /** 初始化方法数组 */
    private initMethodArray = (): void => {
        this.initOperationMethodMap();
        this.initUpdateMethodArray();
    }
    /** 初始化update数组 */
    _initUpdateMethodArray = (): void => {
        this.addMethod(this.moveHandler);
        this.addMethod(this.operationHandler);
    }
    /** 初始化操作方法数组 */
    _initOperationMethodMap = (): void => {
        this.addOperationMethod(this.KEY_OPERATION_ENUM.ATK, this.attackOperation);
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
            this.moveHandler_bak(null, heroNode, judgePos, () => { }); // 角色移动管理器
        }
    }


    /** ------------------------------------功能方法-------------------------------------- */


    /** 功能管理器 */
    public operationHandler = ([dt]): void => {
        if (this.keyPressArray.length > 0) {
            for (let keycodEvent of this.keyPressArray) {
                if (this.keycodMap.has(keycodEvent.keyCode)) {
                    let operation = this.keycodMap.get(keycodEvent.keyCode);
                    let func = this.getOperationMehotdByKey(operation);
                    if (func !== -1) {
                        func(keycodEvent);
                    }
                }
            }
        }
    }
    /** 攻击操作 */
    public attackOperation = (evet: cc.Event.EventKeyboard): void => {
        let heroNode = NodeController.getNodeByType(NodeController.TYPE_ENUM.HERO)[0]; // 获取英雄节点
        heroNode.ins.attackHandler();
    }


    /** ------------------------------------移动方法-------------------------------------- */


    /** 移动管理器 */
    public moveHandler = ([dt]): void => {
        if (this.moveKeyPressArray.length > 0) {
            let oneKey = this.moveKeycodMap.get(this.moveKeyPressArray[0].keyCode);
            let twoKey = '';
            if (this.moveKeyPressArray.length > 1) twoKey = this.moveKeycodMap.get(this.moveKeyPressArray[1].keyCode);
            let ag = this.keycodeAngleMap[oneKey + twoKey] || this.keycodeAngleMap[twoKey];
            let heroNode = NodeController.getNodeByType(NodeController.TYPE_ENUM.HERO)[0]; // 获取英雄节点
            heroNode.ins.roleMoveByNumAndRd(heroNode, ag, heroNode.ins.obj.getSpeed(), () => { }, heroNode.ins.checkMove);
        }
    }
    /** 移动管理器 TODO: type的意义是什么？（用来区分角色的移动方式） */
    public moveHandler_bak = (type: string, node: cc.Node, toPos: cc.Vec2, callFunc?: Function): void => {
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


    /** ------------------------------------键盘监听回调方法-------------------------------------- */


    /** 监听开关 */
    _listenTrigger = (flag: boolean, callFunc?: Function) => {
        if (flag) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDownCallFunc);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUpCallFunc);
        } else {
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN);
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP);
        }
    }
    /** 键盘按下回调 */
    _onKeyDownCallFunc = (event: cc.Event.EventKeyboard): void => {
        this.keyboardDownHandler(event);
    }
    /** 键盘抬起回调 */
    _onKeyUpCallFunc = (event: cc.Event.EventKeyboard): void => {
        let index = this.keyPressArray.findIndex(b => b.keyCode == event.keyCode);
        if (index > -1) this.keyPressArray.splice(index, 1);
        let indexT = this.moveKeyPressArray.findIndex(b => b.keyCode == event.keyCode);
        if (indexT > -1) this.moveKeyPressArray.splice(indexT, 1);
        this.keyboardUpHandler(event);
    }
    /** 键盘按键按下管理器 */
    keyboardDownHandler = (event: cc.Event.EventKeyboard): void => {
        let key = event.keyCode;
        if (this.keycodMap.has(key)) {
            let index = this.keyPressArray.findIndex(b => b.keyCode == event.keyCode);
            if (index === -1) this.keyPressArray.push(event);
        }
        if (this.moveKeycodMap.has(key)) {
            let index = this.moveKeyPressArray.findIndex(b => b.keyCode == event.keyCode);
            if (index === -1) this.moveKeyPressArray.push(event);
        }
    }
    /** 键盘按键抬起管理器 */
    keyboardUpHandler = (event: cc.Event.EventKeyboard): void => {
        let key = event.keyCode;
    }


    /** ------------------------------------测试方法-------------------------------------- */


    /** 测试方法 */
    test = () => {
        cc.log('i am test func.');
    }


    /** ------------------------------------子类实现-------------------------------------- */


}