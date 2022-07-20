/**
 *  @description 高亮精灵脚本
 */

import HighLightAssembler from "./HighLightAssembler";

const { ccclass, property } = cc._decorator

@ccclass
export default class HighLightSprite extends cc.Sprite {
    _assembler = null;
    _resetAssembler() { // 1
        this.setVertsDirty();
        // cc.log('_resetAssembler');
        let assembler = this._assembler = new HighLightAssembler();
        assembler.init(this);
    }
}