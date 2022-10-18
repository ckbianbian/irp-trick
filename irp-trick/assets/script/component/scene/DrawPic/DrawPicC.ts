import { USceneComponent } from "../../../common/core/USceneComponent";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("自定义组件/场景脚本/画画场景")
export default class DrawPicC extends USceneComponent {

    /* ---------------------------------- 全局属性 ---------------------------------- */

    _fTexture: cc.RenderTexture = null; // f相机的texture
    _mTexture: cc.RenderTexture = null; // m相机的texture

    /* ---------------------------------- 成员属性 ---------------------------------- */

    @property(cc.Node)
    brushNode: cc.Node = null;
    @property(cc.Camera)
    mCamera: cc.Camera = null;
    @property(cc.Camera)
    fCamera: cc.Camera = null;
    @property(cc.Camera)
    bCamera: cc.Camera = null;
    @property(cc.Mask)
    mask: cc.Mask = null;
    @property(cc.Sprite)
    bg: cc.Sprite = null;
    @property(cc.Sprite)
    drawBoard: cc.Sprite = null;
    @property(cc.Sprite)
    blendSp: cc.Sprite = null;

    /* ---------------------------------- 生命周期方法 ---------------------------------- */

    protected onLoad(): void {
        cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
        cc.view.enableAutoFullScreen(false);
        // let screen = new cc.screen();
        // screen.requestFullScreen();
        // cc.screen['requestFullScreen'](); 
        // cc.screen['exitFullScreen']();
        this.initCamera();
    }
    protected start(): void {
        this.openTouchEvent();
    }

    /* ---------------------------------- 成员方法 ---------------------------------- */

    public openTouchEvent(): void {
        this.rootNode.on(cc.Node.EventType.TOUCH_START, (event: cc.Touch) => {
        });
        this.rootNode.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Touch) => {
            let pos = event.getLocation();
            let nPos = this.node.convertToNodeSpaceAR(pos);
            this.brushNode.setPosition(nPos);
            // this.blendTexture();
        });
        this.rootNode.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Touch) => {
        });
        this.rootNode.on(cc.Node.EventType.TOUCH_END, (event: cc.Touch) => {
        });
    }

    public initCamera(): void {
        this._fTexture = new cc.RenderTexture();
        this._fTexture.initWithSize(cc.visibleRect.width, cc.visibleRect.height);
        let sf = new cc.SpriteFrame();
        sf.setTexture(this._fTexture);
        sf.setFlipY(true);
        this.mask.spriteFrame = sf;
        this.drawBoard.spriteFrame = sf;
        this.fCamera.targetTexture = this._fTexture; // 将相机拍摄的内容映射到纹理上

        // this._mTexture = new cc.RenderTexture();
        // this._mTexture.initWithSize(cc.visibleRect.width, cc.visibleRect.height);
        // let spriteFrame = new cc.SpriteFrame();
        // spriteFrame.setTexture(this._mTexture);
        // this.drawBoard.spriteFrame = spriteFrame;
        // this.bCamera.targetTexture = this._mTexture;
    }

    public blendTexture(): void {
        cc.log("--");
        // let m: cc.MaterialVariant = this.blendSp.getMaterial(0);
        // m.setProperty("texture", this._mTexture);
        // m.setProperty("srcTexture", this._mTexture);
        // m.setProperty("dstTexture", this._fTexture);
        let text = this.blendTwoTexture(this._mTexture, this._fTexture);
        let sf = new cc.SpriteFrame();
        sf.setTexture(text);
        this.blendSp.spriteFrame = sf;
    }

    public blendTwoTexture(srcTexture: cc.RenderTexture, dstTexture: cc.RenderTexture): cc.RenderTexture {
        let srcData: Uint8Array = srcTexture.readPixels();
        let dstData = srcTexture.readPixels();
        let newData = new Uint8Array();

        for (let index = 0; index < srcData.length; index += 4) {
            let srcAlpha = srcData[index + 3] / 255;
            let dstAlpha = dstData[index + 3] / 255;
            newData[index] = Math.min(srcData[index] * srcAlpha + dstData[index] * dstAlpha);
            newData[index + 1] = Math.min(srcData[index + 1] * srcAlpha + dstData[index + 1] * dstAlpha);
            newData[index + 2] = Math.min(srcData[index + 2] * srcAlpha + dstData[index + 2] * dstAlpha);
            newData[index + 3] = Math.min(srcData[index + 3] * srcAlpha + dstData[index + 3] * dstAlpha);
        }

        let te = new cc.RenderTexture();
        te.initWithData(newData, cc.Texture2D.PixelFormat.RGBA8888, srcTexture.width, srcTexture.height);
        return te;
    }
}