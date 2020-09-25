/**
 *  @description 状态类基类
 */

export default class StateBase {


    /** ------------------------------------基础属性-------------------------------------- */




    /** ------------------------------------基础方法-------------------------------------- */


    /** 状态行为1 */
    public actionOne(node: cc.Node): void {

    }
    /** 点击行为 */
    clickHandler(event: cc.Event, node: cc.Node, callFunc?: Function, target?: any): any {
        callFunc && callFunc.call(target, 2);
        return;
    }
    /** 初始化显示 */
    initShow(node: cc.Node, callFunc?: Function, target?: any): void {

    }

}