import Role from "../model/role/Role";
import GameController from "./GameController";
import Hero from "../model/role/Hero";
import Controller from "./Controller";
import MathUtiles from "../lib/MathUtils";
import Bullet from "../model/bullet/Bullet";

/**
 *  @description 角色控制类
 */
export default class RoleController extends Controller {


    /** ------------------------------------基础方法-------------------------------------- */


    /** 获取英雄角色 */
    public static GetHeroById(id: string): Role {
        let roleInfo = JSON.parse(JSON.stringify(GameController.GameDataMap.get(id)));
        let role = new Hero(roleInfo);
        /** 加载装备 */
        this._deployEquip(role);
        /** 加载技能 */
        this._deploySkill(role);
        return role;
    }
    /** 更新角色 */
    public static UpdateHeroByHero(role: Role) {

    }


    /** ------------------------------------装备方法-------------------------------------- */


    /** 加载装备 */
    private static _deployEquip = (role: Role): void => {

    }


    /** ------------------------------------技能方法-------------------------------------- */


    /** 加载技能 */
    private static _deploySkill = (role: Role): void => {

    }


    /** ------------------------------------技能方法-------------------------------------- */


    /** 获取弹药 */
    public static getBulletByRole = (role: Role): Bullet => {
        let bulletArray = role.getBullet();
        let bulletStateArray = role.getBulletState();
        let cBulletArray = new Array();
        let cBulletStateArray = [];
        for (let elm of bulletArray) {
            let randomNum = MathUtiles.Random(elm.mix, elm.max);
            if (randomNum <= elm.value + role.getLuck() * 100) {
                cBulletArray.push(elm);
            }
        }
        for (let elm of bulletStateArray) {
            let randomNum = MathUtiles.Random(elm.mix, elm.max);
            if (randomNum <= elm.value + role.getLuck() * 100) {
                cBulletStateArray.push(elm);
            }
        }
        let bulletInfo = JSON.parse(JSON.stringify(GameController.GameDataMap.get(bulletArray[bulletArray.length - 1].id)));
        let bullet = new Bullet(bulletInfo);
        bullet.speed = role.getBulletSpeed();
        bullet.moveDis = role.getAtkRange();
        bullet.state = cBulletStateArray;
        return bullet;
    }


}