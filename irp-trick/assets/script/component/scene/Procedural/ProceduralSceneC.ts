/**
 *  动作缓动（移动参数抽离）
 */

const PF = require("../../../lib/pf/PathFinding.js")
import { USceneComponent } from "../../../common/core/USceneComponent";
import CoordinateTranslationUtils from "../../../utils/CoordinateTranslationUtils";
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("自定义组件/场景脚本/插值运动场景脚本")
export class ProceduralSceneC extends USceneComponent {

	@property({ name: "移动物体", type: cc.Node })
	moveObj: cc.Node = null;
	@property({ name: "跟随物体", type: cc.Node })
	followObj: cc.Node = null;
	@property({ name: "f", type: cc.Float })
	f: number = 1;
	@property({ name: "z", type: cc.Float })
	z: number = 0.5;
	@property({ name: "r", type: cc.Float })
	r: number = 0;

	private dtCount: number = 0;
	private isStart: boolean = false;
	private _bIsTouch: boolean = false;
	private _touchPos: cc.Vec2 = null;
	private _speed: number = 10;
	private _posInfoArr: Array<PosInfo> = new Array();
	private _usedPosInfoArr: Array<PosInfo> = new Array();

	private xp: cc.Vec2;
	private y: cc.Vec2;
	private yd: cc.Vec2;
	private k1: number;
	private k2: number;
	private k3: number;

	onLoad(): void {
		this.initSecondOrderDynamics(this.f, this.z, this.r);
		this.initTouchManager();
		// this.customPosInfo();
		let grid = new PF.Grid(5, 3);
		grid.setWalkableAt(0, 1, false);
		cc.log(grid);
	}

	customPosInfo(): void {
		let speed = 1;
		for (let i = 0; i < 180; i++) {
			let t = i * 1 / 60;
			this.addPosInfo(cc.v2(0, 0).add(cc.v2(1, 0).normalize().multiplyScalar(i * speed)), 1 / 60);
		}
		// this.y = this.followObj.getPosition();
		this.scheduleOnce(() => {
			cc.log("start");
			this.isStart = true;
		}, 3);
	}

	update(dt: number): void {
		this.updatePosition(dt);
	}

	moveToObj(): void {
		// this.followObj.runAction(cc.tween);
		let tween = new cc.Tween();
	}

	// updatePosition(dt: number): void {
	// 	if (this.moveObj.getPosition().fuzzyEquals(this.followObj.getPosition(), 0.1)) {
	// 		// do nothing
	// 	} else {
	// 		let tVec = this.moveObj.getPosition().sub(this.followObj.getPosition());
	// 		let tV = tVec.normalize().multiplyScalar(Math.min(this._speed, tVec.mag()));
	// 		let pos = this.countPos(dt, this.moveObj.getPosition(), tV.clone());
	// 		// cc.log("pos", pos.x, "<->", pos.y);
	// 		this.followObj.setPosition(pos);
	// 		// this.followObj.setPosition(this.updatePos(dt, this.moveObj.getPosition(), tV));
	// 	}
	// }

	updatePosition(dt: number): void {
		// this.dtCount += dt;
		// if (this.dtCount > 0.1) {
		// 	this.dtCount = 0;
		if (this.isStart && this._posInfoArr.length > 0) {
			let posInfo = this._posInfoArr.shift();
			this._usedPosInfoArr.push(posInfo);
			// cc.log(posInfo);
			let pos = this.countPos(0.1, posInfo.pos, this._usedPosInfoArr[this._usedPosInfoArr.length - 1].pos.sub(posInfo.pos));
			cc.log("pos", pos.x, pos.y);
			cc.log("posInfo.pos", posInfo.pos.x, posInfo.pos.y);
			this.followObj.setPosition(posInfo.pos);
			this.moveObj.setPosition(pos);
		}
		// }
	}

	public initSecondOrderDynamics(f: number, z: number, r: number): void {
		this.k1 = this.z / (Math.PI * this.f);
		this.k2 = 1 / ((2 * Math.PI * this.f) * (2 * Math.PI * this.f));
		this.k3 = this.r * this.z / (2 * Math.PI * this.f);

		cc.log("k1", this.k1);
		cc.log("k2", this.k2);
		cc.log("k3", this.k3);

		this.xp = cc.v2(0, 0);
		this.y = cc.v2(0, 0);
		this.yd = cc.v2(0, 0);
	}

	public countPos(T: number, x: cc.Vec2, xd: cc.Vec2 = null): cc.Vec2 {
		if (xd == null) {
			xd = (x.sub(this.xp)).divide(T);
			this.xp = x.clone();
		}

		let k2_stable = Math.max(this.k2, 1.1 * (T * T / 4 + T * this.k1 / 2));
		this.y = this.y.add(this.yd.multiplyScalar(T));
		this.yd = this.yd.add((x.add(xd.multiplyScalar(this.k3)).sub(this.y).sub(this.yd.multiplyScalar(this.k1)).multiplyScalar(T).div(k2_stable)));
		return this.y.clone();
	}

	public addPosInfo(pos, dt): void {
		let obj = new PosInfo(pos, dt);
		// cc.log(obj.pos.x, obj.pos.y);
		this._posInfoArr.push(obj);
	}

	public clearPosInfo(): void {
		this._posInfoArr = null
		this._posInfoArr = new Array();
	}

	initTouchManager(): void {
		this.rootNode.on(cc.Node.EventType.TOUCH_START, (inTouch: cc.Event.EventTouch) => {
			this._bIsTouch = true;
			this._touchPos = inTouch.getLocation();
			this.moveObj.setPosition(this.moveObj.parent.convertToNodeSpaceAR(this._touchPos));
			this.clearPosInfo();
			this.addPosInfo(this.moveObj.parent.convertToNodeSpaceAR(this._touchPos), 0);
		}, this)
		this.rootNode.on(cc.Node.EventType.TOUCH_MOVE, (inTouch: cc.Event.EventTouch) => {
			this._touchPos = inTouch.getLocation();

			// this.followObj.setPosition(this.updatePos(1/60, this.moveObj.parent.convertToNodeSpaceAR(this._touchPos), inTouch.getDelta()));
			this.moveObj.setPosition(this.moveObj.parent.convertToNodeSpaceAR(this._touchPos));
			this.addPosInfo(this.moveObj.parent.convertToNodeSpaceAR(this._touchPos), new Date().getTime() - this._posInfoArr[this._posInfoArr.length - 1].timeStamp);
		}, this)
		this.rootNode.on(cc.Node.EventType.TOUCH_END, (inTouch: cc.Event.EventTouch) => {
			this._bIsTouch = false;
			this._touchPos = null;
		}, this)
		this.rootNode.on(cc.Node.EventType.TOUCH_CANCEL, (inTouch: cc.Event.EventTouch) => {
			this._bIsTouch = false;
			this._touchPos = null;
		}, this)
	}

}

class PosInfo {
	pos: cc.Vec2 = cc.v2(0, 0);
	dt: number = 0;
	timeStamp: number = 0;

	constructor(pos, dt) {
		this.pos = pos.clone();
		this.dt = dt;
		this.timeStamp = new Date().getTime();
	}
}

