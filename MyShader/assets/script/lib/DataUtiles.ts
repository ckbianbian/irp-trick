import Utiles from "./Utiles";

/**
 *  @description 数据工具类
 */
export default class DataUtiles extends Utiles {


    /** ------------------------------------数据方法-------------------------------------- */


    /**
         *  @description 字符串加密
         */
    public static Encrypt(str: string) {
        var c = String.fromCharCode(str.charCodeAt(0) + str.length);
        for (var i = 1; i < str.length; i++) {
            c += String.fromCharCode(str.charCodeAt(i) + str.charCodeAt(i - 1));
        }
        return escape(c);
    }
    /**
     *  @description 字符串解密
     */
    public static Decrypt(str: string) {
        str = unescape(str);
        var c = String.fromCharCode(str.charCodeAt(0) - str.length);
        for (var i = 1; i < str.length; i++) {
            c += String.fromCharCode(str.charCodeAt(i) - c.charCodeAt(i - 1));
        }
        return c;
    }
    /**
     *  @description Map转对象
     */
    public static StrMapToObj(strMap: any) {
        let obj = Object.create(null)
        for (let [k, v] of strMap) {
            obj[k] = v;
        }
        return obj;
    }
    /**
     *  @description 对象转Map
     */
    public static ObjToStrMap(obj: any) {
        let strMap = new Map();
        for (let k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;
    }
    /**
     *  @description Map转JSON
     */
    public static StrMapToJson(strMap: Map<string, any>) {
        return JSON.stringify(this.StrMapToObj(strMap));
    }
    /**
     *  @description JSON转Map
     */
    public static JsonToStrMap(jsonStr: any) {
        return this.ObjToStrMap(JSON.parse(jsonStr));
    }


}