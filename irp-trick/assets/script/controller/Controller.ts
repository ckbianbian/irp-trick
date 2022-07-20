/**
 *  @description 控制类基类
 */

export default class Controller {


    /** ------------------------------------基础属性-------------------------------------- */


    /** 实例 */
    private static instance: Controller;


    /** ------------------------------------基础方法-------------------------------------- */


    /** 构造方法私有化 */
    // private constructor() {

    // }
    /** 获取实例 */
    public static getInstance<T extends {}>(this: new () => T): T {
        if (!(<any>this).instance) {
            (<any>this).instance = new this();
        }
        return (<any>this).instance;
    }


}