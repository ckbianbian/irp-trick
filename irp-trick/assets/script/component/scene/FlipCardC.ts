// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import FlipCardSprite from "../../../resources/shader/FlipCard/FlipCardSprite";
import { PolygonUtil } from "../../lib/PolygonUtils";

const { ccclass, property } = cc._decorator;
class RectPoint {
    pos: cc.Vec2;
    state: number; // 激活状态
    active: boolean; // 互动状态
}

@ccclass
export default class NewClass extends cc.Component {

    @property({ type: cc.Graphics, displayName: '画板' })
    drawBorad: cc.Graphics = null;
    @property({ type: cc.Node, displayName: '卡牌' })
    card: cc.Node = null;
    @property({ type: cc.Graphics, displayName: '辅助线画板' })
    guideborad: cc.Graphics = null;
    @property({ type: cc.Graphics, displayName: '背景画板' })
    bgBoard: cc.Graphics = null;
    @property({ type: cc.Graphics, displayName: '反射线画板' })
    reflectBoard: cc.Graphics = null;

    topPoint: cc.Vec2 = cc.v2(0, 0);
    bottomPoint: cc.Vec2 = cc.v2(0, 0);
    flipPoint: cc.Vec2 = cc.v2(0, 0); // 翻动的点
    rect: cc.Vec2[] = null;

    rectSize = 2;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.openListen();
        this.topPoint.y = this.card.height / this.rectSize;
        this.bottomPoint.y = -this.card.height / this.rectSize;
        this.flipPoint.y = -this.card.height / this.rectSize;
        this.flipPoint.x = this.card.width / this.rectSize;
        let [l, t, b, r] = [- this.card.width / this.rectSize, this.card.height / this.rectSize, -this.card.height / this.rectSize, this.card.width / this.rectSize];
        this.rect = [
            cc.v2(l, t),
            cc.v2(r, t),
            cc.v2(r, b),
            cc.v2(l, b)
        ];
        this.drawBg();
    }

    start() {

    }

    update(dt) {

    }

    openListen(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartCallFunc, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveCallFunc, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelCallFunc, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCancelCallFunc, this);
    }

    onTouchStartCallFunc(event: cc.Touch): void {
        let pos = event.getLocation();
        let cPos = this.node.convertToNodeSpaceAR(pos);
        this.getPointByTouchPoint(cPos);
    }

    onTouchMoveCallFunc(event: cc.Touch): void {
        let pos = event.getLocation();
        let cPos = this.node.convertToNodeSpaceAR(pos);
        this.getPointByTouchPoint(cPos);
    }

    onTouchCancelCallFunc(event: cc.Touch): void {
        this.drawBorad.clear();
        this.guideborad.clear();
        this.reflectBoard.clear();
        this.card.getComponent(FlipCardSprite).initPic();
    }

    onTouchEndCallFunc(event: cc.Touch): void {
        this.drawBorad.clear();
        this.guideborad.clear();
        this.reflectBoard.clear();
        this.card.getComponent(FlipCardSprite).initPic();
    }

    draw(pos, p1?, p2?, p3?): void {
        this.drawBorad.clear();
        this.drawBorad.strokeColor = cc.Color.BLACK;
        this.drawBorad.lineWidth = 10;
        this.drawBorad.moveTo(pos.x, pos.y);
        if (p3) this.drawBorad.lineTo(p3.x, p3.y);
        this.drawBorad.lineTo(p1.x, p1.y);
        this.drawBorad.lineTo(p2.x, p2.y);
        this.drawBorad.close();
        this.drawBorad.stroke();
    }

    drawNormal(p1, p2): void {
        this.drawBorad.clear();
        this.drawBorad.strokeColor = cc.Color.BLACK;
        this.drawBorad.lineWidth = 10;
        this.drawBorad.moveTo(p2.x, p2.y);
        this.drawBorad.lineTo(p1.x, p1.y);
        this.drawBorad.stroke();
    }

    drawGuide(p1, p2, p3): void {
        this.guideborad.clear();
        this.guideborad.strokeColor = cc.Color.BLUE;
        this.guideborad.lineWidth = 10;
        this.guideborad.moveTo(p2.x, p2.y);
        this.guideborad.lineTo(p1.x, p1.y);
        this.guideborad.stroke();
        this.guideborad.moveTo(p3.x, p3.y);
        this.guideborad.lineTo(this.flipPoint.x, this.flipPoint.y);
        this.guideborad.strokeColor = cc.Color.YELLOW;
        this.guideborad.stroke();
    }

    drawReflect(p1, p2): void {
        this.reflectBoard.clear();
        this.reflectBoard.strokeColor = cc.Color.RED;
        this.reflectBoard.lineWidth = 10;
        this.reflectBoard.moveTo(p2.x, p2.y);
        this.reflectBoard.lineTo(p1.x, p1.y);
        this.reflectBoard.stroke();
    }

    drawBg(): void {
        this.bgBoard.clear();
        this.bgBoard.strokeColor = cc.Color.BLACK;
        this.bgBoard.lineWidth = 10;
        this.bgBoard.moveTo(this.rect[0].x, this.rect[0].y);
        this.bgBoard.lineTo(this.rect[1].x, this.rect[1].y);
        this.bgBoard.lineTo(this.rect[2].x, this.rect[2].y);
        this.bgBoard.lineTo(this.rect[3].x, this.rect[3].y);
        this.bgBoard.close();
        this.bgBoard.stroke();
    }

    getPointByTouchPoint(p: cc.Vec2): void {
        // let angle = p.sub(this.flipPoint).angle(cc.v2(1, 0));
        let cTouchV = p.sub(this.flipPoint);
        let rd = Math.atan2(cTouchV.y, cTouchV.x);
        let slope = -1 / Math.tan(rd);
        slope = Number(slope.toFixed(2));
        let midPoint = cc.v2((p.x + this.flipPoint.x) / 2, (p.y + this.flipPoint.y) / 2);
        let polygons = [this.rect];
        let result = this.getIntersectionByPointAndSlope(midPoint, slope, polygons, p);
        // cc.log(result);
        if (result.length > 1) {
            this.draw(p, result[0], result[1], result[2]);
        }
        else {
            this.drawBorad.clear();
        }
    }

    // 已知线段和点获取对称点
    getReflectPointByPointAndLine(point, p1, p2): cc.Vec2 {
        let vec_r = cc.v2(0, 0);
        let a1 = (p2.y - p1.y) / (p2.x - p1.x);
        let b1 = p2.y - a1 * p2.x;
        let a2 = -1 / a1;
        let b2 = point.y - a2 * point.x;
        let returnX = ((a1 - a2) * point.x + 2 * b1 - 2 * b2) / (a2 - a1);
        let returnY = ((a1 - a2) * point.y - 2 * a1 * b2 + 2 * a2 * b1) / (a2 - a1);

        // let returnX = 2 * (k * k * point.x - k * point.y - b) / k * k - point.x;
        // let returnY = 2 * (point.y - k * point.x - k * b) / k * k - point.y;
        this.drawReflect(p1, cc.v2(returnX, returnY));
        return cc.v2(returnX, returnY);
    }

    judgeGenPoints(p1, p2, p3, p4): any {
        let resultArr = [];
        resultArr.push(p3);
        for (let point of this.rect) {
            if (point.equals(this.flipPoint)) continue;
            let result = PolygonUtil.rayPointToLine(point, p1, p2);
            cc.log(result);
            if (result == -1) {
                let reflectPoint = this.getReflectPointByPointAndLine(point.clone(), p3.clone(), p4.clone());
                cc.log(reflectPoint.x, reflectPoint.y);
                resultArr.push(reflectPoint);
            }
        }
        this.changePicPos(p1, p2, p3, p4);
        resultArr.push(p4);
        return resultArr;
    }

    /** 获取交点通过点和斜率以及多边形数组 */
    getIntersectionByPointAndSlope(point: cc.Vec2, slope: number, polygons, touchP?, range: number = 20000): any[] {
        let p1 = cc.v2(point.x + range + point.x, slope * (point.x + range) + point.y).clone();
        let p2 = cc.v2(point.x - range + point.x, slope * (point.x - range) + point.y).clone();
        let result = [];
        this.drawGuide(p1, p2, touchP);
        for (let polygon of polygons) {
            for (let i = 0; i < polygon.length; i++) {
                let p3 = polygon[i].clone();
                let p4 = i == polygon.length - 1 ? polygon[0].clone() : polygon[i + 1].clone();
                let intersction = PolygonUtil.lineCrossPoint(p1.clone(), p2.clone(), p3.clone(), p4.clone());
                if (intersction[0] > -1) result.push(intersction[1]);
            }
        }
        if (result.length > 1) {
            result = this.judgeGenPoints(p1, p2, result[0], result[1]);
            // this.changePicPos(p1, p2, result[0], result[1]);
        }
        return result;
    }

    /** 根据折叠线修改图片坐标点 */
    changePicPos(p1, p2, p3, p4): void {
        let sprite = this.card.getComponent(FlipCardSprite);
        let yPointNum = sprite.yPointNum;
        let xPointNum = sprite.xPointNum;
        let pointList = sprite._pointList;
        for (let y = 0; y < yPointNum; y++) {
            for (let x = 0; x < xPointNum; x++) {
                let posY = y / (yPointNum - 1) * sprite.node.height;
                let posX = x / (xPointNum - 1) * sprite.node.width;
                let archOffsetX = sprite.node.anchorX * sprite.node.width;
                let archOffsetY = sprite.node.anchorY * sprite.node.height;
                let point = pointList[y][x];
                let pos = cc.v2(posX - archOffsetX, posY - archOffsetY);
                let result = PolygonUtil.rayPointToLine(pos, p1, p2);
                if (result == -1) {
                    let reflectPoint = this.getReflectPointByPointAndLine(pos.clone(), p3.clone(), p4.clone());
                    point.pos = reflectPoint;
                } else {
                    point.pos = pos;
                }
            }
        }
        sprite.setVertsDirty();
    }

}
