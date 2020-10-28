import GameController from "../../controller/GameController";
import SceneC from "../SceneC";

/**
 *  @description 第一次打开游戏的加载界面脚本
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class RayCollisionComp extends SceneC {


    /** ------------------------------------基础属性-------------------------------------- */


    @property({
        displayName: '目标节点'
    })
    targetNode = null;


    /** ------------------------------------基础方法-------------------------------------- */


    _onLoad(): void {

    }


    /** ------------------------------------子类实现-------------------------------------- */





}