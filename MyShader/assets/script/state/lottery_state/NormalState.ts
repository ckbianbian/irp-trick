import ActionController from "../../controller/ActionController";
import MathUtiles from "../../lib/MathUtils";
import LotteryState from "./LotteryState";
/**
 *  @description 普通状态
 */

import StateBase from "./LotteryState";

export default class NormalState extends LotteryState {


    /** ------------------------------------基础属性-------------------------------------- */


    /** 名称 */
    name: string = 'NormalState';
    /** 该状态次数 */
    _stateNum: number = 1;
    constructor(name: string = 'NormalState', count: number = 1) {
        super();
        this.name = name;
        this._stateNum = count;
    }


    /** ------------------------------------基础方法-------------------------------------- */


    /** 普通状态one行为 */
    actionOne(node: cc.Node): void {
        cc.log('this class ', this.name, ' action one.');
    }
    /** 点击行为 */
    clickHandler(event: cc.Event, node: cc.Node, callFunc?: Function, target?: any): any {
        let open = target.game.openChest();
        if (!open) { // 不能打开 
            target.itemBtn.getComponent(cc.Button).interactable = true;
            return;
        }
        let result = MathUtiles.GetRandomValueByValueProbability({
            min: 1,
            max: 6,
            valueProbabilityMap: target._rewardMap
        });
        target.itemNode.stopAllActions();
        target.itemNode.angle = 0;
        ActionController.rotationNodeByScaleX(node, () => {
            target.itemBg.spriteFrame = target.spriteList[target.IMG_INDEX_ENUM.OPEN_IMG];
            let v = target._rewardIndexMap[result];
            cc.log(v);
            if (v) { // 有奖励
                target.itemIcon.spriteFrame = target.spriteList[target.IMG_INDEX_ENUM.ENEGY_IMG];
                target.itemNum.active = true;
                target.itemNum.string = 'x' + v;
            } else { // 没有奖励
                target.itemIcon.spriteFrame = target.spriteList[target.IMG_INDEX_ENUM.NONE_REWARD];
            }
            callFunc && callFunc.call(target);
            // return;
        });
    }
    /** 初始化显示 */
    initShow(node: cc.Node, callFunc?: Function, target?: any): void {

    }
    /**  */


}