import ObjectBase from "../ObjectBase";

/**
 *  @description 角色类基类
 */
export default class Role extends ObjectBase {

    public id: string; // 角色唯一id
    public skin: string; // 角色皮肤
    public component: string; // 角色组件名称
    public name: string; // 角色名称
    public description: string; // 角色描述
    public atk_type: string; // 攻击类型
    public atk_direction_type: string; // 攻击方向类型
    public bullet_num: number; // 子弹总数量
    public unit_bullet_num: number; // 单位发射子弹数量
    public type: []; // 角色类型
    public dmg: {
        value: number,
        max: number,
        min: number
    }; // 角色伤害
    public dfs: {
        value: number,
        max: number,
        min: number
    }; // 角色防御
    public hp: {
        value: number,
        max: number,
        min: number
    }; // 角色血量
    public mp: {
        value: number,
        max: number,
        min: number
    }; // 角色魔法值
    public bullet: []; // 角色子弹
    public bullet_state: []; // 子弹状态
    public bullet_speed: {
        value: number,
        max: number,
        min: number
    }; // 角色子弹速度
    public atk_speed: {
        value: number,
        max: number,
        min: number
    }; // 角色攻击速率
    public atk_range: {
        value: number,
        max: number,
        min: number
    }; // 角色射程
    public luck: {
        value: number,
        max: number,
        min: number
    }; // 角色幸运
    public speed: {
        value: number,
        max: number,
        min: number
    }; // 角色移动速度
    public moveTiled: []; // 角色移动tiledid数组

    constructor(param: any) {
        super();
        this.id = param.id || '';
        this.skin = param.skin || '';
        this.component = param.component || '';
        this.name = param.name || '';
        this.description = param.description || '';
        this.atk_type = param.atk_type || '';
        this.atk_direction_type = param.atk_direction_type || '';
        this.bullet_num = param.bullet_num || 0;
        this.unit_bullet_num = param.unit_bullet_num || 0;
        this.type = param.type || [];
        this.dmg = param.dmg || null;
        this.dfs = param.dfs || null;
        this.hp = param.hp || null;
        this.mp = param.mp || null;
        this.bullet = param.bullet || [];
        this.bullet_state = param.bullet_state || [];
        this.bullet_speed = param.bullet_speed || null;
        this.atk_speed = param.atk_speed || null;
        this.atk_range = param.atk_range || null;
        this.luck = param.luck || null;
        this.speed = param.speed || null;
        this.moveTiled = param.moveTiled || [];
    }
    public getId(): string {
        return this.id;
    }
    public setId(value: string): void {
        this.id = value;
    }
    public getSkin(): string {
        return this.skin;
    }
    public setSkin(value: string): void {
        this.skin = value;
    }
    public getComponent(): string {
        return this.component;
    }
    public setComponent(value: string): void {
        this.component = value;
    }
    public getName(): string {
        return this.name;
    }
    public setName(value: string): void {
        this.name = value;
    }
    public getDescription(): string {
        return this.description;
    }
    public setDescription(value: string): void {
        this.description = value;
    }
    public getAtkType(): string {
        return this.atk_type;
    }
    public setAtkType(value: string): void {
        this.atk_type = value;
    }
    public getAtkDirectionType(): string {
        return this.atk_direction_type;
    }
    public setAtkDirectionType(value: string): void {
        this.atk_direction_type = value;
    }
    public getBulletNum(): number {
        return this.bullet_num;
    }
    public setBulletNum(value: number): void {
        this.bullet_num = value;
    }
    public getUnitBulletNum(): number {
        return this.unit_bullet_num;
    }
    public setUnitBulletNum(value: number): void {
        this.unit_bullet_num = value;
    }
    public getType(): [] {
        return this.type;
    }
    public setType(value: []): void {
        this.type = value;
    }
    public getDmg(): number {
        return this.dmg.value;
    }
    public setDmg(value: number): void {
        if (value > this.dmg.max) {
            this.dmg.value = this.dmg.max;
        } else if (value < this.dmg.min) {
            this.dmg.value = this.dmg.min;
        } else {
            this.dmg.value = value;
        }
    }
    public getDfs(): number {
        return this.dfs.value;
    }
    public setDfs(value: number): void {
        if (value > this.dfs.max) {
            this.dfs.value = this.dfs.max;
        } else if (value < this.dfs.min) {
            this.dfs.value = this.dfs.min;
        } else {
            this.dfs.value = value;
        }
    }
    public getHp(): number {
        return this.hp.value;
    }
    public setHp(value: number): void {
        if (value > this.hp.max) {
            this.hp.value = this.hp.max;
        } else if (value < this.hp.min) {
            this.hp.value = this.hp.min;
        } else {
            this.hp.value = value;
        }
    }
    public getMp(): number {
        return this.mp.value;
    }
    public setMp(value: number): void {
        if (value > this.mp.max) {
            this.mp.value = this.mp.max;
        } else if (value < this.mp.min) {
            this.mp.value = this.mp.min;
        } else {
            this.mp.value = value;
        }
    }
    public getBullet(): [] {
        return this.bullet;
    }
    public setBullet(value: []): void {
        this.bullet = value;
    }
    public getBulletState(): [] {
        return this.bullet_state;
    }
    public setBulletState(value: []): void {
        this.bullet_state = value;
    }
    public getBulletSpeed(): number {
        return this.bullet_speed.value;
    }
    public setBulletSpeed(value: number): void {
        if (value > this.bullet_speed.max) {
            this.bullet_speed.value = this.bullet_speed.max;
        } else if (value < this.bullet_speed.min) {
            this.bullet_speed.value = this.bullet_speed.min;
        } else {
            this.bullet_speed.value = value;
        }
    }
    public getAtkSpeed(): number {
        return this.atk_speed.value;
    }
    public setAtkSpeed(value: number): void {
        if (value > this.atk_speed.max) {
            this.atk_speed.value = this.atk_speed.max;
        } else if (value < this.atk_speed.min) {
            this.atk_speed.value = this.atk_speed.min;
        } else {
            this.atk_speed.value = value;
        }
    }
    public getAtkRange(): number {
        return this.atk_range.value;
    }
    public setAtkRange(value: number): void {
        if (value > this.atk_range.max) {
            this.atk_range.value = this.atk_range.max;
        } else if (value < this.atk_range.min) {
            this.atk_range.value = this.atk_range.min;
        } else {
            this.atk_range.value = value;
        }
    }
    public getLuck(): number {
        return this.luck.value;
    }
    public setLuck(value: number): void {
        if (value > this.luck.max) {
            this.luck.value = this.luck.max;
        } else if (value < this.luck.min) {
            this.luck.value = this.luck.min;
        } else {
            this.luck.value = value;
        }
    }
    public getSpeed(): number {
        return this.speed.value;
    }
    public setSpeed(value: number): void {
        if (value > this.speed.max) {
            this.speed.value = this.speed.max;
        } else if (value < this.speed.min) {
            this.speed.value = this.speed.min;
        } else {
            this.speed.value = value;
        }
    }
    public getMoveTiled(): [] {
        return this.moveTiled;
    }
    public setMoveTiled(value: []): void {
        this.moveTiled = value;
    }
} 