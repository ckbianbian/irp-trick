import Controller from "./Controller";

/**
 *  @description 游戏控制类
 */
export default class GameController extends Controller {


    /** ------------------------------------基础属性-------------------------------------- */


    /** 游戏分组枚举 */
    public static GAME_GROUP_ENUM = cc.Enum({
        /** 默认 */
        DEFAULT: 'default',
        /** 角色 */
        ROLE: 'role',
        /** 子弹 */
        BULLET: 'bullet',
        /** 建筑 */
        BUILD: 'build'
    });
    /** 资源配置前缀 */
    public static PREFIX_RES = cc.Enum({
        /** JSON资源前缀 */
        JSON: 'json/',
        /** 角色预制体资源前缀 */
        PREFAB_ROLE: 'prefab/role/',
        /** 子弹预制体资源前缀 */
        PREFAB_BULLET: 'prefab/bullet/'
    });
    /** 资源配置后缀 */
    public static SUFFIX_RES = cc.Enum({
        /** 默认资源后缀 */
        DEFAULT: '',
    });
    /** 系统主配置名称 */
    private static _systemConfig: string = 'SystemConfig';
    /** 游戏数据映射 */
    public static GameDataMap: Map<string, any> = new Map();


    /** ------------------------------------资源方法-------------------------------------- */


    /** ------------------------------------私有方法-------------------------------------- */


    /**
     *  @description 预加载系统文件
     *  @param callFunc 加载完毕回调
     *  @param progressCall 加载过程回调
     */
    private static _preLoadSystemConfig(callFunc?: Function, progressCall?: Function): void {
        try {
            cc.loader.loadRes(this.PREFIX_RES.JSON + this._systemConfig + this.SUFFIX_RES.DEFAULT, null, (err, asset) => {
                if (err) {
                    cc.log(err);
                    return;
                }
                cc.log('>> file load start.')
                cc.log('>>> main system file load start.');
                cc.log(`>>> main file ${asset.name} load completed.`);
                let loadResArray = asset.json.loadResArray;
                cc.log(`>>>> additional file load start.`);
                if (loadResArray && loadResArray.length > 0) {
                    cc.log(`>>>> ${loadResArray.length} additional file need to load.`);
                    cc.loader.loadResArray(loadResArray, null, (completedCount, totalCount, item) => {
                        cc.log(`>>>>> asset ${item.config.name} load completed.`);
                        if (progressCall) progressCall(completedCount, totalCount, item);
                    }, (err, assets) => {
                        if (err) {
                            cc.log(err);
                            return;
                        }
                        cc.log(`>>>> ${assets.length} additional file load completed.`);
                        cc.log('>> file load completed.');
                        loadResArray.push(this.PREFIX_RES.JSON + this._systemConfig + this.SUFFIX_RES.DEFAULT);
                        if (callFunc) callFunc(loadResArray);
                    });
                } else {
                    cc.log(`>>>> no additional file need to load.`);
                    cc.log('>> file load completed.');
                    loadResArray.push(this.PREFIX_RES.JSON + this._systemConfig + this.SUFFIX_RES.DEFAULT);
                    if (callFunc) callFunc(loadResArray);
                }
            });
        } catch (error) {
            cc.log(error);
        }
    }
    /**
     *  @description 初始化游戏数据映射
     *  @param array 需要加载到Map中的资源url数组
     *  @param callFunc 回调函数
     *  @param 加载过程回调
     */
    private static _initGameDataMap(array: Array<string>, callFunc?: Function, progressCall?: Function) {
        try {
            cc.log(`>> load system resource to map start.`);
            for (let i of array) {
                let assetNameList = new Array();
                let asset = cc.loader.getRes(i);
                if (!asset) continue;
                let assetJson = asset.json;
                cc.log(`>>> load ${asset.name} to map start.`);
                for (let j in assetJson) {
                    cc.log(`>>>> load ${asset.name}'s ${j} to map start.`);
                    this.GameDataMap.set(j, assetJson[j]);
                    assetNameList.push(j);
                    cc.log(`>>>> load ${asset.name}'s ${j} to map compeleted.`);
                }
                this.GameDataMap.set(asset.name, assetNameList);
                cc.log(`>>> load ${asset.name} to map compeleted.`);
            }
            cc.log(`>> load system resource to map compeleted.`);
            if (callFunc) callFunc(array);
        } catch (error) {
            cc.log(error);
        }
    }


    /** ------------------------------------通用方法-------------------------------------- */


    /**
     *  @description 释放资源
     *  @param url 需要释放资源的url数组
     *  @param callFunc 释放完毕回调
     *  @param progressCall 释放过程回调
     */
    public static ReleaseAssets(urls: string | Array<string>, callFunc?: Function, progressCall?: Function) {
        try {
            cc.log(`> release resource start.`);
            if (typeof urls == 'string') {
                cc.log(`>> release resource ${urls} start.`);
                cc.loader.release(urls);
                cc.log(`>> release resource ${urls} compeleted.`);
            } else {
                cc.log(`>> ${urls.length} file have to release.`);
                let num = 0;
                for (let url of urls) {
                    cc.log(`>>> release resource ${url} start.`);
                    cc.loader.release(url);
                    num++;
                    cc.log(`>>> release resource ${url} compeleted.`);
                }
                cc.log(`>> ${num} file release compeleted.`);
            }
            cc.log(`> release resource compeleted.`);
            if (callFunc) callFunc(urls);
        } catch (error) {
            cc.log(error);
        }
    }
    /**
     *  @description 初始化游戏控制类
     *  @param progressCall 过程中回调
     *  @param callFunc 结束回调
     */
    public static InitGameController(progressCall?: Function, callFunc?: Function): void {
        cc.log('> init GameController start.');
        /** 预加载系统配置 */
        this._preLoadSystemConfig((array: any) => {
            /** 初始化游戏数据映射 */
            this._initGameDataMap(array, (array: any) => {
                /** 释放加载过的资源 */
                this.ReleaseAssets(array);
            });
            cc.log('> init GameController completed.');
            if (callFunc) callFunc();
        }, progressCall ? progressCall : null);
    }
}
