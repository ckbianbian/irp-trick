// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnclosureGameC extends cc.Component {

    @property({ type: cc.Graphics, displayName: '画板' })
    pannel: cc.Graphics = null;

    globalPoly: Polygon = {
        regions: [
            []
        ], inverted: false
    };
    touchPArray = [[]];

    _polyOne = [
        [[50, 50], [150, 150], [190, 50]],
        [[130, 50], [290, 150], [290, 50]]
    ];
    _polyTwo = [
        [[110, 20], [110, 110], [20, 20]],
        [[130, 170], [130, 20], [260, 20], [260, 170]]
    ];
    _polyThree = [
        [[50, 50], [150, 150], [190, 50]]
    ]
    _polyFour = [
        [[130, 50], [290, 150], [290, 50]]
    ]

    onLoad(): void {
        // // let result = PolyBool.differenceRev({ regions: this._polyThree, inverted: false }, { regions: this._polyFour, inverted: false });
        // // this.drawByPolyBool(result)
        // let segment1 = PolyBool.segments({ regions: this._polyThree, inverted: false });
        // let segment2 = PolyBool.segments({ regions: this._polyFour, inverted: false });
        // let combine = PolyBool.combine(segment2, segment1);
        // let result = PolyBool.selectUnion(combine);
        // let result2 = PolyBool.polygon(result);
        // cc.log(result2)
        // let result3 = PolyBool.intersect({ regions: this._polyTwo, inverted: false }, result2)
        // this.drawByPolyBool(result2)
        this.openListen();
    }

    start(): void {

    }

    openListen(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStartCallFunc, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveCalMovelFunc, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndCallFunc, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancelCallFunc, this)
    }

    touchStartCallFunc(event: cc.Touch): void {
        this.touchPArray = [[]];
        let startP = event.getLocation();
        let startPCv = this.node.convertToNodeSpaceAR(startP);
        this.touchPArray[0].push([startPCv.x, startPCv.y]);
    }
    touchMoveCalMovelFunc(event: cc.Touch): void {
        let startP = event.getLocation();
        let startPCv = this.node.convertToNodeSpaceAR(startP);
        this.touchPArray[0].push([startPCv.x, startPCv.y]);
    }
    touchEndCallFunc(event: cc.Touch): void {
        let tempPolygon: Polygon = { regions: this.touchPArray, inverted: false };
        let resultPolygon: Polygon = PolyBool.union(this.globalPoly, tempPolygon);
        this.globalPoly = resultPolygon;
        this.drawByPolyBool(this.globalPoly);
    }
    touchCancelCallFunc(event: cc.Touch): void {

    }

    drawByArray(pointsArray): void {
        this.pannel.clear();
        for (let points of pointsArray) {
            let arr1 = points.shift();
            let p1 = cc.v2(arr1[0], arr1[1]);
            this.pannel.lineWidth = 3;
            this.pannel.strokeColor = cc.Color.WHITE;
            this.pannel.fillColor = cc.Color.YELLOW;
            this.pannel.moveTo(p1.x, p1.y);
            for (let point of points) {
                let p = cc.v2(point[0], point[1])
                this.pannel.lineTo(p.x, p.y);
                this.pannel.close();
                this.pannel.stroke();
                this.pannel.fill();
            }
        }
    }

    drawByPolyBool(polyBool: Polygon): void {
        let pointsArray = polyBool.regions;
        this.drawByArray(pointsArray)
    }

}
