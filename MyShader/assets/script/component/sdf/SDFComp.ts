import MathUtiles from "../../lib/MathUtiles";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    start() {
        let num = this.sdSegment(cc.v2(-1, 2), cc.v2(0, 0), cc.v2(1, 0));
        cc.log(num);
    }

    /**
     *  圆形：  1. 原点位于中心点
     *         2. r表示半径
     */
    sdCircle(p, r): void {

    }

    /**
     * 线段：  1. a，b表示线段两个端点的坐标
     */
    sdSegment(p: cc.Vec2, a: cc.Vec2, b: cc.Vec2): number {
        let pa = p.sub(a), ba = b.sub(a)
        let h = this.clamp(pa.dot(ba) / ba.dot(ba), 0, 1);
        cc.log(pa.dot(ba) / ba.dot(ba))
        cc.log(h);
        return pa.sub(ba.mulSelf(h)).mag();
    }

    clamp(a, min, max): number {
        if (a < min) return min;
        if (a > max) return max;
        return a;
    }

}
