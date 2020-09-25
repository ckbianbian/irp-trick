/**
 *  @description 普通状态
 */

import StateBase from "../StateBase";

export default class LotteryState extends StateBase {


    /** ------------------------------------基础属性-------------------------------------- */


    /** 名称 */
    name: string = 'LotteryState';


    /** ------------------------------------基础方法-------------------------------------- */


    /** 普通状态one行为 */
    actionOne(node: cc.Node): void {
        cc.log('this class ', this.name, ' action one.');
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