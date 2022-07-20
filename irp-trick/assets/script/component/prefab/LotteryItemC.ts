import ActionController from "../../controller/ActionController";
import MathUtiles from "../../lib/MathUtils";
import ActivationState from "../../state/lottery_state/ActivationState";
import ADState from "../../state/lottery_state/ADState";
import NormalState from "../../state/lottery_state/NormalState";
import StateBase from "../../state/StateBase";
import PrefabC from "../PrefabC";
/**
 *  @description LotteryItem脚本
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryItemC extends PrefabC {


    /** ------------------------------------基础属性-------------------------------------- */



    @property({
        displayName: '奖励按钮节点',
        type: cc.Node
    })
    itemBtn = null;
    @property({
        displayName: '奖励背景',
        type: cc.Sprite
    })
    itemBg = null;
    @property({
        displayName: '奖励Icon',
        type: cc.Sprite
    })
    itemIcon = null;
    @property({
        displayName: '奖励节点',
        type: cc.Node
    })
    itemNode = null;
    @property({
        displayName: '奖励数量',
        type: cc.Label
    })
    itemNum = null;
    @property({
        displayName: '奖励TIPS',
        type: cc.Node
    })
    itemTips = null;
    @property({
        displayName: '需要的图资源',
        type: [cc.SpriteFrame]
    })
    spriteList = [];
    @property({
        displayName: '音效',
        type: [cc.AudioClip]
    })
    audioArray = [];
    /** 图片资源枚举 */
    public IMG_INDEX_ENUM = cc.Enum({
        OPEN_IMG: 0,
        DIS_OPEN_IMG: 1,
        ENEGY_IMG: 2,
        NONE_REWARD: 3,
    });
    /** 音效资源枚举 */
    public SOUND_INDEX_ENUM = cc.Enum({
        OPEN_CHEST: 0,
        CLICK_BTN: 1
    });
    /** 奖励概率map */
    _rewardMap: Map<number, number> = new Map();
    /** 奖励index映射 */
    _rewardIndexMap = {
        1: 1,
        2: 2,
        3: 3,
        4: 5,
        5: false,
    }


    /** ------------------------------------基础方法-------------------------------------- */


    /** onload */
    _onLoad(): void {
        // this.setState(new ADState()); // 设置状态为普通状态
        this.initRewardProbability();
    }
    /** start */
    start(): void {
        this.initShow();
    }
    /** 初始化奖励概率数组 */
    initRewardProbability(): void {
        this._rewardMap.set(1, 0.2);
        this._rewardMap.set(2, 0.2);
        this._rewardMap.set(3, 0.2);
        this._rewardMap.set(4, 0.3);
        this._rewardMap.set(5, 0.1);
    }
    /** 点击回调事件 */
    clickEventHandler(event: cc.Event): void {
        this.itemBtn.getComponent(cc.Button).interactable = false;
        this._state.clickHandler(event, this.node, () => { // 这里的状态管理
            this.setState(new ActivationState()); // 设置状态为被激活状态
        }, this);
    }
    /** 显示 */
    initShow(): void {
        this._state.initShow(this.node, () => { }, this);
    }
    /** 晃动 */
    shake(): void {
        ActionController.rotationNodeByAngle(this.itemNode);
    }


    /** ------------------------------------子类实现-------------------------------------- */





}