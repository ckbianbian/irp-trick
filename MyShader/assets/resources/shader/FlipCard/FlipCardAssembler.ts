/**
 *  @description 翻转卡牌汇编器
 */

import GTAssembler2D from "../GTAssembler2D";
import FlipCardSprite from "./FlipCardSprite";

export default class FlipCardAssembler extends GTAssembler2D {

    // verticesCount = 36; // 顶点数量
    // indicesCount = 54; // 几何三角形下标数量

    init(comp: FlipCardSprite) {
        super.init(comp);

        // cc.Assembler2D的初始化放在constructor里
        // 此处把初始化放在init里，以便成员变量能够有机会修改
        this._renderData = new cc.RenderData();
        this._renderData.init(this);


        this.initLocal();
        this.initData(comp);
    }

    initData(sprite: FlipCardSprite) {
        let data = this._renderData;
        this.verticesCount = sprite.xPointNum * sprite.yPointNum;  // 定义总顶点数量
        this.indicesCount = (sprite.xPointNum - 1) * (sprite.yPointNum - 1) * 6;

        data.createData(0, this.verticesFloats, this.indicesCount);
        // data.createQuadData(0, this.verticesFloats, this.indicesCount);
        // createQuadData内部会调用initQuadIndices初始化索引信息
        // 如果是用用flexbuffer创建则需要自己初始化
        let indices = this._renderData.iDatas[0];

        this.cfgIndice(sprite, indices);
    }

    fillBuffers(comp, renderer) { // 7
        // cc.log('fillBuffers');
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
            vertexId = offsetInfo.vertexOffset  ;             // vertexId是已经在buffer里的顶点数，也是当前顶点序号的基数
        for (let i = 0, l = iData.length; i < l; i++) {
            ibuf[indiceOffset++] = vertexId + iData[i];
        }
    }

    cfgIndice(sprite: FlipCardSprite, arr): void { // 配置三角形顶点坐标信息
        let idx = 0;
        for (let y = 1; y < sprite.yPointNum; y++) {
            let yStart = y * sprite.xPointNum;
            let yCurrent = (y - 1) * sprite.xPointNum;
            for (let x = 0; x < sprite.xPointNum - 1; x++) {
                let vertextTYID = yStart + x;
                let vertextYID = yCurrent + x;
                arr[idx++] = vertextYID;
                arr[idx++] = vertextYID + 1;
                arr[idx++] = vertextTYID;
                arr[idx++] = vertextYID + 1;
                arr[idx++] = vertextTYID + 1;
                arr[idx++] = vertextTYID;
            }
        }

        if (!CC_EDITOR) {
            // cc.log(arr);
        }
    }

    updateVerts(sprite: FlipCardSprite) { // 5
        let xNum = sprite.xPointNum;
        let yNum = sprite.yPointNum;
        if (sprite) {
            let local = this._local;
            let index = 0;
            let pointList = sprite.getPosList();
            for (let i = 0; i < yNum; i++) {
                for (let j = 0; j < xNum; j++) {
                    local[index] = pointList[i][j]
                    index++
                }
            }
            // cc.log(local);
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

        /*
        m00 = 1, m01 = 0, m02 = 0, m03 = 0,
        m04 = 0, m05 = 1, m06 = 0, m07 = 0,
        m08 = 0, m09 = 0, m10 = 1, m11 = 0,
        m12 = 0, m13 = 0, m14 = 0, m15 = 1
        */
        // [a,b,c,d] = _worldMatrix[1,2,4,5] == [1,0,0,1]
        // _worldMatrix[12,13]是xy的平移量
        // 即世界矩阵的左上角2x2是单元矩阵，说明在2D场景内没有出现旋转或者缩放

        // let angle = Math.PI / 180 * 90;
        // let angle2 = Math.PI / 180 * 130;
        // a = Math.cos(angle);
        // d = Math.cos(angle);
        // b = -Math.sin(angle);
        // c = Math.sin(angle);
        // vr += 50;
        // vl += 50;
        // d = -1;

        let justTranslate = a === 1 && b === 0 && c === 0 && d === 1;


        // render data = verts = x|y|u|v|color|x|y|u|v|color|...
        // 填充render data中4个顶点的xy部分
        let index = 0;
        let floatsPerVert = this.floatsPerVert;
        for (let i = 0; i < this.verticesCount; i++) {
            let p0 = local[i]
            verts[index] = p0.x * a + p0.y * c + tx;
            verts[index + 1] = p0.x * b + p0.y * d + ty;
            index += floatsPerVert;
        }
    }

    updateUVs(sprite) { // 4
        // cc.log('updateUVs');
        let xNum = sprite.xPointNum;
        let yNum = sprite.yPointNum;
        let verts = this._renderData.vDatas[0];
        // let uvSliced = sprite.spriteFrame.uvSliced;
        // let uvSliced = this.calcSlicedUV(pointNum)

        let uvOffset = this.uvOffset;
        let floatsPerVert = this.floatsPerVert;
        // for (let row = 0; row < xNum; ++row) {
        //     for (let col = 0; col < yNum; ++col) {
        //         let vid = row * pointNum + col;
        //         // let uv = uvSliced[vid];
        //         let uv = uvSliced[vid];
        //         let voffset = vid * floatsPerVert;
        //         verts[voffset + uvOffset] = uv.u;
        //         verts[voffset + uvOffset + 1] = uv.v;
        //     }
        // }
        let idx = 0;
        for (let y = 0; y < yNum; y++) {
            for (let x = 0; x < xNum; x++) {
                let voffset = idx * floatsPerVert;
                verts[voffset + uvOffset] = x / (xNum - 1);
                verts[voffset + uvOffset + 1] = y / (yNum - 1);
                idx++;
            }
        }
    }

    updateColor(sprite: FlipCardSprite, color) { // 6
        // render data = verts = x|y|u|v|color|x|y|u|v|color|...
        // 填充render data中4个顶点的color部分
        let uintVerts = this._renderData.uintVDatas[0];
        if (!uintVerts) return;
        color = color != null ? color : sprite.node.color._val;
        let floatsPerVert = this.floatsPerVert;
        let colorOffset = this.colorOffset;
        for (let i = colorOffset, l = uintVerts.length; i < l; i += floatsPerVert) {
            uintVerts[i] = color;
        }
    }

}