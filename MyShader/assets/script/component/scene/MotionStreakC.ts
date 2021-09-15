// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    motionStreak: cc.Node = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Touch) => {
            let pos = event.getLocation();
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Touch) => {
            let pos = event.getLocation();
            let nPos = this.node.convertToNodeSpaceAR(pos);
            this.motionStreak.setPosition(nPos);
        });
    }

    // update (dt) {}
}
