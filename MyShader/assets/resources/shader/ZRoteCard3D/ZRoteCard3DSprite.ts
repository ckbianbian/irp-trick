/**
 *  @description 3d卡片旋转精灵组件
 */

import ZRoteCard3DAssembler from "./ZRoteCard3DAssembler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ZRoteCard3DSprite extends cc.Sprite {

    _vertPos: any[][] = null;
    _deviationX = 0;
    _deviationY = 0;
    _yIncrement = 0.3;
    _count = 0;
    _deviationYMax = 30;

    onEnable(): void {
        super.onEnable();
        this.configVertPos();
    }

    update(): void {
        this._deviationY += this._yIncrement;
        this._count += Math.abs(this._yIncrement);
        if (this._deviationY >= this._deviationYMax) {
            this._yIncrement = Math.abs(this._yIncrement) * -1;
        }
        if (this._deviationY <= 0) {
            this._yIncrement = Math.abs(this._yIncrement);
        }
        this._deviationX = this._count / (this._deviationYMax * 2) * this.node.width;
        if (this._count >= (this._deviationYMax * 2)) {
            this._count = 0;
        }

        this.setVertsDirty();
    }

    _resetAssembler(): void { // 1
        this.setVertsDirty();
        let assembler = this._assembler = new ZRoteCard3DAssembler();
        assembler.init(this);
    }

    configVertPos(): any {
        let offsetX = this.node.anchorX * this.node.width;
        let offsetY = this.node.anchorY * this.node.height;
        let yDisplacement = this._deviationY;
        let xDisplacement = this._deviationX;
        // let yDisplacement = 5;
        // let xDisplacement = 50;
        let vl = xDisplacement, vr = this.node.width - xDisplacement, vt = this.node.height, vb = 0;
        vl -= offsetX;
        vr -= offsetX;
        vt -= offsetY;
        vb -= offsetY;
        this._vertPos = [];
        this._vertPos[0] = [];
        this._vertPos[1] = [];
        this._vertPos[0][0] = cc.v2(vl, vb + yDisplacement);
        this._vertPos[0][1] = cc.v2(vr, vb);
        this._vertPos[1][0] = cc.v2(vl, vt - yDisplacement);
        this._vertPos[1][1] = cc.v2(vr, vt);
        return this._vertPos;
    }

    getVertPos(): any {
        this.configVertPos();
        return this._vertPos;
    }

}

class VertPosModel {
    pos: cc.Vec2;
}