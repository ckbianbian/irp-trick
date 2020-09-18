import CollisionController from "../controller/CollisionController";

/**
 *  @description 挂载脚本基类
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class ObjectC extends cc.Component {



    /** ------------------------------------基础属性-------------------------------------- */


    /** 运行实例 */
    static ins = null;
    /** 触摸点数组 */
    public touchPointArray: Array<any> = new Array();
    /** 键盘按键数组 */
    public keyPressArray: Array<cc.Event.EventKeyboard> = new Array();
    /** 键盘移动按键数组 */
    public moveKeyPressArray: Array<cc.Event.EventKeyboard> = new Array();
    /** 触摸点上限 */
    public touchPointMax: number = 1;
    /** 操作状态 */
    public operation: number = 0; // 1 点击操作 2 移动操作 3 缩放操作
    /** 移动误操作判定距离 */
    public misOperDis: number = 50;
    /** 拖动移动时候的单位移动距离 */
    public unitMoveDis: number = 0.5;
    /** 操作状态枚举 */
    public OPER_ENUM = cc.Enum({
        DEFAULT: 0,
        CLICK: 1,
        MOVE: 2,
        SCALE: 3
    });
    /** 键盘操作枚举 */
    public KEY_OPERATION_ENUM = cc.Enum({
        ATK: 'attack',
        UP: 'up',
        RIGHT: 'right',
        LEFT: 'left',
        DOWN: 'down',
    });
    /** update方法数组 */
    public updateMethodArray: Array<Function> = new Array();
    /** operation方法数组 */
    public operationMethodMap: Map<string, Function> = new Map();
    /** 存放键盘按键的map */
    public keycodMap: Map<number, string> = new Map();
    /** 存放移动控制键的map */
    public moveKeycodMap: Map<number, string> = new Map();
    /** 按键角度 */
    public keycodeAngleMap: any = {
        'up': Math.PI / 2,
        'left': Math.PI,
        'down': -Math.PI / 2,
        'right': 0,
        'upleft': Math.PI * 3 / 4,
        'leftup': Math.PI * 3 / 4,
        'upright': Math.PI * 1 / 4,
        'rightup': Math.PI * 1 / 4,
        'leftdown': -Math.PI * 3 / 4,
        'downleft': -Math.PI * 3 / 4,
        'downright': -Math.PI * 1 / 4,
        'rightdown': -Math.PI * 1 / 4,
    };
    /** 配置类型枚举 */
    public DEPLOY_TYPE_ENUM = cc.Enum({
        /** spine */
        SPINE: 1,
        /** sprite */
        SPRITE: 2,
        /** material */
        MATERIAL: 3,
    });


    /** ------------------------------------基础方法-------------------------------------- */


    /** 加载时候调用方法 */
    onLoad = () => {
        this.initIns(); // 初始化实列
        this.initKeycodMap(); // 初始化键盘按键映射
        this._onLoad();
    }
    /** 初始化实例 */
    initIns = () => {
        this.node.ins = this;
    }
    /** 重置属性 */
    resetProperty = (): void => {
        this.operation = this.OPER_ENUM.DEFAULT; // 重置状态为默认
        this.touchPointArray.splice(0, this.touchPointArray.length); // 清空触摸点数组
    }
    /** 初始化键盘映射 */
    initKeycodMap = (): void => {
        this.keycodMap.set(32, this.KEY_OPERATION_ENUM.ATK); // 空格
        this.keycodMap.set(83, this.KEY_OPERATION_ENUM.DOWN); // s
        this.keycodMap.set(87, this.KEY_OPERATION_ENUM.UP); // w
        this.keycodMap.set(65, this.KEY_OPERATION_ENUM.LEFT); // a 
        this.keycodMap.set(68, this.KEY_OPERATION_ENUM.RIGHT); // d
        this.initMoveKeycodMap();
    }
    /** 初始化移动控制键盘映射 */
    initMoveKeycodMap = (): void => {
        this.moveKeycodMap.set(83, this.KEY_OPERATION_ENUM.DOWN); // s
        this.moveKeycodMap.set(87, this.KEY_OPERATION_ENUM.UP); // w
        this.moveKeycodMap.set(65, this.KEY_OPERATION_ENUM.LEFT); // a
        this.moveKeycodMap.set(68, this.KEY_OPERATION_ENUM.RIGHT); // d
    }


    /** ------------------------------------资源操作-------------------------------------- */


    /** 预加载场景需要的资源 */
    public preloadAssets = (scenesSysInfo: any, callFunc?: Function): void => {
        try {
            let preLoadAssetsArray = scenesSysInfo.loadAssetsArray || [];
            let preLoadSpineArray = scenesSysInfo.loadSpineAssets || [];
            let preloadPrefabArray = scenesSysInfo.loadPrefabAssets || [];
            let preloadSpriteArray = scenesSysInfo.loadSpriteAssets || [];
            /** 加载资源 */
            cc.loader.loadResArray(preLoadAssetsArray, (error, assets) => {
                if (error) {
                    cc.log(error);
                }
                for (let elm of assets) {
                    cc.log('>preload asset ', elm.name, ' compelete.');
                }
                /** 加载spine资源 */
                cc.loader.loadResArray(preLoadSpineArray, sp.SkeletonData, (error, assets) => {

                    if (error) {
                        cc.log(error);
                    }
                    for (let elm of assets) {
                        cc.log('>preload spine asset ', elm.name, ' compelete.');
                    }
                    /** 加载sprite资源 */
                    cc.loader.loadResArray(preloadSpriteArray, cc.SpriteFrame, (error, assets) => {

                        if (error) {
                            cc.log(error);
                        }
                        for (let elm of assets) {
                            cc.log('>preload sprite asset ', elm.name, ' compelete.');
                        }
                        /** 加载prefab资源 */
                        cc.loader.loadResArray(preloadPrefabArray, cc.Prefab, (error, assets) => {

                            if (error) {
                                cc.log(error);
                            }
                            for (let elm of assets) {
                                cc.log('>preload prefab asset ', elm.name, ' compelete.');
                            }
                            if (callFunc) callFunc();
                        });
                    });
                });
            });
        } catch (error) {
            cc.log(error);
        }
    }
    /** 释放场景资源 */
    releaseAssets = () => {

    }
    public deployHandler(type: number, node: cc.Node, url: string, callFunc?: Function): void {
        switch (type) {
            case this.DEPLOY_TYPE_ENUM.SPINE:
                this.deploySpine(node, url, callFunc);
                break;
            case this.DEPLOY_TYPE_ENUM.SPRITE:
                this.deploySprite(node, url, callFunc);
                break;
            case this.DEPLOY_TYPE_ENUM.MATERIAL:
                this.deployMaterial(node, url, callFunc);
                break;
            default:
                break;
        }
    }
    /** 配置sprite */
    public deploySprite = (node: cc.Node, url: string, callFunc?: Function): void => {
        if (!url) return;
        try {
            let sprite = node.getComponent(cc.Sprite);
            sprite.spriteFrame = new cc.SpriteFrame(cc.loader.getRes(url));
            callFunc && callFunc(sprite);
        } catch (error) {

        }
    }
    /** 配置spine */
    public deploySpine = (node: cc.Node, url: string, callFunc?: Function): void => {
        if (!url) return;
        try {
            let spine = node.getChildByName(node.name).getComponent('sp.Skeleton');
            spine.skeletonData = cc.loader.getRes(url, sp.SkeletonData);
            callFunc && callFunc(spine);
        } catch (error) {

        }
    }
    /** 配置material */
    public deployMaterial = (node: cc.Node, url: string, callFunc?: Function): void => {
        if (!url) return;
        try {
            let material = cc.loader.getRes(url, cc.Material);
            let com = null;
            if (node.getComponent(cc.Sprite)) {
                com = node.getComponent(cc.Sprite);
            } else if (node.getComponent(sp.Skeleton)) {
                com = node.getComponent(sp.Skeleton);
            }
            if (com != null) com.setMaterial(0, material);
            callFunc && callFunc(com);
        } catch (error) {

        }
    }


    /** ------------------------------------监听方法-------------------------------------- */


    /** 绑定监听事件 */
    public listenTrigger = (flag: boolean = true, callFunc?: Function): void => {
        this._listenTrigger(flag, callFunc);
    }
    /** 触摸开始回调 */
    public onTouchStartCallFunc = (event: cc.Event.EventTouch): void => {
        this._onTouchStartCallFunc(event);
    }
    /** 触摸移动回调 */
    public onTouchMoveCallFunc = (event: cc.Event.EventTouch): void => {
        this._onTouchMoveCallFunc(event);
    }
    /** 触摸取消回调 */
    public onTouchCancelCallFunc = (event: cc.Event.EventTouch): void => {
        this._onTouchCancelCallFunc(event);
    }
    /** 触摸结束回调 */
    public onTouchEndCallFunc = (event: cc.Event.EventTouch): void => {
        this._onTouchEndCallFunc(event);
    }
    /** 键盘按下事件回调 */
    public onKeyDownCallFunc = (event: cc.Event.EventKeyboard): void => {
        this._onKeyDownCallFunc(event);
    }
    /** 键盘抬起事件回调 */
    public onKeyUpCallFunc = (event: cc.Event.EventKeyboard): void => {
        this._onKeyUpCallFunc(event);
    }


    /** ------------------------------------方法数组操作方法-------------------------------------- */


    /** 增加方法 */
    addMethod = (func: Function, isRepeat: Boolean = false, array: Array<Function> = this.updateMethodArray): Number => {
        let index = array.findIndex(b => { return b === func; });
        if (isRepeat) { // 重复添加
            return array.push(func) - 1;
        } else {
            if (index > -1) {
                return index;
            } else {
                return array.push(func) - 1;
            }
        }
    }
    /** 删除方法 */
    delMethod = (func: Function, array: Array<Function> = this.updateMethodArray): Function => {
        let index = array.findIndex(b => { return b === func; });
        return array.splice(index, 1)[0];
    }
    /** 方法数组处理 */
    methodArrayHandler = (array: Array<Function> = this.updateMethodArray, ...param: any): Number => {
        for (let func of array) {
            if (func instanceof Function) func && func(param);
        }
        return array.length;
    }
    /** 增加操作方法数组方法 */
    public addOperationMethod = (key: string, value: Function): Function => {
        if (this.operationMethodMap.has(key)) {
            return this.operationMethodMap.get(key);
        }
        this.operationMethodMap.set(key, value);
        return value;
    }
    /** 删除操作方法数组方法 */
    public delOperationMethod = (key: string): boolean => {
        if (this.operationMethodMap.has(key)) {
            let result = this.operationMethodMap.delete(key);
            return result;
        }
        return false;
    }
    public getOperationMehotdByKey = (key: string): any => {
        if (this.operationMethodMap.has(key)) {
            return this.operationMethodMap.get(key);
        }
        return -1;
    }
    /** 初始化操作方法数组 */
    public initOperationMethodMap = (): void => {
        this._initOperationMethodMap();
    }
    /** 初始化update方法数组 */
    public initUpdateMethodArray = (): void => {
        this._initUpdateMethodArray();
    }


    /** ------------------------------------碰撞方法-------------------------------------- */


    /** 初始化碰撞箱 */
    initCollision = (node: cc.Node, group: string, tag: number, callFunc?: Function, type: number = CollisionController.COLLISION_BOX_ENUM.RECT, width?: number, height?: number, name?: string): void => {
        width = width || node.width, height = height || node.height;
        CollisionController.createCollision(type, node, (collisionNode, collision) => {
            collision.tag = tag || 0; // 设置碰撞tag
            collisionNode.rIns = this; // 设置碰撞节点的根节点实例
            collisionNode.group = group; // 设置碰撞节点的分组
            collisionNode.addComponent('ColliderC'); // 设置脚本
            node.addChild(collisionNode); // 设置碰撞节点父节点
            this._initCollision(node, callFunc, collisionNode, collision);
        }, width, height, name);
    }
    /** 碰撞开始回调 */
    onCollisionEnter(other, self): void {
        this.collisionHandler('enter', other, self);
    }
    /** 碰撞持续回调 */
    onCollisionStay(other, self): void {
        this.collisionHandler('stay', other, self);
    }
    /** 碰撞离开回调 */
    onCollisionExit(other, self): void {
        this.collisionHandler('exit', other, self);
    }
    /** 碰撞管理器 */
    collisionHandler = (type: string, other, self): void => {
        switch (type) {
            case 'enter':
                this.collisionEnterHandler(other, self);
                break;
            case 'stay':
                this.collisionStayHandler(other, self);
                break;
            case 'exit':
                this.collisionExitHandler(other, self);
                break;
            default:
                cc.log('collision handler ', type, ' not find.');
                break;
        }
    }
    /** 碰撞开始管理器 */
    collisionEnterHandler = (other, self): void => {
        let tag = other.tag;
        switch (tag) {
            case CollisionController.COLLISION_TAG_ENUM.WALL:
                this.wallCollisionEnterCallFunc(other, self);
                break;
            case CollisionController.COLLISION_TAG_ENUM.ROLE:
                this.roleCollisionEnterCallFunc(other, self);
                break;
            default:
                cc.log(`no '${tag}' type collision enter callFunc.`);
                break;
        }
    }
    /** 碰撞持续管理器 */
    collisionStayHandler = (other, self): void => {
        let tag = other.tag;
        switch (tag) {
            case CollisionController.COLLISION_TAG_ENUM.WALL:
                this.wallCollisionStayCallFunc(other, self);
                break;
            default:
                cc.log(`no '${tag}' type collision stay callFunc.`);
                break;
        }
    }
    /** 碰撞结束管理器 */
    collisionExitHandler = (other, self): void => {
        let tag = other.tag;
        switch (tag) {
            case CollisionController.COLLISION_TAG_ENUM.WALL:
                this.wallCollisionExitCallFunc(other, self);
                break;
            default:
                cc.log(`no '${tag}' type collision exit callFunc.`);
                break;
        }
    }
    /** 墙壁碰撞开始回调 */
    wallCollisionEnterCallFunc = (other, self): void => {
        this._wallCollisionEnterCallFunc(other, self);
    }
    /** 墙壁碰撞持续回调 */
    wallCollisionStayCallFunc = (other, self): void => {

    }
    /** 墙壁碰撞结束回调 */
    wallCollisionExitCallFunc = (other, self): void => {

    }
    /** 角色碰撞开始回调 */
    roleCollisionEnterCallFunc = (other, self): void => {
        this._roleCollisionEnterCallFunc(other, self);
    }


    /** ------------------------------------子类实现-------------------------------------- */


    /** 子类实现onload */
    _onLoad = (): void => { };
    /** 子类实现触摸开始回调 */
    _onTouchStartCallFunc = (event: cc.Event.EventTouch): void => { };
    /** 子类实现触摸移动回调 */
    _onTouchMoveCallFunc = (event: cc.Event.EventTouch): void => { };
    /** 子类实现触摸取消回调 */
    _onTouchCancelCallFunc = (event: cc.Event.EventTouch): void => { };
    /** 子类实现触摸结束回调 */
    _onTouchEndCallFunc = (event: cc.Event.EventTouch): void => { };
    /** 子类实现键盘按下事件回调 */
    _onKeyDownCallFunc = (event: cc.Event.EventKeyboard): void => { };
    /** 子类实现键盘抬起事件回调 */
    _onKeyUpCallFunc = (event: cc.Event.EventKeyboard): void => { };
    /** 子类实现监听开启 */
    _listenTrigger = (flag: boolean, callFunc?: Function): void => { };
    /** 子类实现初始化操作方法数组 */
    _initOperationMethodMap = (): void => { };
    /** 子类实现初始化update方法数组 */
    _initUpdateMethodArray = (): void => { };
    /** 子类实现初始化碰撞箱方法 */
    _initCollision = (node: cc.Node, callFunc?: Function, colNode?: cc.Node, collision?: cc.Collider): void => { };
    /** 子类实现墙壁碰撞开始回调 */
    _wallCollisionEnterCallFunc = (other, self): void => { };
    /** 子类实现角色碰撞开始回调 */
    _roleCollisionEnterCallFunc = (other, self): void => { };


}