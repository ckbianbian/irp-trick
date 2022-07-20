/**
 *  @description 攻击管理类
 */

import Controller from "./Controller"
import Role from "../model/role/Role";
import BulletController from "./BulletController";
import NodeController from "./NodeController";
import RoleController from "./RoleController";
import Bullet from "../model/bullet/Bullet";

export default class AttackController extends Controller {


    /** ------------------------------------基础属性-------------------------------------- */


    /** 攻击类型枚举 */
    public static ATTACK_TYPE_ENUM = cc.Enum({
        /** 蓄力远程 */
        STORAGE_REMOTE: 'storage_remote_atk',
        /** 蓄力近战 */
        STORAGE_MELEE: 'storage_melee_atk',
        /** 普通近战 */
        NORMAL_MELEE: 'normal_melee_atk',
        /** 普通远程 */
        NORMAL_REMOTE: 'normal_remote_atk'
    });
    /** 攻击方向类型枚举 */
    public static ATTACK_DIRECTION_TYPE = cc.Enum({
        /** 普通正方向 */
        NORMAL: 'normal',
    });
    /** 子弹移动方向弧度 */
    public static _moveRd = Math.PI / 36;
    /** 子弹生成位置单位偏移弧度 */
    public static _unitDeviationRd = 0;
    /** 子弹移动方向单位偏移弧度 */
    public static _unitDeviationMoveRd = Math.PI / 36;



    /** ------------------------------------基础方法-------------------------------------- */




    /** ------------------------------------攻击方法-------------------------------------- */


    /** 攻击管理器 */
    public static AttackHandler(node: cc.Node, callFunc?: Function): BulletController {
        let obj: Role = node.ins.obj;
        let atkType = obj.getAtkType();
        switch (atkType) {
            case this.ATTACK_TYPE_ENUM.NORMAL_REMOTE:
                return this.normalRemoteAttack(node, callFunc);

            default:
                break;
        }
    }
    /** 普通远程攻击 */
    public static normalRemoteAttack(node: cc.Node, callFunc?: Function): BulletController {
        let obj: Role = node.ins.obj;
        return this.createBulletHandler(node, obj);
    }


    /** ------------------------------------创建弹药的方法-------------------------------------- */


    /** 创建弹药 */
    public static createBulletHandler(node: cc.Node, obj: Role): BulletController {
        let atkType = obj.getAtkType();
        switch (atkType) {
            case this.ATTACK_TYPE_ENUM.NORMAL_REMOTE:
                return this.createRemoteBullet(node, obj);
            default:
                break;
        }
    }
    /** 创建远程弹药 */
    public static createRemoteBullet(node: cc.Node, obj: Role): BulletController {
        let directionBullet = 0;
        let array = this.createDirectionBulletHandler(node, obj);
        return new BulletController(array);
    }
    /** 创建近战弹药 */


    /** 创建方向弹药管理器 */
    public static createDirectionBulletHandler(node: cc.Node, obj: Role): Array<cc.Node> {
        let atkDirectionType = obj.getAtkDirectionType();
        switch (atkDirectionType) {
            case this.ATTACK_DIRECTION_TYPE.NORMAL:
                return this.createNormalDirectionBullet(node, obj);
            default:
                break;
        }
    }
    /** 创建普通方向弹药 */
    public static createNormalDirectionBullet(node: cc.Node, obj: Role): Array<cc.Node> {
        let bulletNum = obj.getBulletNum();
        let unitBulletNum = obj.getUnitBulletNum();
        let array = new Array();
        let rd = 0;
        let moveRd = rd;
        if (bulletNum & 1) {  // 奇数
            for (let i = 0; i < bulletNum; i++) {
                let unitBulletSpacing = 0;
                let cRd: number;
                if (i == 0) {
                    cRd = rd;
                } else if (i & 1) {
                    rd = Math.abs(rd) + this._unitDeviationRd;
                    moveRd = Math.abs(moveRd) + this._unitDeviationMoveRd;
                    cRd = rd;
                } else {
                    cRd = -rd;
                    moveRd = -moveRd;
                }
                for (let j = 0; j < unitBulletNum; j++) {
                    let bNode = NodeController.CreateNode(NodeController.NODE_ENUM.BULLET);
                    let bulletObj: Bullet = RoleController.getBulletByRole(obj);
                    bNode.addComponent(bulletObj.component);
                    node.parent.addChild(bNode);
                    let cRd = rd;
                    bulletObj.moveRd = moveRd;
                    let correctPos = cc.v3(unitBulletSpacing * Math.cos((moveRd)), unitBulletSpacing * Math.sin((moveRd)));
                    let jPos = cc.v3(node.width / 2 * Math.cos(cRd), node.width / 2 * Math.sin(cRd)).add(correctPos);
                    bNode.setPosition(node.position.add(jPos));
                    bNode.ins.obj = bulletObj;
                    array.push(bNode);
                    unitBulletSpacing += bNode.width;
                }
            }
        } else { // 偶数
            moveRd = rd + this._moveRd / 2;
            for (let i = 0; i < bulletNum; i++) {
                let unitBulletSpacing = 0;
                let cRd: number;
                if (i & 1) {
                    moveRd = -moveRd;
                    cRd = -rd;
                } else {
                    if (i !== 0) {
                        rd = Math.abs(rd) + this._unitDeviationRd;
                        moveRd = Math.abs(moveRd) + this._unitDeviationMoveRd;
                    }
                    cRd = rd;
                }
                for (let j = 0; j < unitBulletNum; j++) {
                    let bNode = NodeController.CreateNode(NodeController.NODE_ENUM.BULLET);
                    let bulletObj: Bullet = RoleController.getBulletByRole(obj);
                    bNode.addComponent(bulletObj.component);
                    node.parent.addChild(bNode);
                    bulletObj.moveRd = moveRd;
                    let correctPos = cc.v3(unitBulletSpacing * Math.cos(moveRd), unitBulletSpacing * Math.sin(moveRd));
                    let jPos = cc.v3(node.width / 2 * Math.cos(cRd), node.width / 2 * Math.sin(cRd)).add(correctPos);
                    bNode.setPosition(node.position.add(jPos));
                    bNode.ins.obj = bulletObj;
                    array.push(bNode);
                    unitBulletSpacing += bNode.width;
                }
            }
        }
        return array;
    }


}