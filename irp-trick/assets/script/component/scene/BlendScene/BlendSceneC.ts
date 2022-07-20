// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlendSceneC extends cc.Component {

    @property(cc.Camera)
    OtherCamera: cc.Camera = null;
    @property(cc.Camera)
    FinalCamera: cc.Camera = null;

    @property(cc.Node)
    DisplayPanel: cc.Node = null;
    @property(cc.Node)
    item: cc.Node = null;

    _targetPos = null;




    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    }

    start() {
        this.DisplayPanel.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveCb, this);
        this.DisplayPanel.on(cc.Node.EventType.TOUCH_END, this.onTouchOverCb, this);
        this.DisplayPanel.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchOverCb, this);

        let texture = new cc.RenderTexture();
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height);

        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture);
        this.DisplayPanel.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        texture.setFlipY(true);

        this.OtherCamera.targetTexture = texture;
    }

    updateScreen() {

    }

    update(dt) {
        if (this._targetPos) {
            let temp: cc.Vec2 = this._targetPos.clone();
            let speed = 20;
            this.item.setPosition(this.item.getPosition().addSelf(temp.multiplyScalar(speed)));

            // this.item.setPosition(this.getToPos(dt, this.item.getPosition(), this._targetPos));
            // this.OtherCamera.node.setPosition(this.item.parent.convertToWorldSpaceAR(this.item.getPosition()).subSelf(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2)));
        }
        let targetPos = this.item.parent.convertToWorldSpaceAR(this.item.getPosition()).subSelf(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
        this.OtherCamera.node.setPosition(this.getToPos(dt, this.OtherCamera.node.getPosition(), targetPos));
    }


    getToPos(dt, curPos: cc.Vec2, toPos: cc.Vec2): cc.Vec3 {
        return curPos.add(toPos.sub(curPos).multiplyScalar(5 * dt));
    }

    onTouchOverCb(event: cc.Event.EventTouch): void {
        this._targetPos = false;
    }
    onTouchMoveCb(event: cc.Event.EventTouch): void {
        let pos = event.getLocation();
        // this._targetPos = this.item.parent.convertToNodeSpaceAR(pos).subSelf(this.item.getPosition());
        let temp = cc.v2();
        pos.sub(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2), temp);
        this._targetPos = temp.normalizeSelf().clone();
        // this.item.setPosition(this.item.parent.convertToNodeSpaceAR(pos));
    }
}
