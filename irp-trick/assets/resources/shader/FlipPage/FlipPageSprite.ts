// Copyright 2020 Cao Gaoting<caogtaa@gmail.com>
// https://caogtaa.github.io
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/*
 * Date: 2020-07-13 02:44:17
 * LastEditors: GT<caogtaa@gmail.com>
 * LastEditTime: 2020-07-22 14:03:32
*/

import FlipPageAssembler from "./FlipPageAssembler";

const { ccclass, property } = cc._decorator;

class MassPoint {
    public oldPos: cc.Vec2
    public newPos: cc.Vec2
    public force: cc.Vec2
    public isFix

    constructor(x: number, y: number, tmpF: cc.Vec2, isFix) {
        this.oldPos = this.newPos = cc.v2(x, y)
        this.force = tmpF
        this.isFix = isFix || false
    }
}

@ccclass
export default class MovingBGSprite extends cc.Sprite {

    public pointsCount: number = 4; // 点总数
    private _pointList = [];
    public flag = 10;

    public FlushProperties() {
        //@ts-ignore
        let assembler: FlipPageAssembler = this._assembler;
        if (!assembler)
            return;
        this.setVertsDirty();
    }

    onEnable() {
        super.onEnable();
        this.initPointList();
        this.schedule(this.updateParam, 0.3);
    }

    /** 更新参数 */
    updateParam() {
        this.flag *= -1;
        this.FlushProperties();
    }

    // 初始化质点
    public initPointList() {
        for (let i = 0; i < this.pointsCount; i++) {
            if (!this._pointList[i]) {
                this._pointList[i] = []
            }
            let posY = i / (this.pointsCount - 1) * this.node.height
            for (let j = 0; j < this.pointsCount; j++) {
                let posX = j / (this.pointsCount - 1) * this.node.width
                this._pointList[i][j] = new MassPoint(posX, posY, cc.v2(0, 0), false)
            }
        }
        //四角定点
        this._pointList[0][0].isFix = true
        this._pointList[0][this.pointsCount - 1].isFix = true
        this._pointList[this.pointsCount - 1][0].isFix = true
        this._pointList[this.pointsCount - 1][this.pointsCount - 1].isFix = true
    }

    public getPointList() {
        let pointList = []
        for (let i = 0; i < this.pointsCount; i++) {
            if (!pointList[i]) {
                pointList[i] = []
            }
        }
        for (let i = 0; i < this.pointsCount; i++) {
            for (let j = 0; j < this.pointsCount; j++) {
                let point1 = this._pointList[i][j]
                pointList[i][j] = cc.v2(point1.newPos.x, point1.newPos.y)
            }
        }

        return pointList
    }

    // // 使用cc.Sprite默认逻辑
    _resetAssembler() {
        this.setVertsDirty();
        let assembler = this._assembler = new FlipPageAssembler();
        this.FlushProperties();

        assembler.init(this);

        //@ts-ignore
        this._updateColor();        // may be no need
    }
}
