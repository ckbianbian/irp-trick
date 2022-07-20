import SceneC from "../SceneC";

/**
 *  @description 切换场景加载场景
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadC extends SceneC {


    /** ------------------------------------基础属性-------------------------------------- */


    @property({
        type: cc.Node,
        displayName: '加载界面背景',
    })
    loadBg = null;
    @property({
        type: cc.Node,
        displayName: '加载进度条',
    })
    loadProgressBar = null;


    /** ------------------------------------基础方法-------------------------------------- */


    _onLoad(): void {

    }


    /** ------------------------------------子类实现-------------------------------------- */





}