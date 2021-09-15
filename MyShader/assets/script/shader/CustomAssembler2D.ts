/**
 *  @description 自定义2D渲染汇编器
 */

export default class CustomAssembler2D extends cc.Assembler {

    _renderData: cc.RenderData;
    _local;
    floatsPerVert = 5;
    verticesCount = 4;
    indicesCount = 6;
    uvOffset = 2;
    colorOffset = 4;

    // constructor() {
    //     super();
    //     this._renderData = new cc.RenderData();
    //     this._renderData.init(this);

    //     this.initData();
    //     this.initLocal();
    // }

    get verticesFloats() {
        return this.verticesCount * this.floatsPerVert;
    }

    init(comp: cc.RenderComponent) {
        super.init(comp);

        // cc.Assembler2D的初始化放在constructor里
        // 此处把初始化放在init里，以便成员变量能够有机会修改
        this._renderData = new cc.RenderData();
        this._renderData.init(this);

        this.initData();
        this.initLocal();
    }

    initData() {
        let data = this._renderData;
        data.createQuadData(0, this.verticesFloats, this.indicesCount);
    }
    initLocal() {
        this._local = [];
        this._local.length = 8;
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

    getBuffer() {
        return cc.renderer._handle._meshBuffer;
    }

    updateWorldVerts(comp) {
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

    fillBuffers(comp, renderer) {
        if (renderer.worldMatDirty) {
            this.updateWorldVerts(comp);
        }

        let renderData = this._renderData;
        let vData = renderData.vDatas[0];
        let iData = renderData.iDatas[0];

        let buffer = this.getBuffer(renderer);
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

    packToDynamicAtlas(comp, frame) {
        if (CC_TEST) return;

        if (!frame._original && cc.dynamicAtlasManager && frame._texture.packable) {
            let packedFrame = cc.dynamicAtlasManager.insertSpriteFrame(frame);
            if (packedFrame) {
                frame._setDynamicAtlasFrame(packedFrame);
            }
        }
        let material = comp._materials[0];
        if (!material) return;

        if (material.getProperty('texture') !== frame._texture._texture) {
            // texture was packed to dynamic atlas, should update uvs
            comp._vertsDirty = true;
            comp._updateMaterial();
        }
    }

    updateRenderData(sprite) {
        this.packToDynamicAtlas(sprite, sprite._spriteFrame);

        if (sprite._vertsDirty) {
            this.updateUVs(sprite);
            this.updateVerts(sprite);
            sprite._vertsDirty = false;
        }
    }

    updateUVs(sprite) {
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
        this.updateWorldVerts(sprite);
    }
}
