/**
 *  @description 绘画辅助工具
 */

import Singleton from "../common/Singleton";

export default class GraphicsUtil extends Singleton {

    /** 画圆点 */
    drawCircle(posArr: cc.Vec2[], draw_board: cc.Graphics, radius = 10, color = cc.Color.YELLOW): void {
        for (const pos of posArr) {
            let p = pos.clone();
            draw_board.lineWidth = 1;
            draw_board.fillColor = color;
            draw_board.circle(p.x, p.y, radius);
            draw_board.fill();
            draw_board.stroke();
        }
    }
    /** 画矩形 */
    drawRect(posArr: cc.Vec2[], draw_board: cc.Graphics, wh = cc.v2(10, 10), color = cc.Color.YELLOW): void {
        for (const pos of posArr) {
            let p = pos.clone();
            draw_board.lineWidth = 1;
            draw_board.fillColor = color;
            draw_board.rect(p.x, p.y, wh.x, wh.y);
            draw_board.fill();
            draw_board.stroke();
        }
    }

}