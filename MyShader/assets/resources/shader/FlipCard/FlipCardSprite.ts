/**
 *  @description 翻转卡牌的精灵类
 */

import GTAssembler2D from "../GTAssembler2D";
import FlipCardAssembler from "./FlipCardAssembler";

const { ccclass, property } = cc._decorator;

class VertInfo {
    public pos: cc.Vec2;
    constructor(x: number, y: number) {
        this.pos = cc.v2(x, y);
    }
}

@ccclass
export default class FlipCardSprite extends cc.Sprite {

    @property({ displayName: 'x轴方向点数量' })
    xPointNum = 2;
    @property({ displayName: 'y轴方向点数量' })
    yPointNum = 3;
    @property({ displayName: '正面', type: cc.Texture2D })
    faceTexture: cc.Texture2D = null;
    @property({ displayName: '反面', type: cc.Texture2D })
    backTexture: cc.Texture2D = null;

    _pointList = [];
    _timer = 0;

    onEnable() { // 2
        super.onEnable();
        // cc.log('onEnable');
        this.cfgPos();
        // this.scheduleOnce(() => {
        //     // let point = this._pointList[this.yPointNum - 1][this.xPointNum - 1];
        //     // cc.log(point.pos.x, point.pos.y);
        //     // point.pos.x = point.pos.x + 30;
        //     // point.pos.y = point.pos.y + 30;
        //     this.foldCard();
        //     this.setVertsDirty();
        // }, 3);
    }

    update(dt) {

    }

    // 初始化
    initPic() {
        this.cfgPos();
        this.setVertsDirty();
    }

    // 折叠计算顶点位置
    foldCard() {
        for (let y = 0; y < this.yPointNum; y++) {
            for (let x = 0; x < this.xPointNum; x++) {
                if (this._pointList[y][x]) {
                    let posY = y / (this.yPointNum - 1) * this.node.height;
                    // let posX = x / (this.xPointNum - 1) * this.node.width;
                    let point = this._pointList[y][x];
                    // if (point.pos.x >= 75) {
                    //     point.pos.x -= 2 * (point.pos.x - 75);
                    // }
                    let tempPos = cc.v2(0, 0);
                    if (point.pos.x + point.pos.y <= -50) {
                        tempPos.x = -50 - point.pos.y;
                        tempPos.y = -50 - point.pos.x;
                        point.pos.x = tempPos.x;
                        point.pos.y = tempPos.y;
                    }
                }
            }
        }
    }

    // 旗帜飘动
    flapWave(dt) {
        let time = cc.director.getTotalTime();
        for (let y = 0; y < this.yPointNum; y++) {
            for (let x = 0; x < this.xPointNum; x++) {
                if (this._pointList[y][x]) {
                    let posY = y / (this.yPointNum - 1) * this.node.height;
                    // let posX = x / (this.xPointNum - 1) * this.node.width;
                    let point = this._pointList[y][x];
                    let sinY = Math.sin((point.pos.x + time) / 50) * 8;
                    point.pos.y = posY + sinY;
                }
            }
        }
    }


    _resetAssembler() { // 1
        this.setVertsDirty();
        // cc.log('_resetAssembler');
        let assembler = this._assembler = new FlipCardAssembler();
        assembler.init(this);
    }

    cfgPos(): void {
        for (let y = 0; y < this.yPointNum; y++) {
            if (!this._pointList[y]) {
                this._pointList[y] = [];
            }
            let archOffsetX = this.node.anchorX * this.node.width;
            let archOffsetY = this.node.anchorY * this.node.height;
            let posY = y / (this.yPointNum - 1) * this.node.height;
            for (let x = 0; x < this.xPointNum; x++) {
                let posX = x / (this.xPointNum - 1) * this.node.width;
                this._pointList[y][x] = new VertInfo(posX - archOffsetX, posY - archOffsetY);
            }
        }
        if (!CC_EDITOR) {
            // cc.log(this._pointList);
        }
    }

    getPosList(): any {
        let pointList = []
        for (let i = 0; i < this.yPointNum; i++) {
            if (!pointList[i]) {
                pointList[i] = []
            }
        }
        for (let i = 0; i < this.yPointNum; i++) {
            for (let j = 0; j < this.xPointNum; j++) {
                let point1 = this._pointList[i][j]
                pointList[i][j] = cc.v2(point1.pos.x, point1.pos.y)
            }
        }

        return pointList;
    }

}