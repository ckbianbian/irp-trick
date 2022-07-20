/**
 *  @description 自治体实体
 */

import BaseGameEntity from "./BaseGameEntity";

export default class MovingEntity extends BaseGameEntity {

    private _m_vVelocity: cc.Vec2; // 速度
    private _m_vHeading: cc.Vec2; // 一个标准化向量 指向实体朝向
    private _m_vSide: cc.Vec2; // 垂直朝向向量的向量
    private _m_dMass: number;
    private _m_dMaxSpeed: number; // 实体的最大速度
    private _m_dMaxForce: number; // 实体产生的供以自己动力的最大力
    private _m_dMaxTurnRate: number; // 旋转的最大速率

    public get m_vVelocity(): cc.Vec2 {
        return this._m_vVelocity;
    }
    public set m_vVelocity(value: cc.Vec2) {
        this._m_vVelocity = value;
    }
    public get m_vHeading(): cc.Vec2 {
        return this._m_vHeading;
    }
    public set m_vHeading(value: cc.Vec2) {
        this._m_vHeading = value;
    }
    public get m_vSide(): cc.Vec2 {
        return this._m_vSide;
    }
    public set m_vSide(value: cc.Vec2) {
        this._m_vSide = value;
    }
    public get m_dMass(): number {
        return this._m_dMass;
    }
    public set m_dMass(value: number) {
        this._m_dMass = value;
    }
    public get m_dMaxSpeed(): number {
        return this._m_dMaxSpeed;
    }
    public set m_dMaxSpeed(value: number) {
        this._m_dMaxSpeed = value;
    }
    public get m_dMaxForce(): number {
        return this._m_dMaxForce;
    }
    public set m_dMaxForce(value: number) {
        this._m_dMaxForce = value;
    }
    public get m_dMaxTurnRate(): number {
        return this._m_dMaxTurnRate;
    }
    public set m_dMaxTurnRate(value: number) {
        this._m_dMaxTurnRate = value;
    }

}