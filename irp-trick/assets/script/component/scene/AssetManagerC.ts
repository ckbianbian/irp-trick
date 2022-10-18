// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SceneC from "../SceneC";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AssetManager extends SceneC {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    /** 远程资源url */
    _url: string = 'textures/tiled/hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    public async GetAsync(url: string) {
        var promise = new Promise(resolve => {
            cc.resources.load(url, cc.SpriteFrame, (error, asset) => {
                if (error) {
                    cc.log(error);
                    return;
                }
                resolve(asset);
            });
        });
        return promise;
    }
    async start() {
        // let resourcesBundle = cc.assetManager.getBundle('resources');
        // cc.log(resourcesBundle);
        // resourcesBundle.load(this._url, cc.SpriteFrame, (error, asset) => {
        //     if (error) {
        //         cc.log(error);
        //         return;
        //     }
        //     this.sprite.spriteFrame = asset;
        // });
        // let spF = resourcesBundle.get(this._url, cc.SpriteFrame);
        // this.sprite.spriteFrame = new cc.SpriteFrame(spF);
        // cc.log(spF);
        // let res = await this.GetAsync(this._url);
        let result = await this.deploySp();
        cc.log(result);
        cc.log('behide');
    }
    change() {
        return this.deploySp();
    }
    async deploySp() {
        let res = await this.GetAsync(this._url) as cc.SpriteFrame;
        this.sprite.spriteFrame = res;
        var promise = new Promise(resolve => {
            this.scheduleOnce(() => {
                // cc.resources.release(this._url);
                resolve('hello');
            }, 3);
        });
        return promise;
    }

    // update (dt) {}
}
