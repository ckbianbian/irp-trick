/**
 *  @description 3d旋转卡牌汇编器
 */

import GTAssembler2D from "../GTAssembler2D";
import ZRoteCard3DSprite from "./ZRoteCard3DSprite";

export default class ZRoteCard3DAssembler extends GTAssembler2D {

    updateUVs(sprite: cc.RenderComponent): void {
        let uv = sprite._spriteFrame.uv;
        let uvOffset = this.uvOffset;
        let floatsPerVert = this.floatsPerVert;
        let verts = this._renderData.vDatas[0];
        for (let i = 0; i < 4; i++) {
            let srcOffset = i * 2;
            let dstOffset = floatsPerVert * i + uvOffset;
            verts[dstOffset] = uv[srcOffset];
            verts[dstOffset + 1] = uv[srcOffset + 1];
        }
    }

    // 更新顶点
    updateVerts(sprite: ZRoteCard3DSprite) { // 5
        if (sprite) {
            let local = this._local;
            let pointList = sprite.getVertPos();
            local[0] = pointList[0][0];
            local[1] = pointList[0][1];
            local[2] = pointList[1][0];
            local[3] = pointList[1][1];
        }
        this.updateWorldVerts(sprite);
    }

    /** WebGL更新世界顶点坐标 */
    updateWorldVertsWebGL(comp) {
        // cc.log('updateWorldVertsWebGL');
        let local = this._local;
        let verts = this._renderData.vDatas[0];

        let matrix = comp.node._worldMatrix;
        let matrixm = matrix.m,
            a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
            tx = matrixm[12], ty = matrixm[13];

        let vl = local[0], vr = local[2], // vl 顶点左边位置  vr 顶点右边位置  vb 顶点底部位置  vt 顶点顶部位置
            vb = local[1], vt = local[3];

        let justTranslate = a === 1 && b === 0 && c === 0 && d === 1;

        // render data = verts = x|y|u|v|color|x|y|u|v|color|...
        // 填充render data中4个顶点的xy部分
        let index = 0;
        let floatsPerVert = this.floatsPerVert;
        for (let i = 0; i < this.verticesCount; i++) {
            let p0 = local[i];
            verts[index] = p0.x * a + p0.y * c + tx;
            verts[index + 1] = p0.x * b + p0.y * d + ty;
            index += floatsPerVert;
        }
    }

}