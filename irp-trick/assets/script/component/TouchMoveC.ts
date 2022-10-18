// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UActorComponent } from "../common/core/UActorComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TouchMoveC extends UActorComponent {


    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
    }
    onTouchStart(event: cc.Event.EventTouch) {
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(event.getLocation()));
    }
    onTouchMove(event: cc.Event.EventTouch) {
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(event.getLocation()));
    }
    onTouchCancel(event: cc.Event.EventTouch) {

    }
    onTouchEnd(event: cc.Event.EventTouch) {

    }
}
