import GameController from "../../controller/GameController";
import SceneC from "../SceneC";

/**
 *  @description 第一次打开游戏的加载界面脚本
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class FirstLoadC extends SceneC {


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


    _onLoad = (): void => {
        try {
            /** 初始化游戏控制类 */
            GameController.InitGameController((completedCount, totalCount, item) => {
                this.loadProgressBar.getComponent(cc.ProgressBar).progress = completedCount / totalCount;
            }, () => {
                let sceneInfo = GameController.GameDataMap.get('scenes');
                this._switchToDefaultScene(sceneInfo.default.name);
            });
        } catch (error) {
            cc.log(error);
        }
    }


    /** 切换到默认场景 */
    private _switchToDefaultScene(name: string, callFunc?: Function) {
        cc.director.preloadScene(name, (err) => {
            if (err) { cc.log(err); return; }
            cc.director.loadScene(name, () => {
                if (callFunc) callFunc();
            });
        });
    }


    /** ------------------------------------子类实现-------------------------------------- */





}