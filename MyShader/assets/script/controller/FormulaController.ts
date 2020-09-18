import Controller from "./Controller";

/**
 *  @description 公式管理类
 */
export default class FormulaController extends Controller {


    /** ------------------------------------私有方法-------------------------------------- */


    /** 解析公式 */
    private static _analysisFormula(formula: string, key: string): Array<string> {
        return formula.split(key);
    }


    /** ------------------------------------公有方法-------------------------------------- */


    /** 通过传入对象获取数值 */
    public static GetResultByObjAndFormula(formula: any, obj: any): number {
        let array = this._analysisFormula(formula.value, formula.key);
        for (let i = 0; i < array.length; i++) {
            let elm = array[i];
            if (!elm.search(/[A-Za-z]/i)) { // 不符合要求的字符串
                if (!obj[elm]) { cc.log(`obj not have this ${i} property. `); return -1; };
                array[i] = obj[elm];
            }
        }
        return eval(array.join(''));
    }

}