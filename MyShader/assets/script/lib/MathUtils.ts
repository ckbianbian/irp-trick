import Utils from "./Utiles";

/**
 *  @description 数学方法工具类
 */
export default class MathUtils extends Utils {


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
}