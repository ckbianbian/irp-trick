// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UActorComponent } from "../../../common/core/UActorComponent";
import ITouch from "../../../interface/ITouch";
import CoordinateTranslationUtils from "../../../utils/CoordinateTranslationUtils";
import { TweenUtil } from "../../../utils/TweenUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OceanItemC extends UActorComponent implements ITouch {

    @property({ type: cc.Sprite, displayName: "漂浮物精灵图" })
    itemSp: cc.Sprite = null;
    @property({ type: cc.Node, displayName: "漂浮物" })
    item: cc.Node = null;
    @property({ type: cc.Node, displayName: "海浪遮罩" })
    mask: cc.Node = null;
    @property({ type: cc.Node, displayName: "海浪线" })
    seaWave: cc.Node = null;

    itemMaterial: cc.Material;

    trigger = false;
    weight = 0;

    start() {
        this.weight = 0.5;
        this.itemMaterial = this.itemSp.getMaterial(0);
        this.openTouch();
    }

    openTouch(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
    }

    showOceanEffect(): void {
        // this.mask.active = true
        this.seaWave.active = true
    }
    hideOceanEffect(): void {
        // this.mask.active = false
        this.seaWave.active = false
    }

    update(dt: number): void {
        if (this.trigger) {
            this.setItemEffectValue(this.item.getPosition());
        }
    }

    setItemEffectValue(pos): void {
        let offsetY = Math.abs(pos.y);
        let value = Math.max(0, Math.min(1.0, offsetY / this.item.height));
        // cc.log(value);
        this.itemMaterial.setProperty("oceanOffsetY", value);
    }

    resetItem(): void {
        this.trigger = false;
        this.item.setPosition(0, 0);
        this.item.stopActionByTag(TweenUtil.TweenTag.FLOAT);
        this.node.setSiblingIndex(cc.macro.MAX_ZINDEX);
        this.node.zIndex = cc.macro.MAX_ZINDEX;
        this.setItemEffectValue(0);
    }

    onItemInOcean(): void {
        this.trigger = true;
        let pos = CoordinateTranslationUtils.convertToCoordPos(this.node);
        this.node.setSiblingIndex(cc.winSize.height - pos.y);
        this.node.zIndex = cc.winSize.height - pos.y;
        TweenUtil.FloatTweenByNode(this.item, this.item.height * this.weight, this.weight * 1.2);
    }

    onTouchStart(event: cc.Event): void {
        this.hideOceanEffect();
        this.resetItem();
    }
    onTouchMove(event: cc.Event): void {
    }
    onTouchEnd(event: cc.Event): void {
        this.showOceanEffect();
        this.onItemInOcean();
    }
    onTouchCancel(event: cc.Event): void {
        this.showOceanEffect();
        this.onItemInOcean();
    }
}
