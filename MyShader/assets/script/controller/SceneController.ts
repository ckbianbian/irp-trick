import Controller from "./Controller";

/**
 *  @description 场景控制类
 */
export default class SceneController extends Controller {



    /** ------------------------------------属性-------------------------------------- */


    public static SCENES_NAME_ENUM = cc.Enum({
        DEFAULT: 'hall',
        LOAD: 'load',
        BATTLE: 'battle',
    });


    /** ------------------------------------通用方法-------------------------------------- */


    /**
     *  @description 切换场景
     *  @param name 切换的场景名称
     *  @param callFunc 结束回调
     *  @param progressCall 过程回调
     */
    public static SwitchScene(name: string, callFunc?: Function, progressCall?: Function) {
        try {
            cc.log(`> switch scene ${name} start.`);
            cc.log(`>> preload scene ${name} start.`);
            /** 预加载loading场景后加载对应需要切换的场景 */
            cc.director.preloadScene(this.SCENES_NAME_ENUM.LOAD, (err) => {
                if (err) { cc.log(err); return; }
                /** 运行loading场景 */
                cc.director.loadScene(this.SCENES_NAME_ENUM.LOAD, () => {
                    /** 预加载场景 */
                    cc.director.preloadScene(name, (completedCount, totalCount, item) => {
                        let progress = completedCount / totalCount;
                        let loadingProgress = cc.director.getScene().getChildByName('Canvas').ins.loadProgressBar;
                        loadingProgress.getComponent(cc.ProgressBar).progress = progress;
                        if (progressCall) progressCall(completedCount, totalCount, item);
                    }, (err, asset) => {
                        if (err) { cc.log(err); return; }
                        cc.log(`>> preload scene ${name} compeleted.`);
                        cc.log(`>>> load scene ${name} start.`);
                        this._switchSceneHandler(asset, callFunc);
                    });
                });
            });
        } catch (error) {
            cc.log(error);
        }
    }


    /** ------------------------------------私有方法-------------------------------------- */


    /**
     *  @description 切换场景控制器
     *  @param asset 场景资源
     *  @param callFunc 结束回调
     */
    private static _switchSceneHandler(asset: any, callFunc: Function) {
        if (!asset || !asset.name) return;
        switch (asset.name) {
            // case this.SCENES_NAME_ENUM.DEFAULT:
            //     this._switchToHallScene(asset, callFunc);
            //     break;
            default:
                this._switchScene(asset, callFunc);
                break;
        }
    }


    /**
     * @description 默认切换场景方法
     * @param asset 场景资源
     * @param callFunc 结束回调
     */
    private static _switchScene(asset: any, callFunc: Function) {
        cc.director.loadScene(asset.name, () => {
            cc.log(`>>> load scene ${asset.name} compelet.`);
            cc.log(`> switch scene ${asset.name} compelet.`);
            if (callFunc) callFunc();
        });
    }


    /**
     * @description 切换到大厅场景
     * @param asset 场景资源
     * @param callFunc 结束回调
     */
    private static _switchToHallScene(asset: any, callFunc: Function) {
        cc.director.loadScene(asset.name, () => {
            cc.log(`>>> load scene ${asset.name} compelet.`);
            cc.log(`> switch scene ${asset.name} compelet.`);
            if (callFunc) callFunc();
        });
    }


}