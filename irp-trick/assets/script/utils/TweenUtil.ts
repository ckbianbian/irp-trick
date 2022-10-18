import BaseUtils from "./BaseUtils";

export class TweenUtil extends BaseUtils {

	static TweenTag = cc.Enum(
		{ FLOAT: 1 }
	);


	static FloatTweenByNode(node: cc.Node, offsetY = 10, time = 0.6): cc.Tween {
		node.stopActionByTag(this.TweenTag.FLOAT);
		let action = cc.tween(node).repeatForever(
			cc.tween(node).sequence(
				cc.tween(node).by(time, {
					position: cc.v3(0, - offsetY, 0)
				}), cc.tween(node).by(time, {
					position: cc.v3(0, offsetY, 0)
				})));

		action.tag(this.TweenTag.FLOAT);
		action.start();
		return action;
	}

}