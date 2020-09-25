import LotteryItemC from "../../component/prefab/LotteryItemC";
import ActionController from "../../controller/ActionController";
import MathUtiles from "../../lib/MathUtiles";
import ActivationState from "./ActivationState";
import LotteryState from "./LotteryState";
/**
 *  @description 普通状态
 */

import StateBase from "./LotteryState";

export default class ADState extends LotteryState {


    /** ------------------------------------基础属性-------------------------------------- */


    /** 名称 */
    name: string = 'ADState';


    /** ------------------------------------基础方法-------------------------------------- */


    /** 普通状态one行为 */
    actionOne(node: cc.Node): void {
        cc.log('this class ', this.name, ' action one.');
    }
    /** 点击行为 */
    clickHandler(event: cc.Event, node: cc.Node, callFunc?: Function, target?: any): any {
        target.itemTips.active = false;
        target.itemNode.stopAllActions();
        target.itemNode.angle = 0;
        target.game.showTips('看广告成功！');
        ActionController.rotationNodeByScaleX(node, () => {
            target.itemBg.spriteFrame = target.spriteList[target.IMG_INDEX_ENUM.OPEN_IMG];
            target.itemIcon.spriteFrame = target.spriteList[target.IMG_INDEX_ENUM.ENEGY_IMG];
            target.itemNum.active = true;
            target.itemNum.string = 'x30';
            callFunc && callFunc.call(target);
            // return;
        });
    }
    /** 初始化显示 */
    initShow(node: cc.Node, callFunc?: Function, target?: LotteryItemC): void {
        target.itemTips.active = true;
    }


}