// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ITouch from "../../../interface/ITouch";
import ObjComp from "./ObjComp";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SteerComp extends cc.Component implements ITouch {

    @property(cc.Node)
    obj: cc.Node = null;

    private _playerPos = null;
    public get playerPos() {
        return this._playerPos;
    }
    public set playerPos(value) {
        this._playerPos = value;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.obj.getComponent(ObjComp).coreComp = this;
    }

    start() {

    }

    // update (dt) {}
    onEnable(): void { this.openTouch(); }
    onDisable(): void { this.closeTouch(); }

    // 成员方法
    openTouch(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
    }
    closeTouch(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
    }
    onTouchStart(event: cc.Event.EventTouch): void {
        this.playerPos = event.getLocation();
    }
    onTouchMove(event: cc.Event.EventTouch): void {
        let pos = event.getLocation();
        this.playerPos = pos;
        // cc.log(pos.x, "<=>", pos.y);
    }
    onTouchEnd(event: cc.Event.EventTouch): void {
        this.playerPos = null;
    }
    onTouchCancel(event: cc.Event.EventTouch): void {
        this.playerPos = null;
    }
}
