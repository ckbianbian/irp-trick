/**
 *  @description 节点管理类
 */

import GameController from "./GameController";
import Controller from "./Controller";

export default class NodeController extends Controller {


    /** ------------------------------------基础属性-------------------------------------- */




    /** ------------------------------------基础方法-------------------------------------- */





    /** ------------------------------------对象池属性-------------------------------------- */


    /** 类型枚举 */
    public TYPE_ENUM = cc.Enum({
        /** 角色 */
        ROLE: 'role',
        /** 英雄 */
        HERO: 'hero',
        /** 敌人 */
        ENEMY: 'enemy',
    });
    /** 节点名称枚举 */
    public NODE_ENUM = cc.Enum({
        /** 角色 */
        ROLE: 'role',
        /** 子弹 */
        BULLET: 'bullet',
    });
    /** 角色对象池 */
    private _rolePool: cc.NodePool = new cc.NodePool();
    /** 角色对象池初始化数量 */
    private _rolePoolSize: number = 10;
    /** 子弹对象池 */
    private _bulletPool: cc.NodePool = new cc.NodePool();
    /** 子弹对象池初始化数量 */
    private _bulletPoolSize: number = 20;
    /** 初始化对象池方法映射 */
    private _initPoolMap = {
        'prefab/role/role': () => this._initRolePool,
        'prefab/bullet/bullet': () => this._initBulletPool,
    }


    /** ------------------------------------基本属性-------------------------------------- */


    /** 节点数组(用来存放所有被创建的节点) */
    public nodeArray: Map<string, cc.Node> = new Map();


    /** ------------------------------------私有方法-------------------------------------- */


    /** 返还节点前操作 */
    private _preReturnNode(node: cc.Node): void {
        this.nodeArray.delete(node.uuid); // 从节点数组中移除该节点
        node.stopAllActions(); // 停止节点所有动画
    }
    /** 创建节点前操作 */
    private _preCreateNode(node: cc.Node): void {
        node.ins && node.ins.destroy(); // 销毁节点之前挂载的脚本
        node.stopAllActions();
        this.nodeArray.set(node.uuid, node); // 将节点放入节点数组中
    }


    /** ------------------------------------初始对象池-------------------------------------- */


    /** 初始化角色对象池 */
    private _initRolePool(): void {
        cc.log('>> init role pool start.');
        let initNum = this._rolePoolSize - this._rolePool.size();
        cc.log(`>>> ${initNum} role node need to init.`);
        for (let i = 0; i < initNum; i++) {
            let prefab = cc.loader.getRes(GameController.PREFIX_RES.PREFAB_ROLE + this.NODE_ENUM.ROLE + GameController.SUFFIX_RES.DEFAULT);
            let node = cc.instantiate(prefab);
            this._rolePool.put(node);
            cc.log(`>>>> ${i + 1} role node init completed.`);
        }
        cc.log(`>>> ${initNum} role node init completed.`);
        cc.log('>> init role pool completed.');
    }
    /** 初始化子弹对象池 */
    private _initBulletPool(): void {
        cc.log('>> init bullet pool start.');
        let initNum = this._bulletPoolSize - this._bulletPool.size();
        cc.log(`>>> ${initNum} bullet node need to init.`);
        for (let i = 0; i < initNum; i++) {
            let prefab = cc.loader.getRes(GameController.PREFIX_RES.PREFAB_BULLET + this.NODE_ENUM.BULLET + GameController.SUFFIX_RES.DEFAULT);
            let node = cc.instantiate(prefab);
            this._bulletPool.put(node);
            cc.log(`>>>> ${i + 1} bullet node init completed.`);
        }
        cc.log(`>>> ${initNum} bullet node init completed.`);
        cc.log('>> init bullet pool completed.');
    }


    /** ------------------------------------创建节点-------------------------------------- */


    /** 创建角色节点 */
    private _createRoleNode(): cc.Node {
        let node: cc.Node = null;
        if (this._rolePool && this._rolePool.size() > 0) {
            node = this._rolePool.get();
        } else {
            let prefab = cc.loader.getRes(GameController.PREFIX_RES.PREFAB_ROLE + this.NODE_ENUM.ROLE + GameController.SUFFIX_RES.DEFAULT);
            node = cc.instantiate(prefab);
        }
        node.returnType = this.NODE_ENUM.ROLE;
        return node;
    }
    /** 创建子弹节点 */
    private _createBulletNode(): cc.Node {
        let node: cc.Node = null;
        if (this._bulletPool && this._bulletPool.size() > 0) {
            node = this._bulletPool.get();
        } else {
            let prefab = cc.loader.getRes(GameController.PREFIX_RES.PREFAB_BULLET + this.NODE_ENUM.BULLET + GameController.SUFFIX_RES.DEFAULT);
            node = cc.instantiate(prefab);
        }
        node.returnType = this.NODE_ENUM.BULLET;
        return node;
    }


    /** ------------------------------------返还节点-------------------------------------- */


    /** 返还角色节点 */
    private _returnRoleNode(node: cc.Node): void {
        if (node) this._rolePool.put(node);
    }
    /** 返还角色节点 */
    private _returnBulletNode(node: cc.Node): void {
        if (node) this._bulletPool.put(node);
    }


    /** ------------------------------------共有方法-------------------------------------- */


    /** 初始化对象池 */
    public InitPool(array?: [string]): void {
        cc.log('> init pool start.');
        for (let elm of array) {
            (this._initPoolMap[elm])();
        }
        cc.log('> init pool completed.');
    }

    /** 创建节点 */
    public CreateNode(name: string): cc.Node {
        let node = null;
        switch (name) {
            /** 创建角色节点 */
            case this.NODE_ENUM.ROLE:
                node = this._createRoleNode();
                break;
            /** 创建角色节点 */
            case this.NODE_ENUM.BULLET:
                node = this._createBulletNode();
                break;
            default:
                cc.log(`node ${name} not find.`);
                break;
        }
        this._preCreateNode(node);
        return node;
    }
    /** 返还节点 */
    public ReturnNode(node: cc.Node): void {
        this._preReturnNode(node);
        switch (node.returnType) {
            /** 返还角色节点 */
            case this.NODE_ENUM.ROLE:
                this._returnRoleNode(node);
                break;
            case this.NODE_ENUM.BULLET:
                this._returnBulletNode(node);
                break;
            default:
                break;
        }
    }


    /** ------------------------------------节点数组操作-------------------------------------- */


    /** 通过指定类型获取节点数组中的节点数组 */
    public getNodeByType(type?: string): Array<cc.Node> {
        let nodeArray: Array<cc.Node> = new Array();
        this.nodeArray.forEach((v, k) => {
            if (type) {
                if (v.ins && v.ins.obj && v.ins.obj.type.find(str => str == type)) {
                    nodeArray.push(v);
                }
            } else {
                nodeArray.push(v);
            }
        });
        return nodeArray;
    }
    /** 判断节点是否为指定类型 */
    public judgeTypeByTypeAndNode(type: string, node: cc.Node): boolean {
        if (node.ins && node.ins.obj && node.ins.obj.type.find(str => str == type)) {
            return true;
        }
        return false;
    }


}