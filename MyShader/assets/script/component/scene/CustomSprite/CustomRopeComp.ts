/**
 *  @description 自定义绳子
 */

import BezierUtils from "../../../utils/BezierUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CustomRopeComp extends cc.Component {
    update(dt): void {

    }

    start(): void {
        let ropeArr = BezierUtils.CreateBezierPoints([{ x: 0, y: 0 }, { x: 50, y: 100 }, { x: 100, y: 0 }], 50);
    }
}