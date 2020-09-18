/**
 *  @description 碰撞管理类
 */

import Controller from "./Controller"
import MathUtiles from "../lib/MathUtiles";

export default class CollisionController extends Controller {


    /** ------------------------------------基础属性-------------------------------------- */


    /** 碰撞TAG枚举 */
    public static COLLISION_TAG_ENUM = cc.Enum({
        /** 墙类碰撞tag */
        WALL: 1000,
        /** 角色类碰撞tag */
        ROLE: 1001,
    });
    /** 碰撞箱类型枚举 */
    public static COLLISION_BOX_ENUM = cc.Enum({
        /** 矩形碰撞箱 */
        RECT: 1,
        /** 圆形碰撞箱 */
        CIRCAL: 2,
    });
    /** 图形碰撞类型枚举 */
    public static COLLISION_TYEP_ENUM = cc.Enum({
        /** 矩形和矩形 */
        RECT_RECT: 1,
        /** 圆形和矩形 */
        CIRCAL_RECT: 2,
    });


    /** ------------------------------------基础方法-------------------------------------- */


    /** 碰撞开启 */
    public static CollisionTrigger = (flag: boolean = true, draw: boolean = false): cc.CollisionManager => {
        // Get the collision manager.
        let manager = cc.director.getCollisionManager();
        // Enabled the colider manager.
        manager.enabled = flag;
        // Enabled draw collider
        manager.enabledDebugDraw = draw;
        // Enabled draw collider bounding box
        manager.enabledDrawBoundingBox = draw;
        return manager;
    }
    /** 判断两个图形是否相交 */
    public static JudgeCollision = (type: number, one, two): boolean => {
        switch (type) {
            case 1:
                return cc.Intersection.rectRect(one, two);
            case 2:

                break;
            default:
                break;
        }
        return;
    }


    /** ------------------------------------碰撞箱创建方法-------------------------------------- */


    /** 创建碰撞箱 */
    public static createCollision(type: number, node: cc.Node, callFunc?: Function, width?: number, height?: number, collisionName?: string) {
        switch (type) {
            case this.COLLISION_BOX_ENUM.CIRCAL: // 圆形碰撞区域
                this.createCircalCollision(node, callFunc, width, collisionName);
                break;
            case this.COLLISION_BOX_ENUM.RECT: // 矩形碰撞区域
                this.createRectCollision(node, callFunc, width, height, collisionName);
                break;
            default:
                break;
        }
    }
    /** 圆形碰撞区域 */
    public static createCircalCollision(node: cc.Node, callFunc: Function, radius?: number, collisionName?: string) {
        let name = node.name + 'Collision' || collisionName;
        node.getChildByName(name) && node.getChildByName(name).destroy();
        let collisionNode = new cc.Node(name);
        let collision: cc.CircleCollider = collisionNode.addComponent(cc.CircleCollider);
        collision.radius = radius || MathUtiles.GetHypotenuseByWH(node.width, node.height);
        callFunc && callFunc(collisionNode, collision);
    }
    /** 矩形碰撞区域 */
    public static createRectCollision(node: cc.Node, callFunc: Function, width?: number, height?: number, collisionName?: string) {
        let name = node.name + 'Collision' || collisionName;
        node.getChildByName(name) && node.getChildByName(name).destroy();
        let collisionNode: cc.Node = new cc.Node(name);
        let collision: cc.BoxCollider = collisionNode.addComponent(cc.BoxCollider);
        collision.size.width = width || node.width;
        collision.size.height = height || node.height;
        callFunc && callFunc(collisionNode, collision);
    }


}