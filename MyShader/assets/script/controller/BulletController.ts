/**
 *  @description 弹药控制类
 */

import Controller from "./Controller";

export default class BulletController extends Controller {


    /** ------------------------------------基础属性-------------------------------------- */


    /** 弹药节点数组 */
    private bulletArray: Array<cc.Node>;


    /** ------------------------------------基础方法-------------------------------------- */


    /** 构造方法 */
    constructor(array: Array<cc.Node>) {
        super();
        this.bulletArray = array;
    }
    /** 子弹发射 */
    public openFire(): void {
        for (let bullet of this.bulletArray) {
            if (bullet.ins) bullet.ins.openFire();
        }
    }

}