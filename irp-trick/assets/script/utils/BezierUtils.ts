/**
 *  @description 贝塞尔曲线点生成
 */

import Singleton from "../common/Singleton";

export default class BezierUtils extends Singleton {

    static CreateBezierPoints(anchorpoints, pointsAmount) {

        var points = [];

        for (var i = 0; i < pointsAmount; i++) {

            var point = this.MultiPointBezier(anchorpoints, i / pointsAmount);

            points.push(point);

        }

        return points;

    }

    static MultiPointBezier(points, t) {

        var len = points.length;

        var x = 0, y = 0;

        var erxiangshi = function (start, end) {

            var cs = 1, bcs = 1;

            while (end > 0) {

                cs *= start;

                bcs *= end;

                start--;

                end--;

            }

            return (cs / bcs);

        };

        for (var i = 0; i < len; i++) {

            var point = points[i];

            x += point.x * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));

            y += point.y * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));

        }

        return { x: x, y: y };

    }
}