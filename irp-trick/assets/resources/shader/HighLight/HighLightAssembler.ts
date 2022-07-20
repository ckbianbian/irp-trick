/**
 *  @description 高亮特效装配器
 */

import GTAssembler2D from "../GTAssembler2D";
import HighLightSprite from "./HighLightSprite";

export default class HighLightAssembler extends GTAssembler2D {

    updateColor(sprite: HighLightSprite, color) { // 6
        // render data = verts = x|y|u|v|color|x|y|u|v|color|...
        // 填充render data中4个顶点的color部分
        let uintVerts = this._renderData.uintVDatas[0];
        if (!uintVerts) return;
        color = color != null ? color : sprite.node.color._val;
        let floatsPerVert = this.floatsPerVert;
        let colorOffset = this.colorOffset;
        let green = cc.Color.GREEN;
        let arr = [cc.Color.RED, cc.Color.GREEN, cc.Color.BLUE, cc.Color.RED];
        let index = 0;
        for (let i = colorOffset, l = uintVerts.length; i < l; i += floatsPerVert) {
            uintVerts[i] = color;
            // uintVerts[i] = arr[index]._val;
            // index++;
        }
    }

}