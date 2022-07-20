// Copyright 2020 Cao Gaoting<caogtaa@gmail.com>
// https://caogtaa.github.io
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/*
 * Date: 2020-07-13 02:44:17
 * LastEditors: GT<caogtaa@gmail.com>
 * LastEditTime: 2020-07-22 14:03:25
*/


import GTSimpleSpriteAssembler2D from "../GTSimpleSpriteAssembler2D";

// 自定义顶点格式，在vfmtPosUvColor基础上，加入gfx.ATTR_UV1，去掉gfx.ATTR_COLOR
// 20200703 增加了uv2, uv3用于处理uv在图集里的映射
//@ts-ignore
let gfx = cc.gfx;
var vfmtCustom = new gfx.VertexFormat([
    { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },        // texture纹理uv
    { name: gfx.ATTR_UV1, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },        // uv1，控制图片滚动方向 & 速度
    { name: "a_p", type: gfx.ATTR_TYPE_FLOAT32, num: 2 },               // uv remap到 [0, 1]区间用的中间变量
    { name: "a_q", type: gfx.ATTR_TYPE_FLOAT32, num: 2 }                // 同上
]);

const VEC2_ZERO = cc.Vec2.ZERO;

let temp_uvs = [];
export default class FlipPageAssembler extends GTSimpleSpriteAssembler2D {
    // 根据自定义顶点格式，调整下述常量
    verticesCount = 4; // 顶点总数量
    indicesCount = 6; // 信息长度
    uvOffset = 2;
    uv1Offset = 4;
    uv2Offset = 6;
    uv3Offset = 8;
    floatsPerVert = 5;

    // 自定义数据，将被写入uv1的位置
    public moveSpeed: cc.Vec2 = VEC2_ZERO;
    initData(sprite) {
        let pointNum = sprite.pointsCount // 点总数量 9
        this.verticesCount = pointNum * pointNum // 顶点总数量
        this.indicesCount = (pointNum - 1) * (pointNum - 1) * 6 // 顶点索引数据总数量

        if (this._renderData.meshCount > 0) return;
        this._renderData.createData(0, this.verticesFloats, this.indicesCount);

        let indices = this._renderData.iDatas[0];
        let indexOffset = 0;
        for (let r = 0; r < (pointNum - 1); ++r) {
            for (let c = 0; c < (pointNum - 1); ++c) {
                let start = r * pointNum + c; // 10 11 12 13 14 15 16 17
                indices[indexOffset++] = start; // 10 11 12 13 14 15 16 17
                indices[indexOffset++] = start + 1;
                indices[indexOffset++] = start + pointNum;
                indices[indexOffset++] = start + 1;
                indices[indexOffset++] = start + pointNum + 1;
                indices[indexOffset++] = start + pointNum;
            }
        }
    }

    /** 计算位置点在uv中的映射 */
    calcSlicedUV(__pointNum) {
        let uvSliced = [];
        uvSliced.length = 0;
        // if (this._rotated) {
        //     temp_uvs[0].u = (rect.x) / atlasWidth;
        //     temp_uvs[1].u = (rect.x + bottomHeight) / atlasWidth;
        //     temp_uvs[2].u = (rect.x + bottomHeight + centerHeight) / atlasWidth;
        //     temp_uvs[3].u = (rect.x + rect.height) / atlasWidth;
        //     temp_uvs[3].v = (rect.y) / atlasHeight;
        //     temp_uvs[2].v = (rect.y + leftWidth) / atlasHeight;
        //     temp_uvs[1].v = (rect.y + leftWidth + centerWidth) / atlasHeight;
        //     temp_uvs[0].v = (rect.y + rect.width) / atlasHeight;

        //     for (let row = 0; row < 4; ++row) {
        //         let rowD = temp_uvs[row];
        //         for (let col = 0; col < 4; ++col) {
        //             let colD = temp_uvs[3 - col];
        //             uvSliced.push({
        //                 u: rowD.u,
        //                 v: colD.v
        //             });
        //         }
        //     }
        // }
        // else {
        for (let i = 0; i < __pointNum; i++) {       //均分
            if (!temp_uvs[i]) {
                temp_uvs[i] = { u: 0, v: 0 }
            }
            temp_uvs[i].u = i / (__pointNum - 1)
            temp_uvs[i].v = (__pointNum - 1 - i) / (__pointNum - 1)
        }

        for (let row = 0; row < __pointNum; ++row) {
            let rowD = temp_uvs[row];
            for (let col = 0; col < __pointNum; ++col) {
                let colD = temp_uvs[col];
                uvSliced.push({
                    u: colD.u,
                    v: rowD.v
                });
            }
        }
        // }
        return uvSliced
    }

    // 自定义格式以getVfmt()方式提供出去，除了当前assembler，render-flow的其他地方也会用到
    // getVfmt() {
    //     return vfmtCustom;
    // }

    // 重载getBuffer(), 返回一个能容纳自定义顶点数据的buffer
    // 默认fillBuffers()方法中会调用到
    // getBuffer() {
    //     //@ts-ignore
    //     return cc.renderer._handle.getBuffer("mesh", this.getVfmt());
    // }

    // pos数据没有变化，不用重载
    // updateVerts(sprite) {
    // }

    // updateColor(sprite, color) {
    //     // 由于已经去掉了color字段，这里重载原方法，并且不做任何事
    // }
    fillBuffers(comp, renderer) {
        if (renderer.worldMatDirty) {
            this.updateWorldVerts(comp);
        }

        let renderData = this._renderData;
        let vData = renderData.vDatas[0];
        let iData = renderData.iDatas[0];

        let buffer = this.getBuffer(/*renderer*/);
        let offsetInfo = buffer.request(this.verticesCount, this.indicesCount);

        // buffer data may be realloc, need get reference after request.

        // fill vertices
        let vertexOffset = offsetInfo.byteOffset >> 2,
            vbuf = buffer._vData;

        if (vData.length + vertexOffset > vbuf.length) {
            vbuf.set(vData.subarray(0, vbuf.length - vertexOffset), vertexOffset);
        } else {
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

    updateUVs(sprite) {
        let pointNum = sprite.pointsCount
        let verts = this._renderData.vDatas[0];
        // let uvSliced = sprite.spriteFrame.uvSliced;
        let uvSliced = this.calcSlicedUV(pointNum)

        let uvOffset = this.uvOffset;
        let floatsPerVert = this.floatsPerVert;
        for (let row = 0; row < pointNum; ++row) {
            for (let col = 0; col < pointNum; ++col) {
                let vid = row * pointNum + col;
                let uv = uvSliced[vid];
                let voffset = vid * floatsPerVert;
                verts[voffset + uvOffset] = uv.u;
                verts[voffset + uvOffset + 1] = uv.v;
            }
        }
    }

    updateVerts(sprite) {
        let pointNum = sprite.pointsCount
        if (sprite) {
            let local = this._local
            let index = 0
            let pointList = sprite.getPointList()
            let num = -1;
            for (let i = 0; i < pointNum; i++) {
                for (let j = 0; j < pointNum; j++) {
                    local[index] = pointList[i][j]
                    local[index].y += sprite.flag;
                    sprite.flag *= num;
                    index++
                }
            }
        }
        this.updateWorldVerts(sprite);
    }

    // updateUVs(sprite) {
    //     super.updateUVs(sprite);
    //     let uv = sprite._spriteFrame.uv;
    //     let uvOffset = this.uvOffset;
    //     let floatsPerVert = this.floatsPerVert;
    //     let verts = this._renderData.vDatas[0];
    //     let dstOffset;

    //     let l = uv[0],
    //         r = uv[2],
    //         t = uv[5],
    //         b = uv[1];

    //     // px, qx用于x轴的uv映射
    //     // py, qy同理，公式推导过程略...
    //     let px = 1.0 / (r - l),
    //         qx = -l * px;   // l / (l-r);

    //     let py = 1.0 / (b - t),
    //         qy = -t * py;   // t / (t-b);

    //     let sx = this.moveSpeed.x;
    //     let sy = this.moveSpeed.y;
    //     for (let i = 0; i < 4; ++i) {
    //         dstOffset = floatsPerVert * i + uvOffset;
    //         // fill uv1
    //         verts[dstOffset + 2] = sx;
    //         verts[dstOffset + 3] = sy;

    //         // fill uv2
    //         verts[dstOffset + 4] = px;
    //         verts[dstOffset + 5] = py;

    //         // fill uv3
    //         verts[dstOffset + 6] = qx;
    //         verts[dstOffset + 7] = qy;
    //     }
    // }

    // updateWorldVertsWebGL(sprite) {
    //     let matrix = sprite.node._worldMatrix;
    //     let matrixm = matrix.m,
    //         a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
    //         tx = matrixm[12], ty = matrixm[13];
    //     /*
    //             m00 = 1, m01 = 0, m02 = 0, m03 = 0,
    //             m04 = 0, m05 = 1, m06 = 0, m07 = 0,
    //             m08 = 0, m09 = 0, m10 = 1, m11 = 0,
    //             m12 = 0, m13 = 0, m14 = 0, m15 = 1
    //             */
    //     // [a,b,c,d] = _worldMatrix[1,2,4,5] == [1,0,0,1]
    //     // _worldMatrix[12,13]是xy的平移量
    //     // 即世界矩阵的左上角2x2是单元矩阵，说明在2D场景内没有出现旋转或者缩放
    //     let worldIndex = 0
    //     let local = this._local;
    //     let world = this._renderData.vDatas[0];

    //     let floatsPerVert = this.floatsPerVert;
    //     for (let i = 0; i < this.verticesCount; i++) {
    //         let p0 = local[i]
    //         world[worldIndex] = p0.x * a + p0.y * c + tx; // 修改之前顶点坐标中的x值 pos.x
    //         world[worldIndex + 1] = p0.x * b + p0.y * d + ty; // 修改之前顶点坐标中的y值 pos.y
    //         worldIndex += floatsPerVert;
    //     }
    // }

    // updateWorldVertsNative(sprite) {
    //     let worldIndex = 0
    //     let local = this._local;
    //     let world = this._renderData.vDatas[0];

    //     let floatsPerVert = this.floatsPerVert;
    //     for (let i = 0; i < this.verticesCount; i++) {
    //         let p0 = local[i]
    //         world[worldIndex] = p0.x
    //         world[worldIndex + 1] = p0.y
    //         worldIndex += floatsPerVert;
    //     }
    // }

    updateWorldVertsWebGL(sprite) {
        let matrix = sprite.node._worldMatrix;
        let matrixm = matrix.m,
            a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
            tx = matrixm[12], ty = matrixm[13];
        /*
                m00 = 1, m01 = 0, m02 = 0, m03 = 0,
                m04 = 0, m05 = 1, m06 = 0, m07 = 0,
                m08 = 0, m09 = 0, m10 = 1, m11 = 0,
                m12 = 0, m13 = 0, m14 = 0, m15 = 1
                */
        // [a,b,c,d] = _worldMatrix[1,2,4,5] == [1,0,0,1]
        // _worldMatrix[12,13]是xy的平移量
        // 即世界矩阵的左上角2x2是单元矩阵，说明在2D场景内没有出现旋转或者缩放
        let worldIndex = 0
        let local = this._local;
        let world = this._renderData.vDatas[0];

        let floatsPerVert = this.floatsPerVert;
        for (let i = 0; i < this.verticesCount; i++) {
            let p0 = local[i]
            world[worldIndex] = p0.x * a + p0.y * c + tx; // 修改之前顶点坐标中的x值 pos.x
            world[worldIndex + 1] = p0.x * b + p0.y * d + ty; // 修改之前顶点坐标中的y值 pos.y
            worldIndex += floatsPerVert;
        }
    }

    updateWorldVertsNative(sprite) {
        let worldIndex = 0
        let local = this._local;
        let world = this._renderData.vDatas[0];

        let floatsPerVert = this.floatsPerVert;
        for (let i = 0; i < this.verticesCount; i++) {
            let p0 = local[i]
            world[worldIndex] = p0.x
            world[worldIndex + 1] = p0.y
            worldIndex += floatsPerVert;
        }
    }

}
