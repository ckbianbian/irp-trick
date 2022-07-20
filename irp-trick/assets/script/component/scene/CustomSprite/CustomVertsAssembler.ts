/**
 *  @desc   自定义顶点汇编器
 */

import CustomAssembler2D from "../../../shader/CustomAssembler2D";
import CustomRenderer from "./CustomRenderer";
let gfx = cc.gfx;
var vfmtPosCenterWeb = new gfx.VertexFormat([
    { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },   // 粒子顶点（1个粒子有3个或4个顶点）
    { name: "a_center", type: gfx.ATTR_TYPE_FLOAT32, num: 2 }           // 原粒子中心（每个顶点相同数据）
]);

var vfmtPosCenterNative = new gfx.VertexFormat([
    { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },   // 粒子顶点（1个粒子有3个或4个顶点）
    { name: "a_corner", type: gfx.ATTR_TYPE_FLOAT32, num: 2 },          // a_position的冗余，a_position在native是个大坑
    { name: "a_center", type: gfx.ATTR_TYPE_FLOAT32, num: 2 }           // 原粒子中心（每个顶点相同数据）
]);

var vfmtPosUvColor = new gfx.VertexFormat([
    { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_UINT8, num: 4, normalize: true },
]);
export default class CustomVertsAssembler extends CustomAssembler2D {

    verticesCount = 8;
    indicesCount = 12;

    getVfmt() {
        if (CC_NATIVERENDERER)
            return vfmtPosUvColor;

        return vfmtPosUvColor;
    }

    initData() {
        let data = this._renderData;
        data.createFlexData(0, this.verticesFloats, this.indicesCount);
        this.initUVs();
        // this._updateIndices();
    }
    _updateIndices() {
        let iData = this._renderData.iDatas[0];
        for (let i = 0, vid = 0, l = iData.length; i < l; i += 6, vid += 4) {
            iData[i] = vid;
            iData[i + 1] = vid + 1;
            iData[i + 2] = vid + 2;
            iData[i + 3] = vid + 1;
            iData[i + 4] = vid + 3;
            iData[i + 5] = vid + 2;
        }
    }

    fillBuffers(comp, renderer) {
        let { vData, iData, usedVertices, usedIndices, usedVerticesFloats } = this._renderData._flexBuffer;

        let buffer = renderer._meshBuffer;
        let offsetInfo = buffer.request(usedVertices, usedIndices);

        // buffer data may be realloc, need get reference after request.

        // fill vertices
        let vertexOffset = offsetInfo.byteOffset >> 2,
            vbuf = buffer._vData;

        if (vData.length + vertexOffset > vbuf.length) {
            vbuf.set(vData.subarray(0, usedVerticesFloats), vertexOffset);
        }
        else {
            vbuf.set(vData, vertexOffset);
        }

        // fill indices
        let ibuf = buffer._iData,
            indiceOffset = offsetInfo.indiceOffset,
            vertexId = offsetInfo.vertexOffset;
        for (let i = 0, l = iData.length; i < l; i++) {
            ibuf[indiceOffset++] = vertexId + iData[i];
        }
    }

    initUVs() {
        let indices = this._renderData.iDatas[0];
        let count = indices.length / 6;
        // cc.log(indices.length);
        for (let i = 0, idx = 0; i < count; i++) {
            let vertextID = i * 4;
            indices[idx++] = vertextID;
            indices[idx++] = vertextID + 1;
            indices[idx++] = vertextID + 2;
            indices[idx++] = vertextID + 1;
            indices[idx++] = vertextID + 3;
            indices[idx++] = vertextID + 2;
        }
    }

    updateWorldVerts(comp: CustomRenderer): void {
        let local = this._local;
        let verts = this._renderData.vDatas[0];

        let vertexOffset = 0;
        let floatsPerVert = this.floatsPerVert;
        let vertsArr = comp.rectVertArr;

        for (let index = 2; index < vertsArr.length; index += 2) {
            // left bottom
            verts[vertexOffset] = vertsArr[index - 2].x;
            verts[vertexOffset + 1] = vertsArr[index - 2].y;
            vertexOffset += floatsPerVert;
            // right bottom
            verts[vertexOffset] = vertsArr[index].x;
            verts[vertexOffset + 1] = vertsArr[index].y;
            vertexOffset += floatsPerVert;
            // left top
            verts[vertexOffset] = vertsArr[index - 1].x;
            verts[vertexOffset + 1] = vertsArr[index - 1].y;
            vertexOffset += floatsPerVert;
            // right top
            verts[vertexOffset] = vertsArr[index + 1].x;
            verts[vertexOffset + 1] = vertsArr[index + 1].y;
            vertexOffset += floatsPerVert;
        }
        // cc.log(verts);
        // cc.log(verts);
    }

    normalVertsCalculate(comp) {
        let local = this._local;
        let verts = this._renderData.vDatas[0];

        let matrix = comp.node._worldMatrix;
        let matrixm = matrix.m,
            a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
            tx = matrixm[12], ty = matrixm[13];

        let vl = local[0], vr = local[2],
            vb = local[1], vt = local[3];

        let floatsPerVert = this.floatsPerVert;
        let vertexOffset = 0;
        let justTranslate = a === 1 && b === 0 && c === 0 && d === 1;
        let xDevotion = 100;
        let yDevotion = 100;

        if (justTranslate) {
            // left bottom
            verts[vertexOffset] = vl + tx;
            verts[vertexOffset + 1] = vb + ty;
            vertexOffset += floatsPerVert;
            // right bottom
            verts[vertexOffset] = vr + tx;
            verts[vertexOffset + 1] = vb + ty;
            vertexOffset += floatsPerVert;
            // left top
            verts[vertexOffset] = vl + tx;
            verts[vertexOffset + 1] = vt + ty;
            vertexOffset += floatsPerVert;
            // right top
            verts[vertexOffset] = vr + tx;
            verts[vertexOffset + 1] = vt + ty;
        } else {
            let al = a * vl, ar = a * vr, // x*cos(a)
                bl = b * vl, br = b * vr, // x*sin(a)
                cb = c * vb, ct = c * vt, // y*-sin(a)
                db = d * vb, dt = d * vt; // y*cos(a)

            // left bottom
            verts[vertexOffset] = al + cb + tx; // x*cos(a) + y*-sin(a) x1
            verts[vertexOffset + 1] = bl + db + ty; // x*sin(a) + y*cos(a) y1
            vertexOffset += floatsPerVert;
            // right bottom
            verts[vertexOffset] = ar + cb + tx;
            verts[vertexOffset + 1] = br + db + ty;
            vertexOffset += floatsPerVert;
            // left top
            verts[vertexOffset] = al + ct + tx;
            verts[vertexOffset + 1] = bl + dt + ty;
            vertexOffset += floatsPerVert;
            // right top
            verts[vertexOffset] = ar + ct + tx;
            verts[vertexOffset + 1] = br + dt + ty;
        }
    }

    updateVerts(sprite) {
        let node = sprite.node,
            cw = node.width, ch = node.height,
            appx = node.anchorX * cw, appy = node.anchorY * ch,
            l, b, r, t;
        if (sprite.trim) {
            l = -appx;
            b = -appy;
            r = cw - appx;
            t = ch - appy;
        }
        else {
            let frame = sprite.spriteFrame,
                ow = frame._originalSize.width, oh = frame._originalSize.height,
                rw = frame._rect.width, rh = frame._rect.height,
                offset = frame._offset,
                scaleX = cw / ow, scaleY = ch / oh;
            let trimLeft = offset.x + (ow - rw) / 2;
            let trimRight = offset.x - (ow - rw) / 2;
            let trimBottom = offset.y + (oh - rh) / 2;
            let trimTop = offset.y - (oh - rh) / 2;
            l = trimLeft * scaleX - appx;
            b = trimBottom * scaleY - appy;
            r = cw + trimRight * scaleX - appx;
            t = ch + trimTop * scaleY - appy;
        }

        let local = this._local;
        local[0] = l;
        local[1] = b;
        local[2] = r;
        local[3] = t;
        local[4] = l;
        local[5] = b;
        local[6] = r;
        local[7] = t;
        this.updateWorldVerts(sprite);
    }

    updateColor(comp, color) {
        let uintVerts = this._renderData.uintVDatas[0];
        if (!uintVerts) return;
        color = color != null ? color : comp.node.color._val;
        let floatsPerVert = this.floatsPerVert;
        let colorOffset = this.colorOffset;
        for (let i = colorOffset, l = uintVerts.length; i < l; i += floatsPerVert) {
            uintVerts[i] = color;
        }
    }

    updateUVs(sprite) {
        // let uv = sprite._spriteFrame.uv;
        // let uv = [0, 1, 0.5, 1, 0, 0, 0.5, 0, 0.5, 1, 1, 1, 0.5, 0, 1, 0];
        let uv = [0, 1, 1, 1, 0, 0, 1, 0];
        // let uv = [0.5, 1, 1, 1, 0.5, 0, 1, 0];
        // let indices = this._renderData.iDatas[0];
        let uvOffset = this.uvOffset;
        let floatsPerVert = this.floatsPerVert;
        let verts = this._renderData.vDatas[0];
        // cc.log(verts);
        for (let i = 0; i < this.verticesCount; i++) {
            let srcOffset = i % 4 * 2;
            let dstOffset = floatsPerVert * i + uvOffset;
            verts[dstOffset] = uv[srcOffset];
            verts[dstOffset + 1] = uv[srcOffset + 1];
        }
        // for (let i = 0; i < 4; i++) {
        //     let srcOffset = i * 2;
        //     let dstOffset = floatsPerVert * (i + 4) + uvOffset;
        //     verts[dstOffset] = uv[srcOffset];
        //     verts[dstOffset + 1] = uv[srcOffset + 1];
        // }
    }
}