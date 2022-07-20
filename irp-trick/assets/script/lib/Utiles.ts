/**
 *  @description 工具类基类
 */
export default class Utiles {


    /** ------------------------------------基础属性-------------------------------------- */


    /** 实例 */
    private static instance: Utiles;


    /** ------------------------------------基础方法-------------------------------------- */


    /** 获取实例 */
    public static getInstance<T extends {}>(this: new () => T): T {
        if (!(<any>this).instance) {
            (<any>this).instance = new this();
        }
        return (<any>this).instance;
    }
}