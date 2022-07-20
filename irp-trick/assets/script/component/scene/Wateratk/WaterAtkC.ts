import CustomRenderer from "../CustomSprite/CustomRenderer";

const { ccclass, property } = cc._decorator;

class Bullet {
    pos: cc.Vec2;
    mvDrVec: cc.Vec2;
    priority: number;
    rolePos;
}

@ccclass
export default class WaterAtkC extends cc.Component {

    @property({ displayName: '移动速度' })
    mvSpeed: number = 10;
    @property({ displayName: 'role', type: cc.Node })
    role: cc.Node = null;
    @property({ type: cc.Graphics, displayName: '画板' })
    pannel: cc.Graphics = null;

    @property(cc.Node)
    board = null;


    inputCode: Set<number> = new Set(); // 输入code
    private _atk = 0; // 攻击
    public get atk() { return this._atk; }
    public set atk(value) { this._atk = value; }
    private _mvDrVec: cc.Vec2 = cc.v2(0, 0); // 移动方向矢量
    public get mvDrVec(): cc.Vec2 { return this._mvDrVec; }
    public set mvDrVec(value: cc.Vec2) { this._mvDrVec = value; }
    private _atkDrVec: cc.Vec2 = cc.v2(0, 0); // 攻击方向矢量
    public get atkDrVec(): cc.Vec2 { return this._atkDrVec; }
    public set atkDrVec(value: cc.Vec2) { this._atkDrVec = value; }

    atkBulletSpeedCount = 0;
    atkBulletSpeed = 30;
    atkBulletUnitWidth = 20;
    atkBulletWidth = 800;
    _bulletSpacing = 30;
    bulletArray = [];

    onLoad(): void {
        this.openListen();
    }


    start(): void {

    }

    update(dt: number): void {
        this.rolePositionSystem(dt);
        this.inputSystem(dt);
        this.waterAtk(dt);
    }

    onDisable(): void {

    }

    openListen(): void {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.keyDownCallFunc, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.keyUpCallFunc, this);
    }

    keyDownCallFunc(event): void {
        let keyCode = event.keyCode;
        switch (keyCode) {
            case 87: this.mvDrVec.y = 1; break; // W
            case 65: this.mvDrVec.x = -1; break; // A
            case 83: this.mvDrVec.y = -1; break; // S
            case 68: this.mvDrVec.x = 1; break; // D
            case 38: this.atkDrVec.addSelf(cc.v2(0, 1)); break; // ↑
            case 40: this.atkDrVec.addSelf(cc.v2(0, -1)); break; // ↓
            case 37: this.atkDrVec.addSelf(cc.v2(-1, 0)); break; // ←
            case 39: this.atkDrVec.addSelf(cc.v2(1, 0)); break; // →
            case 32: this.inputCode.add(keyCode); break; // space
            default: break;
        }
    }

    keyUpCallFunc(event): void {
        let keyCode = event.keyCode;
        switch (keyCode) {
            case 87: if (this.mvDrVec.y === 1) this.mvDrVec.y = 0; break; // W
            case 65: if (this.mvDrVec.x === -1) this.mvDrVec.x = 0; break; // A
            case 83: if (this.mvDrVec.y === -1) this.mvDrVec.y = 0; break; // S
            case 68: if (this.mvDrVec.x === 1) this.mvDrVec.x = 0; break; // D
            case 38: this.atkDrVec.addSelf(cc.v2(0, -1)); break; // ↑
            case 40: this.atkDrVec.addSelf(cc.v2(0, 1)); break; // ↓
            case 37: this.atkDrVec.addSelf(cc.v2(1, 0)); break; // ←
            case 39: this.atkDrVec.addSelf(cc.v2(-1, 0)); break; // →
            case 32: this.inputCode.delete(keyCode); break; // space
            default: break;
        }
    }

    rolePositionSystem(dt): void {
        if (this.mvDrVec.x === 0 && this.mvDrVec.y === 0) return;
        let normalizeMvDrVec = this.mvDrVec.clone();
        normalizeMvDrVec = normalizeMvDrVec.normalizeSelf().mulSelf(this.mvSpeed);
        this.role.position = this.role.position.addSelf(normalizeMvDrVec);
    }

    roleAtkSystem(dt): void {
        if (this.atk) { return };
        this.atk = 1;
        if (this.bulletArray.length <= 0) {
            let bulletNum = Math.ceil(this.atkBulletWidth / this._bulletSpacing) + 1;
            let initPos = this.role.position;
            let atkDrVec = this.atkDrVec.clone();
            atkDrVec.normalizeSelf();
            cc.log(atkDrVec.x, '<=>', atkDrVec.y);

            for (let i = 0; i < bulletNum; i++) {
                let bullet = new Bullet();
                let temp = cc.v2();
                bullet.priority = i;
                bullet.mvDrVec = atkDrVec.clone();
                atkDrVec.normalizeSelf();
                initPos.add(atkDrVec.multiplyScalar(Math.max(1, i * this._bulletSpacing)), temp);
                cc.log(temp.x, '<=>', temp.y);
                bullet.pos = temp.clone();
                bullet.rolePos = this.role.position.clone();
                this.bulletArray.push(bullet);
            }
        }
        // 攻击完毕
        this.scheduleOnce(() => {
            this.atk = 0;
            this.bulletArray = [];
            this.drawByBullet(this.bulletArray);
        }, 3);
    }

    waterAtkBak(dt): void {
        if (this.bulletArray.length > 0) {
            this.drawByBullet(this.bulletArray);

            // let updateNum = Math.ceil(this.bulletArray.length / 5);
            let updateNum = 2;
            let preArr = [];
            let initPos = this.role.position.clone();
            for (let i = 0; i < updateNum; i++) {
                preArr.push(this.bulletArray.pop());
            }
            for (let bullet of preArr) {
                bullet.pos = initPos.addSelf(bullet.mvDrVec.normalizeSelf().mulSelf(this.atkBulletWidth)).clone();
                bullet.rolePos = this.role.position.clone();
            }
            for (let bullet of this.bulletArray) {
                let offsetRolePos = this.role.position.sub(bullet.rolePos);
                // cc.log(offsetRolePos);
                // bullet.pos.addSelf(offsetRolePos);
                // bullet.pos.x += offsetRolePos.x;
                // bullet.rolePos = this.role.position.clone();
                bullet.pos.addSelf(bullet.mvDrVec.normalizeSelf().mulSelf(updateNum * this.atkBulletUnitWidth));
            }
            this.bulletArray = preArr.concat(this.bulletArray);
            for (let i = 1; i < this.bulletArray.length; i++) {
                let pre = this.bulletArray[i - 1];
                let cur = this.bulletArray[i];
                if (pre == undefined) cc.log(pre);
                if (cur == undefined) cc.log(cur);
                let subVec = pre.pos.sub(cur.pos);
                let difDis = subVec.mag() - this.atkBulletUnitWidth;
                // if (difDis > 0) cc.log(subVec.normalizeSelf().mulSelf(difDis));
                cur.pos.addSelf(subVec.normalizeSelf().mulSelf(difDis));
            }
        }
    }

    waterAtk(dt): void {
        if (this.bulletArray.length > 0) {
            // this.drawByBullet(this.bulletArray);
            let arr = [];

            let initPos = this.role.position.clone();
            for (let i = 0; i < this.bulletArray.length; i++) {
                let bullet: Bullet = this.bulletArray[i];
                if (i == 0) { bullet.pos = initPos.clone(); continue; }
                let atkDirect = bullet.mvDrVec.clone();
                atkDirect.normalizeSelf();
                // let preBullet = this.bulletArray[i - 1];
                let temp = cc.v2();
                initPos.sub(bullet.pos, temp);
                let dis = temp.mag();

                // let num = -((i / this.bulletArray.length) * (i / this.bulletArray.length) - 1);
                let num = 1 - i / this.bulletArray.length + 0.1;
                // let num = 1;
                // let num = 1 / dis;
                // let num = 1 / dis * dt * 100;
                // let num = (i / this.bulletArray.length - 1) * (i / this.bulletArray.length - 1)
                // bullet.pos.sub(preBullet.pos, temp);
                // preBullet.pos.add(temp.normalizeSelf().multiplyScalar(this._bulletSpacing), bullet.pos);
                let expectPos = initPos.add(atkDirect.multiplyScalar(Math.max(1, i * this._bulletSpacing)), temp);
                expectPos.sub(bullet.pos, temp);
                let disT = temp.mag();
                let toExpectPosVec = temp.multiplyScalar(Math.min(num, 1));
                bullet.pos.addSelf(toExpectPosVec);

                arr.push({ x: bullet.pos.x, y: bullet.pos.y })
            }

            let comp: CustomRenderer = this.board.getComponent(CustomRenderer);
            if (comp) {
                comp.createVertsByArrAndScale(arr, 20);
                comp.setVertsDirty();
            }
        }
    }

    inputSystem(dt): void {
        let v = this.inputCode.values();
        while (true) {
            let value = v.next();
            if (value.value == undefined) break;
            if (value.value === 32) this.roleAtkSystem(dt);
        }
    }

    drawByBullet(arr): void {
        this.pannel.clear();
        if (arr.length <= 0) return;
        this.pannel.lineWidth = 10;
        this.pannel.strokeColor = cc.Color.BLUE;
        for (let i = 0; i < arr.length; i++) {
            let bullet = arr[i];
            let p = bullet.pos.clone();
            if (i === 0) {
                this.pannel.moveTo(p.x, p.y);
                continue;
            }
            this.pannel.lineTo(p.x, p.y);
        }
        this.pannel.stroke();
        for (let bullet of arr) {
            this.pannel.lineWidth = 1;
            this.pannel.fillColor = cc.Color.YELLOW;
            let p = bullet.pos.clone();
            this.pannel.circle(p.x, p.y, 10);
            this.pannel.fill();
            this.pannel.stroke();
        }
    }
    drawByBulletLine(arr): void {
        this.pannel.clear();
        if (arr.length <= 0) return;
        this.pannel.lineWidth = 20;
        this.pannel.strokeColor = cc.Color.RED;
        this.pannel.fillColor = cc.Color.YELLOW;
        for (let i = 0; i < arr.length; i++) {
            let bullet = arr[i];
            let p = bullet.pos.clone();
            if (i === 0) {
                this.pannel.moveTo(p.x, p.y);
                continue;
            }
            this.pannel.lineTo(p.x, p.y);
        }
        this.pannel.stroke();
    }

    drawByBulletByQuadraticCurve(arr): void {
        this.pannel.clear();
        if (arr.length <= 0) return;
        this.pannel.lineWidth = 50;
        this.pannel.strokeColor = cc.Color.RED;
        this.pannel.fillColor = cc.Color.YELLOW;
        let key1 = arr[0];
        let key2 = arr[Math.floor((arr.length - 1) * 0.9)];
        let key3 = arr[arr.length - 1];
        this.pannel.moveTo(key1.pos.x, key1.pos.y)
        this.pannel.quadraticCurveTo(key2.pos.x, key1.pos.y, key3.pos.x, key3.pos.y);
        this.pannel.stroke();
    }

    drawByBulletByBezier(arr): void {
        this.pannel.clear();
        if (arr.length <= 0) return;
        this.pannel.lineWidth = 50;
        this.pannel.strokeColor = cc.Color.RED;
        this.pannel.fillColor = cc.Color.YELLOW;
        let key1 = arr[0];
        let key2 = arr[Math.floor((arr.length - 1) * 0.7)];
        let key3 = arr[Math.floor((arr.length - 1) * 0.9)];
        let key4 = arr[arr.length - 1];
        this.pannel.moveTo(key1.pos.x, key1.pos.y)
        this.pannel.bezierCurveTo(key2.pos.x, key2.pos.y, key3.pos.x, key3.pos.y, key4.pos.x, key4.pos.y);
        this.pannel.stroke();
    }

    drawBezier(): void {
        this.pannel.clear();
        this.pannel.lineWidth = 10;
        this.pannel.strokeColor = cc.Color.RED;
        this.pannel.moveTo(0, 0);
        this.pannel.quadraticCurveTo(50, 100, 100, 0);
        this.pannel.stroke();
    }

}