import Utils from "./Utiles";

/**
 *  @description 数学方法工具类
 */
export default class MathUtils extends Utils {

    static attenuation_constant = {
        one: { constant: 1.0, linear: 0.7, quadratic: 1.8 },
        two: { constant: 1.0, linear: 0.35, quadratic: 0.44 },
        three: { constant: 1.0, linear: 0.22, quadratic: 0.20 },
        four: { constant: 1.0, linear: 0.09, quadratic: 0.032 },
        five: { constant: 1.0, linear: 0.07, quadratic: 0.017 },
        six: { constant: 1.0, linear: 0.045, quadratic: 0.0075 },
        seven: { constant: 1.0, linear: 0.027, quadratic: 0.0028 },
        eight: { constant: 1.0, linear: 0.022, quadratic: 0.0019 },
        nine: { constant: 1.0, linear: 0.014, quadratic: 0.0007 },
        ten: { constant: 1.0, linear: 0.007, quadratic: 0.0002 },
        zero: { constant: 1.0, linear: 0.0014, quadratic: 0.000007 },
    }

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
    static transformTwoDimensionalToOne(arr): any[] {
        let result = [];
        for (let i = 0; i < arr.length; i++) {
            let array = arr[i];
            for (let k = 0; k < array.length; k++) {
                result.push(array[k]);
            }
        }
        return result;
    }
    /** 将二维数组分割为四个象限数组 */
    static divisionArrToFourQuadrantsTree(arr): any[] {
        let result = [];
        let limitArr = this.getDivisionLimitIndex(arr);
        for (let obj of limitArr) {
            result.push(this.divisionArrToNewArrByLimit(arr, obj));
        }
        return result;
    }
    static divisionArrToNewArrByLimit(arr, limitObj): any[] {
        let result = [];
        for (let row = limitObj.rowMin; row < limitObj.rowMax; row++) {
            let rowArr = [];
            for (let column = limitObj.columnMin; column < limitObj.columnMax; column++) {
                rowArr.push(arr[row][column]);
            }
            result.push(rowArr);
        }
        return result;
    }
    static getDivisionLimitIndex(arr): { columnMin, rowMin, columnMax, rowMax }[] {
        let rowNum = arr.length, columnNum = arr[0].length;
        let centerRow = Math.ceil(rowNum / 2), centerColumn = Math.ceil(columnNum / 2);
        return [{ columnMin: centerColumn, rowMin: centerRow, columnMax: columnNum, rowMax: rowNum },
        { columnMin: 0, rowMin: centerRow, columnMax: centerColumn, rowMax: rowNum },
        { columnMin: 0, rowMin: 0, columnMax: centerColumn, rowMax: centerRow },
        { columnMin: centerColumn, rowMin: 0, columnMax: columnNum, rowMax: centerRow }];
    }
    // 创造一个从0开始的数组 数组长度自定义
    static CreateArrIndexByArrLength(num): number[] {
        let result = [];
        for (let index = 0; index < num; index++) {
            result.push(index);
        }
        return result;
    }
    // 随机打乱数组
    static Shuffle(arr) {
        let _arr = arr.slice(); //slice不会影响原来的数组，但是splice就会影响原来的arr数组
        for (let i = 0; i < _arr.length; i++) {
            let j = this.Random(0, i);
            let t = _arr[i];
            _arr[i] = _arr[j];
            _arr[j] = t;
        }
        return _arr;
    }
    static genUUID(len = 16, radix = 16) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [],
            i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    }
    static RankArray<T>(arr: T[], num = arr.length): T[] {
        let result = [];
        let startTime = new Date().getTime();
        for (let i = 0; i < arr.length; i++) {
            let otherArr = arr.slice(0, arr.length);
            let tempArr = otherArr.splice(i, 1);
            for (let j = 0; j < num; j++) {
                let temp = [];
                while (tempArr.length > 0) {
                    let elm = tempArr.shift();
                    result.push(elm);
                    for (let other of otherArr) {
                        if (elm.indexOf(other) == -1) {
                            temp.push(elm + "" + other);
                        }
                    }
                }
                tempArr = temp;
            }
        }

        let endTime = new Date().getTime();
        cc.log(result);
        cc.log("startTime-----------:", startTime);
        cc.log("endTime-----------:", endTime);
        cc.log("耗时-----------:", endTime - startTime);

        return arr;
    }
    // ax^2+bx+c = 0;
    static CalculateUnivariateQuadraticEquation(a, b, c): any[] {
        let delta = b * b - 4 * a * c;
        let result = [];
        let x1, x2;
        if (delta > 0) {
            x1 = -b / (2 * a) + Math.sqrt(delta) / (2 * a);
            x2 = -b / (2 * a) - Math.sqrt(delta) / (2 * a);
            result.push(x1);
            result.push(x2);
        } else if (delta == 0) {
            x1 = -b / (2 * a);
            result.push(x1);
        } else {
            cc.log("方程没有实根!");
        }
        return result;
    }
    // 获取碰撞时间
    static GetMotionObjBeAttackedTime(a, b, c): number[] {
        let result = [];
        let resultArr = this.CalculateUnivariateQuadraticEquation(a, b, c);
        for (let i = 0; i < resultArr.length; i++) {
            if (resultArr[i] >= 0) {
                result.push(resultArr[i]);
            }
        }
        return result;
    }
    // 通过固定发射点和发射速度，移动物体的点和移动物体移动速度方向获取碰撞拦截点
    static GetCollisionPointByTwoPointAndSpeed(firePos: cc.Vec2, speed: number, targetPos: cc.Vec2, targetObjSpeedVec: cc.Vec2): any {
        let result;

        let a = speed * speed - (targetObjSpeedVec.x * targetObjSpeedVec.x) - (targetObjSpeedVec.y * targetObjSpeedVec.y);
        let b = -1 * (2 * targetObjSpeedVec.x * (targetPos.x - firePos.x)) - 1 * (2 * targetObjSpeedVec.y * (targetPos.y - firePos.y));
        let c = -(targetPos.x - firePos.x) * (targetPos.x - firePos.x) - (targetPos.y - firePos.y) * (targetPos.y - firePos.y);

        // cc.log("a=", a, "b=", b, "c=", c);
        let timeArr = this.GetMotionObjBeAttackedTime(a, b, c);
        if (timeArr.length <= 0) {
            return false;
        }

        let time = timeArr[0];
        cc.log("相遇时间", time);
        let collisionPos = cc.v2(0, 0);
        targetPos.add(targetObjSpeedVec.clone().multiplyScalar(time), collisionPos);
        result = collisionPos.clone();

        return result;
    }
    // 根据距离的光线强度衰减公式
    static DisAttenuation(distance: number, obj: { constant, linear, quadratic } = MathUtils.attenuation_constant.one): number {
        let result = 1.0 / (obj.constant + obj.linear * distance + obj.quadratic * (distance * distance));
        return result;
    }
    static FormatNumber(num: number, retain = 100) {
        return (Math.round(num * retain)) / retain;
    }

}