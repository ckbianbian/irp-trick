/**
 *  @description 坐标转换工具类
 */
import BaseUtils from "./BaseUtils";

export default class CoordinateTranslationUtils extends BaseUtils {
    /**
     * 旋转点
     * @param point 目标点
     * @param radian 旋转弧度
     * @param center 旋转中心点
     */
    rotatePoint(point: cc.Vec2, radian: number, center = cc.v2(0, 0)): cc.Vec2 {
        let newPoint = point.clone();
        newPoint.x = center.x + Math.cos(radian) * point.x - Math.sin(radian) * point.y;
        newPoint.y = center.y + Math.sin(radian) * point.x + Math.cos(radian) * point.y;
        return newPoint;
    }
    getPointByRdAndRadio(point: cc.Vec2, radian: number, radio = 1): cc.Vec2 {
        let newPoint = point.clone();
        newPoint.x = radio * Math.cos(radian) + point.x;
        newPoint.y = radio * Math.sin(radian) + point.y;
        return newPoint;
    }

    static convertToCoordPos(node: cc.Node, coord?: cc.Node): cc.Vec2 {
        let result = cc.Vec2.ZERO
        result = node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        if (coord) {
            result = coord.convertToNodeSpaceAR(result);
        }
        return result
    }
}