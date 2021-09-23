import BezierUtils from "../../../utils/BezierUtils";
import CustomVertsAssembler from "./CustomVertsAssembler";

/**
 *  @desc 自定义渲染器
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class CustomRenderer extends cc.Sprite {
    @property(cc.Material)
    materialWeb: cc.Material = null;

    @property(cc.Material)
    materialNative: cc.Material = null;

    @property(cc.Graphics)
    drawingBoard = null;

    rectVertArr: { x, y }[];

    _resetAssembler() {
        this.setVertsDirty();
        let assembler = this._assembler = new CustomVertsAssembler();
        this.configAssemblerInfo(assembler);
        assembler.init(this);
    }

    configAssemblerInfo(assembler: CustomVertsAssembler) {
        this.createVerts();
        assembler.verticesCount = (this.rectVertArr.length / 2 - 1) * 4;
        assembler.indicesCount = (this.rectVertArr.length / 2 - 1) * 6;
    }

    createVertsByArrAndScale(arr, scale = 3): void {
        this.rectVertArr = this.getRectPointByPointArr(arr, scale);
        this.updateBuffer();
    }

    updateBuffer() {
        let verticesCount = (this.rectVertArr.length / 2 - 1) * 4, indicesCount = (this.rectVertArr.length / 2 - 1) * 6;
        let flexBuffer = this._assembler._renderData._flexBuffer;
        flexBuffer.reserve(verticesCount, indicesCount);
        flexBuffer.used(verticesCount, indicesCount);
    }

    createVerts() {
        let endPoint = { x: 1000, y: 0 };
        let yOffset = 300;
        let ropeArr = BezierUtils.CreateBezierPoints([{ x: 0, y: 0 }, { x: endPoint.x / 3, y: -yOffset }, { x: endPoint.x * 2 / 3, y: yOffset * 2 }, endPoint], 100);
        ropeArr.push(endPoint);
        this.rectVertArr = this.getRectPointByPointArr(ropeArr, 3);
        for (let index = 0; index < this.rectVertArr.length; index++) {
            const element = this.rectVertArr[index];
            this.drawCircle(cc.v2(element.x, element.y));
        }
    }


    drawCircle(pos): void {
        this.drawingBoard.lineWidth = 1;
        this.drawingBoard.strokeColor = cc.Color.YELLOW;
        this.drawingBoard.fillColor = cc.Color.YELLOW;
        this.drawingBoard.circle(pos.x, pos.y, 1);
        this.drawingBoard.fill();
        this.drawingBoard.stroke();
    }

    getRectPointByPointArr(pointArr: [{ x, y }], scale = 1) {
        if (pointArr.length <= 1) {
            return null;
        }
        let rectArr = [];
        let normalArr = [];
        let _tempVec2 = cc.v2();
        let _normal = cc.v2();
        for (let index = 0; index < pointArr.length; index++) {
            if (index == 0) {
                continue;
            }
            let prePoint = pointArr[index - 1]
            let point = pointArr[index];
            let dir = cc.v2(point.x, point.y).sub(cc.v2(prePoint.x, prePoint.y)).normalize(_tempVec2)
            this.normal(_normal, _tempVec2);
            if (normalArr[index - 1]) {
                normalArr[index - 1].push(_normal.clone());
            } else {
                normalArr[index - 1] = [_normal.clone()];
            }
            if (normalArr[index]) {
                normalArr[index].push(_normal.clone());
            } else {
                normalArr[index] = [_normal.clone()];
            }
        }
        for (let index = 0; index < normalArr.length; index++) {
            let element: cc.Vec2[] = normalArr[index];
            let normal01 = cc.v2();
            let point = pointArr[index];
            if (element.length > 1) {
                element[0].add(element[1], normal01);
            } else {
                normal01 = element[0].clone();
            }
            normal01.normalizeSelf().multiplyScalar(scale);
            rectArr.push({ x: point.x + normal01.x + cc.winSize.width / 2, y: point.y + normal01.y + cc.winSize.height / 2 })
            rectArr.push({ x: point.x - normal01.x + cc.winSize.width / 2, y: point.y - normal01.y + cc.winSize.height / 2 })
        }
        return rectArr;
    }

    normal(out, dir) {
        //get perpendicular
        out.x = -dir.y;
        out.y = dir.x;
        return out
    }

    start() {
        this.createVerts();
        // this._spriteFrame.uvSliced;
        // this._spriteFrame.uv;
    }
}