import SceneC from "../SceneC";

/**
 *  @description 切换场景加载场景
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class MainC extends SceneC {


    /** ------------------------------------基础属性-------------------------------------- */


    private _age: string;
    private _sex: string;

    public get sex(): string {
        return this._sex;
    }
    public set sex(value: string) {
        this._sex = value;
    }

    public set age(v: string) {
        this._age = v;
        cc.log('use func');
    }
    public get age() {
        return this._age;
    }



    /** ------------------------------------基础方法-------------------------------------- */


    onLoad(): void {
        this._age = 'hello';
        cc.log(this._age);
        this.age = 'hello';
        cc.log(this._age);
        cc.log('here');
    }


    /** ------------------------------------子类实现-------------------------------------- */





}