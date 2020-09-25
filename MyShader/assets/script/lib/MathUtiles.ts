import Utiles from "./Utiles";

/**
 *  @description 数学方法工具类
 */
export default class MathUtiles extends Utiles {


    /** ------------------------------------数学方法-------------------------------------- */


    /** 随机获取最高和最低之间的数（包含上下限值） */
    static Random(lower = 0, upper = 1) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    }
    /** 获取斜边长通过两边 */
    static GetHypotenuseByWH(a: number, b: number) {
        return Math.round(Math.sqrt(Math.pow(Math.abs(a), 2) + Math.pow(Math.abs(b), 2)));
    }
    /**
     *  @description 通过控制概率获取随机数(不包含上限)
     */
    static GetRandomValueByValueProbability({
        min = 0,
        max = 10,
        valueProbabilityMap = new Map()
    }) {
        let getAvailablePercentage = () => {
            let result = 0;
            let array = valueProbabilityMap.values();
            for (let i of array) {
                if (0 < i && i < 1) result += i;
            }
            return result;
        }
        let setAvailablePercentage = () => {
            let availablePercentage = (1 - getAvailablePercentage()) / (max - min - valueProbabilityMap.size);
            return availablePercentage;
        }
        let random = () => {
            let t = 0,
                r = Math.random();
            for (let i = min; i < max; i++) {
                valueProbabilityMap.has(i) ? t += valueProbabilityMap.get(i) : t += setAvailablePercentage();
                if (t > r) return i;
            }
            return false;
        }
        return random();
    }
    /**
         * !#en Test whether the point is in the polygon
         * !#zh 测试一个点是否在一个多边形中
         * @method pointInPolygon
         * @param {Vec2} point - The point
         * @param {Vec2[]} polygon - The polygon, a set of points
         * @return {boolean}
         */
    static pointInPolygon(point, polygon) {
        var inside = false;
        var x = point.x;
        var y = point.y;

        // use some raycasting to test hits
        // https://github.com/substack/point-in-polygon/blob/master/index.js
        var length = polygon.length;

        for (var i = 0, j = length - 1; i < length; j = i++) {
            var xi = polygon[i].x,
                yi = polygon[i].y,
                xj = polygon[j].x,
                yj = polygon[j].y,
                intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

            if (intersect) inside = !inside;
        }

        return inside;
    }

}