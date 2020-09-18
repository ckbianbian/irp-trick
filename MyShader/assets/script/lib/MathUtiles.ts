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


}