import ObjectBase from "../ObjectBase";

/**
 *  @description 子弹类基类
 */
export default class Bullet extends ObjectBase {

    public id: Number; // id
    public skin: string; // 皮肤
    public component: string; // 组件
    public type: Array<string>; // 类型
    public state: []; // 状态
    public speed: number; // 移动速度
    public moveDis: number; // 移动距离
    public dmgRange: number; // 伤害范围
    public targetType: string; // 攻击目标
    public moveRd: number; // 移动角度
    public moveTiled: Array<string>; // 移动tiledid数组

    constructor(param: any) {
        super();
        this.id = param.id || 0;
        this.skin = param.skin || '';
        this.component = param.component || '';
        this.type = param.type || [];
        this.state = param.state || [];
        this.speed = param.speed || 0;
        this.moveRd = param.moveRd || 0;
        this.moveTiled = param.moveTiled || [];
    }
} 