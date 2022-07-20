const { ccclass, property } = cc._decorator;

@ccclass
export default class SliderBtnComp extends cc.Component {

    onLoad() {
        // this.node.on(cc.Node.EventType.TOUCH_END, this.test, this);
    }

    test() {
        cc.log('here');
    }

}