// 触摸接口

export default interface ITouch {
    onTouchStart(event: cc.Event): void;
    onTouchMove(event: cc.Event): void;
    onTouchEnd(event: cc.Event): void;
    onTouchCancel(event: cc.Event): void;
}