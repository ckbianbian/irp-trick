/**
 *  @description 物理管理
 */

import Singleton from "../common/Singleton";

export default class PhysicsManager extends Singleton {

    private _physicsManager: cc.PhysicsManager;

    public get physicsManager(): cc.PhysicsManager {
        return cc.director.getPhysicsManager();
    }
    public set physicsManager(value: cc.PhysicsManager) {
        this._physicsManager = value;
    }

    // 开启物理系统
    openPhysicsSystem(): void {
        this.physicsManager.enabled = true;
        if (CC_DEBUG) {
            // let Bits = cc.PhysicsManager.DrawBits;
            // this.physicsManager.debugDrawFlags = Bits.e_aabbBit |
            //     Bits.e_jointBit |
            //     Bits.e_shapeBit;
        }
    }
    // 关闭物理系统
    closePhysicsSystem(): void {
        this.physicsManager.enabled = false;
    }

}