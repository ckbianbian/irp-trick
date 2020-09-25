/**
 *  @description Data控制类
 */

import Controller from "./Controller";
import GameController from "./GameController";

export default class DataController extends Controller {


    /** ------------------------------------基础属性-------------------------------------- */





    /** ------------------------------------基础方法-------------------------------------- */


    /** 通过ID获得数据 */
    public static GetDataById(id: string): any {
        let result = GameController.GameDataMap.has(id);
        if (result) {
            return JSON.parse(JSON.stringify(GameController.GameDataMap.get(id)));
        }
        return false;
    }


}