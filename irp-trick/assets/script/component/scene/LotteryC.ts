import ActionController from "../../controller/ActionController";
import DataUtiles from "../../lib/DataUtiles";
import MathUtiles from "../../lib/MathUtils";
import ADState from "../../state/lottery_state/ADState";
import NormalState from "../../state/lottery_state/NormalState";
import StateBase from "../../state/StateBase";
import SceneC from "../SceneC";

/**
 *  @description Lottery场景脚本
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryC extends SceneC {


    /** ------------------------------------基础属性-------------------------------------- */


    @property({
        displayName: '奖品预制体',
        type: cc.Prefab
    })
    itemPrefab = null;
    @property({
        displayName: '奖品容器节点',
        type: cc.Node
    })
    itemContent = null;
    @property({
        displayName: '打开次数显示节点',
        type: cc.Node
    })
    openNumNode = null;
    @property({
        displayName: 'ad按钮节点',
        type: cc.Node
    })
    adBtnNode = null;
    @property({
        displayName: '按钮节点',
        type: cc.Node
    })
    btnNode = null;
    @property({
        displayName: '提示节点',
        type: cc.Node
    })
    tipsNode = null;
    /** 钥匙使用总次数 */
    keyCount = 0;
    /** 钥匙使用次数上限 */
    keyUseMax = 6;
    /** 奖品数量 */
    itemNum = 9;
    /** 初始开启次数 */
    initOpenNum = 3;
    /** 广告宝箱数量 */
    initAdChestNum = 3;
    /** 晃动宝箱数量 */
    initShakeChestNum = 3;
    /** 当前开启次数 */
    _openNum = 3;
    /** item数组 */
    _itemList = new Array();
    _adState = 1;


    /** ------------------------------------基础方法-------------------------------------- */


    /** onload */
    _onLoad(): void {
        this.createItemNode();
    }
    /** update */
    update(): void {

    }
    /** 创建item节点 */
    createItemNode(): void {
        let array: Array<cc.Node> = new Array();
        for (let i = 0; i < this.itemNum; i++) {
            let node = cc.instantiate(this.itemPrefab);
            node.parent = this.itemContent;
            node.ins.setState(new NormalState());
            node.ins.game = this;
            array.push(node);
        }
        for (let i = 0; i < this.initAdChestNum; i++) {
            let index = MathUtiles.Random(0, array.length - 1);
            let node: cc.Node = array.splice(index, 1)[0];
            this._itemList.push(node);
            node.ins.setState(new ADState());
        }
        this._itemList = this._itemList.concat(array);
        array = new Array();
        for (let i = 0; i < this.initShakeChestNum; i++) {
            let index = MathUtiles.Random(0, this._itemList.length - 1);
            let node: cc.Node = this._itemList.splice(index, 1)[0];
            array.push(node);
            node.ins.shake();
        }
        this._itemList = this._itemList.concat(array);
    }
    /** 开启宝箱判断 */
    openChest(): boolean {
        if (this._openNum > 0) {
            this.keyCount += 1;
            this._openNum -= 1;
            this.checkAdBtn();
            return true;
        }
        this.showTips('钥匙不足');
        return false;
    }
    /** 检测看广告按钮 */
    checkAdBtn(): void {
        if (this._openNum == 0) {
            if (this.keyCount >= this.keyUseMax) { // 这里结束看广告
                this.showContinueBtn();
            } else { // 这里是看广告按钮
                this.showAdBtn();
            }
        } else {
            this.showKeyNum();
        }
    }
    /** 显示钥匙数量 */
    showKeyNum(): void {
        this.openNumNode.active = true;
        this.btnNode.active = false;
        this.adBtnNode.active = false;
        let font = this.openNumNode.getChildByName('num');
        font.getComponent(cc.Label).string = 'x' + this._openNum;
    }
    /** 显示看广告按钮 */
    showAdBtn(): void {
        this.openNumNode.active = false;
        this.btnNode.active = false;
        this.adBtnNode.active = true;

    }
    /** 显示继续游戏按钮 */
    showContinueBtn(): void {
        this.openNumNode.active = false;
        this.btnNode.active = true;
        this.adBtnNode.active = false;

    }
    /** 点击回调 */
    clickHandler(): void {
        if (this._adState) {

        } else {

        }
    }
    /** 显示提示 */
    showTips(tips: string): void {
        let font = this.tipsNode.getChildByName('content');
        font.getComponent(cc.Label).string = tips;
        this.tipsNode.opacity = 255;
        this.tipsNode.stopAllActions();
        this.tipsNode.runAction(cc.fadeOut(0.3));
    }
    /** 增加次数 */
    addNum(event): void {
        let node = event.target;
        let toggleNode = node.getChildByName('Toggle');
        let isChecked = toggleNode.getComponent(cc.Toggle).isChecked;
        if (isChecked) {
            this._openNum = this.initOpenNum;
            this.checkAdBtn();
        } else {
            this.showContinueBtn();
        }
    }
    /** 切换toggle */
    toggle(event): void {
        let node = event.target.parent;
        let isChecked = node.getComponent(cc.Toggle).isChecked;
        cc.log(isChecked);
    }


    /** ------------------------------------子类实现-------------------------------------- */





}