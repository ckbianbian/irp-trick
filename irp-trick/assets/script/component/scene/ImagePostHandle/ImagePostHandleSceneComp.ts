// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GraphicsUtil from "../../../utils/GraphicsUtil";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    obj: cc.Sprite = null;
    @property(cc.Node)
    displayBoard: cc.Node = null;

    start() {
        this.getObjTexture();
    }
    getObjTexture() {
        let texture = GraphicsUtil.getInstance().RenderToMemory(this.obj.node, null, this.displayBoard);
        // let texture: cc.RenderTexture = this.obj.spriteFrame.getTexture();
        let dataArr: Uint8Array = texture.readPixels();
        let testData = new Uint8Array(500 * 500 * 4);
        testData.fill(255);
        let testTexture = new cc.RenderTexture();
        testTexture.initWithData(testData, cc.Texture2D.PixelFormat.RGBA8888, 500, 500);
        let result = GraphicsUtil.getInstance().setPointColorByRGBA(dataArr, texture.width, texture.height);
        cc.log(dataArr);
        cc.log(result);
        this.displayBoard.width = 600;
        this.displayBoard.height = 600;
        this.displayBoard.getComponent(cc.Sprite).spriteFrame.setTexture(testTexture);
    }
    renderToMemory(): cc.RenderTexture {



        return;
    }

}
