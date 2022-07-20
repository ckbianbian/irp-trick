/**
 *  @description 工具类基类
 */
export default class BaseUtils {
    /** 获取实例 */
    public static getInstance<T extends {}>(this: new () => T): T {
        if (!(<any>this).instance) {
            (<any>this).instance = new this();
        }
        return (<any>this).instance;
    }
}