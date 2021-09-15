/**
 *  @description 寻路行为工具
 */

export default class SteerUtil {

    seek(target: cc.Vec2, position: cc.Vec2, velocity: cc.Vec2, maxSpeed: number): cc.Vec2 {
        let temp_v2 = cc.v2(0, 0);
        let steeredForce = cc.v2(0, 0);
        const desiredVelocity: cc.Vec2 = cc.Vec2.subtract(temp_v2, target, position).normalize()
        desiredVelocity.multiplyScalar(maxSpeed);
        const force: cc.Vec2 = desiredVelocity.subtract(velocity);
        return steeredForce.add(force);
    }
    flee(target: cc.Vec2, position: cc.Vec2, velocity: cc.Vec2, maxSpeed: number): cc.Vec2 {
        let temp_v2 = cc.v2(0, 0);
        let steeredForce = cc.v2(0, 0);
        const desiredVelocity: cc.Vec2 = cc.Vec2.subtract(temp_v2, target, position).normalize()
        desiredVelocity.multiplyScalar(maxSpeed);
        const force: cc.Vec2 = desiredVelocity.subtract(velocity);
        return steeredForce.subtract(force);
    }
    arrive(target: cc.Vec2, position: cc.Vec2, velocity: cc.Vec2, maxSpeed: number): cc.Vec2 {
        let toTarget = target.sub(position);
        let dis = toTarget.mag();

        if (dis > 20) {
            let speed = dis * dis / 0.3 * 10
            speed = Math.min(maxSpeed, speed);
            let desiredVelocity = toTarget.multiplyScalar(speed / dis)
            // return desiredVelocity;
            return desiredVelocity.sub(velocity);
        }

        return cc.v2(0, 0);
    }
    wander(target: cc.Vec2, position: cc.Vec2, velocity: cc.Vec2, maxSpeed: number): cc.Vec2 {
        let rdMax = 20;
        let radius = 3;
        let vDir = cc.v2(1, 0);
        velocity.normalize(vDir);
        let wanderCenter = position.add(vDir.multiplyScalar(1));
        let rdX = (Math.random() * 2 - 3) * rdMax;
        let rdY = (Math.random() * 2 - 3) * rdMax;
        cc.log(rdX, rdY);
        target.addSelf(cc.v2(rdX, rdY));
        cc.log(target.x, target.y);

        target.normalizeSelf();
        target.multiplyScalar(radius);
        target.addSelf(wanderCenter);

        return target.sub(position).normalizeSelf();
    }

}