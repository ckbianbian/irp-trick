window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  FlipCardAssembler: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8f65bHa0hpN7JeRJDIUI3jW", "FlipCardAssembler");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GTAssembler2D_1 = require("../GTAssembler2D");
    var FlipCardAssembler = function(_super) {
      __extends(FlipCardAssembler, _super);
      function FlipCardAssembler() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      FlipCardAssembler.prototype.init = function(comp) {
        _super.prototype.init.call(this, comp);
        this._renderData = new cc.RenderData();
        this._renderData.init(this);
        this.initLocal();
        this.initData(comp);
      };
      FlipCardAssembler.prototype.initData = function(sprite) {
        var data = this._renderData;
        this.verticesCount = sprite.xPointNum * sprite.yPointNum;
        this.indicesCount = (sprite.xPointNum - 1) * (sprite.yPointNum - 1) * 6;
        data.createData(0, this.verticesFloats, this.indicesCount);
        var indices = this._renderData.iDatas[0];
        this.cfgIndice(sprite, indices);
      };
      FlipCardAssembler.prototype.fillBuffers = function(comp, renderer) {
        renderer.worldMatDirty && this.updateWorldVerts(comp);
        var renderData = this._renderData;
        var vData = renderData.vDatas[0];
        var iData = renderData.iDatas[0];
        var buffer = this.getBuffer();
        var offsetInfo = buffer.request(this.verticesCount, this.indicesCount);
        var vertexOffset = offsetInfo.byteOffset >> 2, vbuf = buffer._vData;
        vData.length + vertexOffset > vbuf.length ? vbuf.set(vData.subarray(0, vbuf.length - vertexOffset), vertexOffset) : vbuf.set(vData, vertexOffset);
        var ibuf = buffer._iData, indiceOffset = offsetInfo.indiceOffset, vertexId = offsetInfo.vertexOffset;
        for (var i = 0, l = iData.length; i < l; i++) ibuf[indiceOffset++] = vertexId + iData[i];
      };
      FlipCardAssembler.prototype.cfgIndice = function(sprite, arr) {
        var idx = 0;
        for (var y = 1; y < sprite.yPointNum; y++) {
          var yStart = y * sprite.xPointNum;
          var yCurrent = (y - 1) * sprite.xPointNum;
          for (var x = 0; x < sprite.xPointNum - 1; x++) {
            var vertextTYID = yStart + x;
            var vertextYID = yCurrent + x;
            arr[idx++] = vertextYID;
            arr[idx++] = vertextYID + 1;
            arr[idx++] = vertextTYID;
            arr[idx++] = vertextYID + 1;
            arr[idx++] = vertextTYID + 1;
            arr[idx++] = vertextTYID;
          }
        }
        true;
      };
      FlipCardAssembler.prototype.updateVerts = function(sprite) {
        var xNum = sprite.xPointNum;
        var yNum = sprite.yPointNum;
        if (sprite) {
          var local = this._local;
          var index = 0;
          var pointList = sprite.getPosList();
          for (var i = 0; i < yNum; i++) for (var j = 0; j < xNum; j++) {
            local[index] = pointList[i][j];
            index++;
          }
        }
        this.updateWorldVerts(sprite);
      };
      FlipCardAssembler.prototype.updateWorldVertsWebGL = function(comp) {
        var local = this._local;
        var verts = this._renderData.vDatas[0];
        var matrix = comp.node._worldMatrix;
        var matrixm = matrix.m, a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5], tx = matrixm[12], ty = matrixm[13];
        var vl = local[0], vr = local[2], vb = local[1], vt = local[3];
        var justTranslate = 1 === a && 0 === b && 0 === c && 1 === d;
        var index = 0;
        var floatsPerVert = this.floatsPerVert;
        for (var i = 0; i < this.verticesCount; i++) {
          var p0 = local[i];
          verts[index] = p0.x * a + p0.y * c + tx;
          verts[index + 1] = p0.x * b + p0.y * d + ty;
          index += floatsPerVert;
        }
      };
      FlipCardAssembler.prototype.updateUVs = function(sprite) {
        var xNum = sprite.xPointNum;
        var yNum = sprite.yPointNum;
        var verts = this._renderData.vDatas[0];
        var uvOffset = this.uvOffset;
        var floatsPerVert = this.floatsPerVert;
        var idx = 0;
        for (var y = 0; y < yNum; y++) for (var x = 0; x < xNum; x++) {
          var voffset = idx * floatsPerVert;
          verts[voffset + uvOffset] = x / (xNum - 1);
          verts[voffset + uvOffset + 1] = y / (yNum - 1);
          idx++;
        }
      };
      FlipCardAssembler.prototype.updateColor = function(sprite, color) {
        var uintVerts = this._renderData.uintVDatas[0];
        if (!uintVerts) return;
        color = null != color ? color : sprite.node.color._val;
        var floatsPerVert = this.floatsPerVert;
        var colorOffset = this.colorOffset;
        for (var i = colorOffset, l = uintVerts.length; i < l; i += floatsPerVert) uintVerts[i] = color;
      };
      return FlipCardAssembler;
    }(GTAssembler2D_1.default);
    exports.default = FlipCardAssembler;
    cc._RF.pop();
  }, {
    "../GTAssembler2D": "GTAssembler2D"
  } ],
  FlipCardSprite: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6146fJ4xSZDnYtZMijNEjsR", "FlipCardSprite");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var FlipCardAssembler_1 = require("./FlipCardAssembler");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var VertInfo = function() {
      function VertInfo(x, y) {
        this.pos = cc.v2(x, y);
      }
      return VertInfo;
    }();
    var FlipCardSprite = function(_super) {
      __extends(FlipCardSprite, _super);
      function FlipCardSprite() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.xPointNum = 2;
        _this.yPointNum = 3;
        _this.faceTexture = null;
        _this.backTexture = null;
        _this._pointList = [];
        _this._timer = 0;
        return _this;
      }
      FlipCardSprite.prototype.onEnable = function() {
        _super.prototype.onEnable.call(this);
        this.cfgPos();
      };
      FlipCardSprite.prototype.update = function(dt) {};
      FlipCardSprite.prototype.initPic = function() {
        this.cfgPos();
        this.setVertsDirty();
      };
      FlipCardSprite.prototype.foldCard = function() {
        for (var y = 0; y < this.yPointNum; y++) for (var x = 0; x < this.xPointNum; x++) if (this._pointList[y][x]) {
          var posY = y / (this.yPointNum - 1) * this.node.height;
          var point = this._pointList[y][x];
          var tempPos = cc.v2(0, 0);
          if (point.pos.x + point.pos.y <= -50) {
            tempPos.x = -50 - point.pos.y;
            tempPos.y = -50 - point.pos.x;
            point.pos.x = tempPos.x;
            point.pos.y = tempPos.y;
          }
        }
      };
      FlipCardSprite.prototype.flapWave = function(dt) {
        var time = cc.director.getTotalTime();
        for (var y = 0; y < this.yPointNum; y++) for (var x = 0; x < this.xPointNum; x++) if (this._pointList[y][x]) {
          var posY = y / (this.yPointNum - 1) * this.node.height;
          var point = this._pointList[y][x];
          var sinY = 8 * Math.sin((point.pos.x + time) / 50);
          point.pos.y = posY + sinY;
        }
      };
      FlipCardSprite.prototype._resetAssembler = function() {
        this.setVertsDirty();
        var assembler = this._assembler = new FlipCardAssembler_1.default();
        assembler.init(this);
      };
      FlipCardSprite.prototype.cfgPos = function() {
        for (var y = 0; y < this.yPointNum; y++) {
          this._pointList[y] || (this._pointList[y] = []);
          var archOffsetX = this.node.anchorX * this.node.width;
          var archOffsetY = this.node.anchorY * this.node.height;
          var posY = y / (this.yPointNum - 1) * this.node.height;
          for (var x = 0; x < this.xPointNum; x++) {
            var posX = x / (this.xPointNum - 1) * this.node.width;
            this._pointList[y][x] = new VertInfo(posX - archOffsetX, posY - archOffsetY);
          }
        }
        true;
      };
      FlipCardSprite.prototype.getPosList = function() {
        var pointList = [];
        for (var i = 0; i < this.yPointNum; i++) pointList[i] || (pointList[i] = []);
        for (var i = 0; i < this.yPointNum; i++) for (var j = 0; j < this.xPointNum; j++) {
          var point1 = this._pointList[i][j];
          pointList[i][j] = cc.v2(point1.pos.x, point1.pos.y);
        }
        return pointList;
      };
      __decorate([ property({
        displayName: "x\u8f74\u65b9\u5411\u70b9\u6570\u91cf"
      }) ], FlipCardSprite.prototype, "xPointNum", void 0);
      __decorate([ property({
        displayName: "y\u8f74\u65b9\u5411\u70b9\u6570\u91cf"
      }) ], FlipCardSprite.prototype, "yPointNum", void 0);
      __decorate([ property({
        displayName: "\u6b63\u9762",
        type: cc.Texture2D
      }) ], FlipCardSprite.prototype, "faceTexture", void 0);
      __decorate([ property({
        displayName: "\u53cd\u9762",
        type: cc.Texture2D
      }) ], FlipCardSprite.prototype, "backTexture", void 0);
      FlipCardSprite = __decorate([ ccclass ], FlipCardSprite);
      return FlipCardSprite;
    }(cc.Sprite);
    exports.default = FlipCardSprite;
    cc._RF.pop();
  }, {
    "./FlipCardAssembler": "FlipCardAssembler"
  } ],
  FlipPageAssembler: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ffb8aaXkipH7r+nQ4zrtMCJ", "FlipPageAssembler");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GTSimpleSpriteAssembler2D_1 = require("../GTSimpleSpriteAssembler2D");
    var gfx = cc.gfx;
    var vfmtCustom = new gfx.VertexFormat([ {
      name: gfx.ATTR_POSITION,
      type: gfx.ATTR_TYPE_FLOAT32,
      num: 2
    }, {
      name: gfx.ATTR_UV0,
      type: gfx.ATTR_TYPE_FLOAT32,
      num: 2
    }, {
      name: gfx.ATTR_UV1,
      type: gfx.ATTR_TYPE_FLOAT32,
      num: 2
    }, {
      name: "a_p",
      type: gfx.ATTR_TYPE_FLOAT32,
      num: 2
    }, {
      name: "a_q",
      type: gfx.ATTR_TYPE_FLOAT32,
      num: 2
    } ]);
    var VEC2_ZERO = cc.Vec2.ZERO;
    var temp_uvs = [];
    var FlipPageAssembler = function(_super) {
      __extends(FlipPageAssembler, _super);
      function FlipPageAssembler() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.verticesCount = 4;
        _this.indicesCount = 6;
        _this.uvOffset = 2;
        _this.uv1Offset = 4;
        _this.uv2Offset = 6;
        _this.uv3Offset = 8;
        _this.floatsPerVert = 5;
        _this.moveSpeed = VEC2_ZERO;
        return _this;
      }
      FlipPageAssembler.prototype.initData = function(sprite) {
        var pointNum = sprite.pointsCount;
        this.verticesCount = pointNum * pointNum;
        this.indicesCount = (pointNum - 1) * (pointNum - 1) * 6;
        if (this._renderData.meshCount > 0) return;
        this._renderData.createData(0, this.verticesFloats, this.indicesCount);
        var indices = this._renderData.iDatas[0];
        var indexOffset = 0;
        for (var r = 0; r < pointNum - 1; ++r) for (var c = 0; c < pointNum - 1; ++c) {
          var start = r * pointNum + c;
          indices[indexOffset++] = start;
          indices[indexOffset++] = start + 1;
          indices[indexOffset++] = start + pointNum;
          indices[indexOffset++] = start + 1;
          indices[indexOffset++] = start + pointNum + 1;
          indices[indexOffset++] = start + pointNum;
        }
      };
      FlipPageAssembler.prototype.calcSlicedUV = function(__pointNum) {
        var uvSliced = [];
        uvSliced.length = 0;
        for (var i = 0; i < __pointNum; i++) {
          temp_uvs[i] || (temp_uvs[i] = {
            u: 0,
            v: 0
          });
          temp_uvs[i].u = i / (__pointNum - 1);
          temp_uvs[i].v = (__pointNum - 1 - i) / (__pointNum - 1);
        }
        for (var row = 0; row < __pointNum; ++row) {
          var rowD = temp_uvs[row];
          for (var col = 0; col < __pointNum; ++col) {
            var colD = temp_uvs[col];
            uvSliced.push({
              u: colD.u,
              v: rowD.v
            });
          }
        }
        return uvSliced;
      };
      FlipPageAssembler.prototype.fillBuffers = function(comp, renderer) {
        renderer.worldMatDirty && this.updateWorldVerts(comp);
        var renderData = this._renderData;
        var vData = renderData.vDatas[0];
        var iData = renderData.iDatas[0];
        var buffer = this.getBuffer();
        var offsetInfo = buffer.request(this.verticesCount, this.indicesCount);
        var vertexOffset = offsetInfo.byteOffset >> 2, vbuf = buffer._vData;
        vData.length + vertexOffset > vbuf.length ? vbuf.set(vData.subarray(0, vbuf.length - vertexOffset), vertexOffset) : vbuf.set(vData, vertexOffset);
        var ibuf = buffer._iData, indiceOffset = offsetInfo.indiceOffset, vertexId = offsetInfo.vertexOffset;
        for (var i = 0, l = iData.length; i < l; i++) ibuf[indiceOffset++] = vertexId + iData[i];
      };
      FlipPageAssembler.prototype.updateUVs = function(sprite) {
        var pointNum = sprite.pointsCount;
        var verts = this._renderData.vDatas[0];
        var uvSliced = this.calcSlicedUV(pointNum);
        var uvOffset = this.uvOffset;
        var floatsPerVert = this.floatsPerVert;
        for (var row = 0; row < pointNum; ++row) for (var col = 0; col < pointNum; ++col) {
          var vid = row * pointNum + col;
          var uv = uvSliced[vid];
          var voffset = vid * floatsPerVert;
          verts[voffset + uvOffset] = uv.u;
          verts[voffset + uvOffset + 1] = uv.v;
        }
      };
      FlipPageAssembler.prototype.updateVerts = function(sprite) {
        var pointNum = sprite.pointsCount;
        if (sprite) {
          var local = this._local;
          var index = 0;
          var pointList = sprite.getPointList();
          var num = -1;
          for (var i = 0; i < pointNum; i++) for (var j = 0; j < pointNum; j++) {
            local[index] = pointList[i][j];
            local[index].y += sprite.flag;
            sprite.flag *= num;
            index++;
          }
        }
        this.updateWorldVerts(sprite);
      };
      FlipPageAssembler.prototype.updateWorldVertsWebGL = function(sprite) {
        var matrix = sprite.node._worldMatrix;
        var matrixm = matrix.m, a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5], tx = matrixm[12], ty = matrixm[13];
        var worldIndex = 0;
        var local = this._local;
        var world = this._renderData.vDatas[0];
        var floatsPerVert = this.floatsPerVert;
        for (var i = 0; i < this.verticesCount; i++) {
          var p0 = local[i];
          world[worldIndex] = p0.x * a + p0.y * c + tx;
          world[worldIndex + 1] = p0.x * b + p0.y * d + ty;
          worldIndex += floatsPerVert;
        }
      };
      FlipPageAssembler.prototype.updateWorldVertsNative = function(sprite) {
        var worldIndex = 0;
        var local = this._local;
        var world = this._renderData.vDatas[0];
        var floatsPerVert = this.floatsPerVert;
        for (var i = 0; i < this.verticesCount; i++) {
          var p0 = local[i];
          world[worldIndex] = p0.x;
          world[worldIndex + 1] = p0.y;
          worldIndex += floatsPerVert;
        }
      };
      return FlipPageAssembler;
    }(GTSimpleSpriteAssembler2D_1.default);
    exports.default = FlipPageAssembler;
    cc._RF.pop();
  }, {
    "../GTSimpleSpriteAssembler2D": "GTSimpleSpriteAssembler2D"
  } ],
  FlipPageSprite: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "832f8KY2lhKwqY5uDZmU/xO", "FlipPageSprite");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var FlipPageAssembler_1 = require("./FlipPageAssembler");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MassPoint = function() {
      function MassPoint(x, y, tmpF, isFix) {
        this.oldPos = this.newPos = cc.v2(x, y);
        this.force = tmpF;
        this.isFix = isFix || false;
      }
      return MassPoint;
    }();
    var MovingBGSprite = function(_super) {
      __extends(MovingBGSprite, _super);
      function MovingBGSprite() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.pointsCount = 4;
        _this._pointList = [];
        _this.flag = 10;
        return _this;
      }
      MovingBGSprite.prototype.FlushProperties = function() {
        var assembler = this._assembler;
        if (!assembler) return;
        this.setVertsDirty();
      };
      MovingBGSprite.prototype.onEnable = function() {
        _super.prototype.onEnable.call(this);
        this.initPointList();
        this.schedule(this.updateParam, .3);
      };
      MovingBGSprite.prototype.updateParam = function() {
        this.flag *= -1;
        this.FlushProperties();
      };
      MovingBGSprite.prototype.initPointList = function() {
        for (var i = 0; i < this.pointsCount; i++) {
          this._pointList[i] || (this._pointList[i] = []);
          var posY = i / (this.pointsCount - 1) * this.node.height;
          for (var j = 0; j < this.pointsCount; j++) {
            var posX = j / (this.pointsCount - 1) * this.node.width;
            this._pointList[i][j] = new MassPoint(posX, posY, cc.v2(0, 0), false);
          }
        }
        this._pointList[0][0].isFix = true;
        this._pointList[0][this.pointsCount - 1].isFix = true;
        this._pointList[this.pointsCount - 1][0].isFix = true;
        this._pointList[this.pointsCount - 1][this.pointsCount - 1].isFix = true;
      };
      MovingBGSprite.prototype.getPointList = function() {
        var pointList = [];
        for (var i = 0; i < this.pointsCount; i++) pointList[i] || (pointList[i] = []);
        for (var i = 0; i < this.pointsCount; i++) for (var j = 0; j < this.pointsCount; j++) {
          var point1 = this._pointList[i][j];
          pointList[i][j] = cc.v2(point1.newPos.x, point1.newPos.y);
        }
        return pointList;
      };
      MovingBGSprite.prototype._resetAssembler = function() {
        this.setVertsDirty();
        var assembler = this._assembler = new FlipPageAssembler_1.default();
        this.FlushProperties();
        assembler.init(this);
        this._updateColor();
      };
      MovingBGSprite = __decorate([ ccclass ], MovingBGSprite);
      return MovingBGSprite;
    }(cc.Sprite);
    exports.default = MovingBGSprite;
    cc._RF.pop();
  }, {
    "./FlipPageAssembler": "FlipPageAssembler"
  } ],
  GTAssembler2D: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d4fbegiN6VCErbuEgBy/2td", "GTAssembler2D");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GTAssembler2D = function(_super) {
      __extends(GTAssembler2D, _super);
      function GTAssembler2D() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.verticesCount = 4;
        _this.indicesCount = 6;
        _this.floatsPerVert = 5;
        _this.uvOffset = 2;
        _this.colorOffset = 4;
        _this._renderData = null;
        _this._local = null;
        return _this;
      }
      GTAssembler2D.prototype.init = function(comp) {
        _super.prototype.init.call(this, comp);
        this._renderData = new cc.RenderData();
        this._renderData.init(this);
        this.initLocal();
        this.initData(comp);
      };
      Object.defineProperty(GTAssembler2D.prototype, "verticesFloats", {
        get: function() {
          return this.verticesCount * this.floatsPerVert;
        },
        enumerable: false,
        configurable: true
      });
      GTAssembler2D.prototype.initData = function() {
        var data = this._renderData;
        data.createQuadData(0, this.verticesFloats, this.indicesCount);
      };
      GTAssembler2D.prototype.initLocal = function() {
        this._local = [];
        this._local.length = 4;
      };
      GTAssembler2D.prototype.updateColor = function(comp, color) {
        var uintVerts = this._renderData.uintVDatas[0];
        if (!uintVerts) return;
        color = null != color ? color : comp.node.color._val;
        var floatsPerVert = this.floatsPerVert;
        var colorOffset = this.colorOffset;
        for (var i = colorOffset, l = uintVerts.length; i < l; i += floatsPerVert) uintVerts[i] = color;
      };
      GTAssembler2D.prototype.getBuffer = function() {
        return cc.renderer._handle._meshBuffer;
      };
      GTAssembler2D.prototype.updateWorldVerts = function(comp) {
        false;
        this.updateWorldVertsWebGL(comp);
      };
      GTAssembler2D.prototype.updateWorldVertsWebGL = function(comp) {
        var local = this._local;
        var verts = this._renderData.vDatas[0];
        var matrix = comp.node._worldMatrix;
        var matrixm = matrix.m, a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5], tx = matrixm[12], ty = matrixm[13];
        var vl = local[0], vr = local[2], vb = local[1], vt = local[3];
        var justTranslate = 1 === a && 0 === b && 0 === c && 1 === d;
        var index = 0;
        var floatsPerVert = this.floatsPerVert;
        if (justTranslate) {
          verts[index] = vl + tx;
          verts[index + 1] = vb + ty;
          index += floatsPerVert;
          verts[index] = vr + tx;
          verts[index + 1] = vb + ty;
          index += floatsPerVert;
          verts[index] = vl + tx;
          verts[index + 1] = vt + ty;
          index += floatsPerVert;
          verts[index] = vr + tx;
          verts[index + 1] = vt + ty;
        } else {
          var al = a * vl, ar = a * vr, bl = b * vl, br = b * vr, cb = c * vb, ct = c * vt, db = d * vb, dt = d * vt;
          verts[index] = al + cb + tx;
          verts[index + 1] = bl + db + ty;
          index += floatsPerVert;
          verts[index] = ar + cb + tx;
          verts[index + 1] = br + db + ty;
          index += floatsPerVert;
          verts[index] = al + ct + tx;
          verts[index + 1] = bl + dt + ty;
          index += floatsPerVert;
          verts[index] = ar + ct + tx;
          verts[index + 1] = br + dt + ty;
        }
      };
      GTAssembler2D.prototype.updateWorldVertsNative = function(comp) {
        var local = this._local;
        var verts = this._renderData.vDatas[0];
        var floatsPerVert = this.floatsPerVert;
        var vl = local[0], vr = local[2], vb = local[1], vt = local[3];
        var index = 0;
        verts[index] = vl;
        verts[index + 1] = vb;
        index += floatsPerVert;
        verts[index] = vr;
        verts[index + 1] = vb;
        index += floatsPerVert;
        verts[index] = vl;
        verts[index + 1] = vt;
        index += floatsPerVert;
        verts[index] = vr;
        verts[index + 1] = vt;
      };
      GTAssembler2D.prototype.fillBuffers = function(comp, renderer) {
        renderer.worldMatDirty && this.updateWorldVerts(comp);
        var renderData = this._renderData;
        var vData = renderData.vDatas[0];
        var iData = renderData.iDatas[0];
        var buffer = this.getBuffer();
        var offsetInfo = buffer.request(this.verticesCount, this.indicesCount);
        var vertexOffset = offsetInfo.byteOffset >> 2, vbuf = buffer._vData;
        vData.length + vertexOffset > vbuf.length ? vbuf.set(vData.subarray(0, vbuf.length - vertexOffset), vertexOffset) : vbuf.set(vData, vertexOffset);
        var ibuf = buffer._iData, indiceOffset = offsetInfo.indiceOffset, vertexId = offsetInfo.vertexOffset;
        for (var i = 0, l = iData.length; i < l; i++) ibuf[indiceOffset++] = vertexId + iData[i];
      };
      GTAssembler2D.prototype.packToDynamicAtlas = function(comp, frame) {
        false;
        if (!frame._original && cc.dynamicAtlasManager && frame._texture.packable) {
          var packedFrame = cc.dynamicAtlasManager.insertSpriteFrame(frame);
          packedFrame && frame._setDynamicAtlasFrame(packedFrame);
        }
        var material = comp._materials[0];
        if (!material) return;
        if (material.getProperty("texture") !== frame._texture) {
          comp._vertsDirty = true;
          comp._updateMaterial();
        }
      };
      GTAssembler2D.prototype.updateUVs = function(comp) {
        var uv = [ 0, 0, 1, 0, 0, 1, 1, 1 ];
        var uvOffset = this.uvOffset;
        var floatsPerVert = this.floatsPerVert;
        var verts = this._renderData.vDatas[0];
        for (var i = 0; i < 4; i++) {
          var srcOffset = 2 * i;
          var dstOffset = floatsPerVert * i + uvOffset;
          verts[dstOffset] = uv[srcOffset];
          verts[dstOffset + 1] = uv[srcOffset + 1];
        }
      };
      GTAssembler2D.prototype.updateVerts = function(comp) {
        var node = comp.node, cw = node.width, ch = node.height, appx = node.anchorX * cw, appy = node.anchorY * ch, l, b, r, t;
        l = -appx;
        b = -appy;
        r = cw - appx;
        t = ch - appy;
        var local = this._local;
        local[0] = l;
        local[1] = b;
        local[2] = r;
        local[3] = t;
        this.updateWorldVerts(comp);
      };
      GTAssembler2D.prototype.updateRenderData = function(comp) {
        if (comp._vertsDirty) {
          this.updateUVs(comp);
          this.updateVerts(comp);
          comp._vertsDirty = false;
        }
      };
      return GTAssembler2D;
    }(cc.Assembler);
    exports.default = GTAssembler2D;
    cc._RF.pop();
  }, {} ],
  GTAutoFitSpriteAssembler2D: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "09b6e3j/uxKB6EJyD1pX5JI", "GTAutoFitSpriteAssembler2D");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GTSimpleSpriteAssembler2D_1 = require("./GTSimpleSpriteAssembler2D");
    var GTAutoFitSpriteAssembler2D = function(_super) {
      __extends(GTAutoFitSpriteAssembler2D, _super);
      function GTAutoFitSpriteAssembler2D() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._uv = [];
        return _this;
      }
      GTAutoFitSpriteAssembler2D.prototype.updateUVs = function(sprite) {
        var rect = sprite._spriteFrame.getRect();
        var node = sprite.node;
        if (!rect.width || !rect.height || !node.width || !node.height) {
          _super.prototype.updateUVs.call(this, sprite);
          return;
        }
        Object.assign(this._uv, sprite._spriteFrame.uv);
        var uv = this._uv;
        var wscale = rect.width / node.width;
        var hscale = rect.height / node.height;
        var ratio = 1;
        var isRotated = sprite._spriteFrame.isRotated();
        var l = uv[0], r = uv[2], b = uv[1], t = uv[5];
        if (isRotated) {
          l = uv[1];
          r = uv[3];
          b = uv[0];
          t = uv[4];
        }
        if (wscale > hscale) {
          ratio = hscale / wscale;
          var ro = isRotated ? 1 : 0;
          var c = .5 * (l + r);
          var half = .5 * (r - l) * ratio;
          l = uv[0 + ro] = uv[4 + ro] = c - half;
          r = uv[2 + ro] = uv[6 + ro] = c + half;
        } else {
          ratio = wscale / hscale;
          var ro = isRotated ? -1 : 0;
          var c = .5 * (b + t);
          var half = .5 * (b - t) * ratio;
          b = uv[1 + ro] = uv[3 + ro] = c + half;
          t = uv[5 + ro] = uv[7 + ro] = c - half;
        }
        var uvOffset = this.uvOffset;
        var floatsPerVert = this.floatsPerVert;
        var verts = this._renderData.vDatas[0];
        for (var i = 0; i < 4; i++) {
          var srcOffset = 2 * i;
          var dstOffset = floatsPerVert * i + uvOffset;
          verts[dstOffset] = uv[srcOffset];
          verts[dstOffset + 1] = uv[srcOffset + 1];
        }
      };
      return GTAutoFitSpriteAssembler2D;
    }(GTSimpleSpriteAssembler2D_1.default);
    exports.default = GTAutoFitSpriteAssembler2D;
    cc._RF.pop();
  }, {
    "./GTSimpleSpriteAssembler2D": "GTSimpleSpriteAssembler2D"
  } ],
  GTSimpleSpriteAssembler2D: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "26a9eHceuxMmo2jjmZoWQwz", "GTSimpleSpriteAssembler2D");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GTAssembler2D_1 = require("./GTAssembler2D");
    var GTSimpleSpriteAssembler2D = function(_super) {
      __extends(GTSimpleSpriteAssembler2D, _super);
      function GTSimpleSpriteAssembler2D() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      GTSimpleSpriteAssembler2D.prototype.updateRenderData = function(sprite) {
        this.packToDynamicAtlas(sprite, sprite._spriteFrame);
        _super.prototype.updateRenderData.call(this, sprite);
      };
      GTSimpleSpriteAssembler2D.prototype.updateUVs = function(sprite) {
        var uv = sprite._spriteFrame.uv;
        var uvOffset = this.uvOffset;
        var floatsPerVert = this.floatsPerVert;
        var verts = this._renderData.vDatas[0];
        for (var i = 0; i < 4; i++) {
          var srcOffset = 2 * i;
          var dstOffset = floatsPerVert * i + uvOffset;
          verts[dstOffset] = uv[srcOffset];
          verts[dstOffset + 1] = uv[srcOffset + 1];
        }
      };
      GTSimpleSpriteAssembler2D.prototype.updateVerts = function(sprite) {
        var node = sprite.node, cw = node.width, ch = node.height, appx = node.anchorX * cw, appy = node.anchorY * ch, l, b, r, t;
        if (sprite.trim) {
          l = -appx;
          b = -appy;
          r = cw - appx;
          t = ch - appy;
        } else {
          var frame = sprite.spriteFrame, ow = frame._originalSize.width, oh = frame._originalSize.height, rw = frame._rect.width, rh = frame._rect.height, offset = frame._offset, scaleX = cw / ow, scaleY = ch / oh;
          var trimLeft = offset.x + (ow - rw) / 2;
          var trimRight = offset.x - (ow - rw) / 2;
          var trimBottom = offset.y + (oh - rh) / 2;
          var trimTop = offset.y - (oh - rh) / 2;
          l = trimLeft * scaleX - appx;
          b = trimBottom * scaleY - appy;
          r = cw + trimRight * scaleX - appx;
          t = ch + trimTop * scaleY - appy;
        }
        var local = this._local;
        local[0] = l;
        local[1] = b;
        local[2] = r;
        local[3] = t;
        this.updateWorldVerts(sprite);
      };
      return GTSimpleSpriteAssembler2D;
    }(GTAssembler2D_1.default);
    exports.default = GTSimpleSpriteAssembler2D;
    cc._RF.pop();
  }, {
    "./GTAssembler2D": "GTAssembler2D"
  } ],
  LayeredBatchingAssembler: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9b7db/QlVpNR6BkHD3PCH0u", "LayeredBatchingAssembler");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GTSimpleSpriteAssembler2D_1 = require("../GTSimpleSpriteAssembler2D");
    var RENDER_MASK = cc.RenderFlow.FLAG_RENDER | cc.RenderFlow.FLAG_POST_RENDER;
    var PROP_DIRTY_MASK = cc.RenderFlow.FLAG_OPACITY | cc.RenderFlow.FLAG_WORLD_TRANSFORM;
    var BATCH_OPTIMIZE_SWITCH = true;
    var LayeredBatchingAssembler = function(_super) {
      __extends(LayeredBatchingAssembler, _super);
      function LayeredBatchingAssembler() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      LayeredBatchingAssembler.prototype.fillBuffers = function(comp, renderer) {
        _super.prototype.fillBuffers.call(this, comp, renderer);
        false, false;
        if (!BATCH_OPTIMIZE_SWITCH) return;
        var layer = [];
        this._layers = [ layer ];
        var worldTransformFlag = renderer.worldMatDirty ? cc.RenderFlow.FLAG_WORLD_TRANSFORM : 0;
        var worldOpacityFlag = renderer.parentOpacityDirty ? cc.RenderFlow.FLAG_OPACITY_COLOR : 0;
        var dirtyFlag = worldTransformFlag | worldOpacityFlag;
        comp.node["__gtDirtyFlag"] = dirtyFlag;
        var queue = [];
        queue.push(comp.node);
        var depth = 0;
        var end = 1;
        var iter = 0;
        var gtRenderFlag;
        while (iter < queue.length) {
          var node = queue[iter++];
          dirtyFlag = node["__gtDirtyFlag"];
          for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (!c._activeInHierarchy || 0 === c._opacity) continue;
            gtRenderFlag = c._renderFlag & RENDER_MASK;
            if (gtRenderFlag > 0) {
              c["__gtRenderFlag"] = gtRenderFlag;
              c._renderFlag &= ~gtRenderFlag;
              layer.push(c);
            }
            c["__gtDirtyFlag"] = dirtyFlag | c._renderFlag & PROP_DIRTY_MASK;
            queue.push(c);
          }
          if (iter == end) {
            ++depth;
            end = queue.length;
            layer = [];
            this._layers.push(layer);
          }
        }
      };
      LayeredBatchingAssembler.prototype.postFillBuffers = function(comp, renderer) {
        var originWorldMatDirty = renderer.worldMatDirty;
        if (!BATCH_OPTIMIZE_SWITCH || !this._layers) return;
        BATCH_OPTIMIZE_SWITCH = false;
        var gtRenderFlag;
        var gtDirtyFlag;
        for (var _i = 0, _a = this._layers; _i < _a.length; _i++) {
          var layer = _a[_i];
          if (0 == layer.length) continue;
          for (var _b = 0, layer_1 = layer; _b < layer_1.length; _b++) {
            var c = layer_1[_b];
            gtRenderFlag = c["__gtRenderFlag"];
            gtDirtyFlag = c["__gtDirtyFlag"];
            renderer.worldMatDirty = gtDirtyFlag > 0 ? 1 : 0;
            c._renderFlag |= gtRenderFlag;
            cc.RenderFlow.flows[gtRenderFlag]._func(c);
          }
        }
        this._layers = null;
        BATCH_OPTIMIZE_SWITCH = true;
        renderer.worldMatDirty = originWorldMatDirty;
      };
      return LayeredBatchingAssembler;
    }(GTSimpleSpriteAssembler2D_1.default);
    exports.default = LayeredBatchingAssembler;
    cc._RF.pop();
  }, {
    "../GTSimpleSpriteAssembler2D": "GTSimpleSpriteAssembler2D"
  } ],
  LayeredBatchingRootRenderer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7e264FDcplMY5rNb2sCjRtf", "LayeredBatchingRootRenderer");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var LayeredBatchingAssembler_1 = require("./LayeredBatchingAssembler");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LayeredBatchingRootRenderer = function(_super) {
      __extends(LayeredBatchingRootRenderer, _super);
      function LayeredBatchingRootRenderer() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      LayeredBatchingRootRenderer.prototype.onEnable = function() {
        _super.prototype.onEnable.call(this);
        true, true;
        this.node._renderFlag |= cc.RenderFlow.FLAG_POST_RENDER;
      };
      LayeredBatchingRootRenderer.prototype._resetAssembler = function() {
        this.setVertsDirty();
        var assembler = this._assembler = new LayeredBatchingAssembler_1.default();
        assembler.init(this);
      };
      LayeredBatchingRootRenderer = __decorate([ ccclass ], LayeredBatchingRootRenderer);
      return LayeredBatchingRootRenderer;
    }(cc.Sprite);
    exports.default = LayeredBatchingRootRenderer;
    cc._RF.pop();
  }, {
    "./LayeredBatchingAssembler": "LayeredBatchingAssembler"
  } ],
  MovingBGAssembler: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e1c35wY/WtDI4NVp88fW7Kq", "MovingBGAssembler");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GTSimpleSpriteAssembler2D_1 = require("../GTSimpleSpriteAssembler2D");
    var gfx = cc.gfx;
    var vfmtCustom = new gfx.VertexFormat([ {
      name: gfx.ATTR_POSITION,
      type: gfx.ATTR_TYPE_FLOAT32,
      num: 2
    }, {
      name: gfx.ATTR_UV0,
      type: gfx.ATTR_TYPE_FLOAT32,
      num: 2
    }, {
      name: gfx.ATTR_UV1,
      type: gfx.ATTR_TYPE_FLOAT32,
      num: 2
    }, {
      name: "a_p",
      type: gfx.ATTR_TYPE_FLOAT32,
      num: 2
    }, {
      name: "a_q",
      type: gfx.ATTR_TYPE_FLOAT32,
      num: 2
    } ]);
    var VEC2_ZERO = cc.Vec2.ZERO;
    var MovingBGAssembler = function(_super) {
      __extends(MovingBGAssembler, _super);
      function MovingBGAssembler() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.verticesCount = 4;
        _this.indicesCount = 6;
        _this.uvOffset = 2;
        _this.uv1Offset = 4;
        _this.uv2Offset = 6;
        _this.uv3Offset = 8;
        _this.floatsPerVert = 10;
        _this.moveSpeed = VEC2_ZERO;
        return _this;
      }
      MovingBGAssembler.prototype.initData = function() {
        var data = this._renderData;
        data.createFlexData(0, this.verticesCount, this.indicesCount, this.getVfmt());
        var indices = data.iDatas[0];
        var count = indices.length / 6;
        for (var i = 0, idx = 0; i < count; i++) {
          var vertextID = 4 * i;
          indices[idx++] = vertextID;
          indices[idx++] = vertextID + 1;
          indices[idx++] = vertextID + 2;
          indices[idx++] = vertextID + 1;
          indices[idx++] = vertextID + 3;
          indices[idx++] = vertextID + 2;
        }
      };
      MovingBGAssembler.prototype.getVfmt = function() {
        return vfmtCustom;
      };
      MovingBGAssembler.prototype.getBuffer = function() {
        return cc.renderer._handle.getBuffer("mesh", this.getVfmt());
      };
      MovingBGAssembler.prototype.updateColor = function(sprite, color) {};
      MovingBGAssembler.prototype.updateUVs = function(sprite) {
        _super.prototype.updateUVs.call(this, sprite);
        var uv = sprite._spriteFrame.uv;
        var uvOffset = this.uvOffset;
        var floatsPerVert = this.floatsPerVert;
        var verts = this._renderData.vDatas[0];
        var dstOffset;
        var l = uv[0], r = uv[2], t = uv[5], b = uv[1];
        var px = 1 / (r - l), qx = -l * px;
        var py = 1 / (b - t), qy = -t * py;
        var sx = this.moveSpeed.x;
        var sy = this.moveSpeed.y;
        for (var i = 0; i < 4; ++i) {
          dstOffset = floatsPerVert * i + uvOffset;
          verts[dstOffset + 2] = sx;
          verts[dstOffset + 3] = sy;
          verts[dstOffset + 4] = px;
          verts[dstOffset + 5] = py;
          verts[dstOffset + 6] = qx;
          verts[dstOffset + 7] = qy;
        }
      };
      return MovingBGAssembler;
    }(GTSimpleSpriteAssembler2D_1.default);
    exports.default = MovingBGAssembler;
    cc._RF.pop();
  }, {
    "../GTSimpleSpriteAssembler2D": "GTSimpleSpriteAssembler2D"
  } ],
  MovingBGSprite: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d6bb3Z+1ARGDapKZIvBpCUs", "MovingBGSprite");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var MovingBGAssembler_1 = require("./MovingBGAssembler");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MovingBGSprite = function(_super) {
      __extends(MovingBGSprite, _super);
      function MovingBGSprite() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._moveSpeed = cc.Vec2.ZERO;
        return _this;
      }
      Object.defineProperty(MovingBGSprite.prototype, "moveSpeed", {
        get: function() {
          return this._moveSpeed;
        },
        set: function(value) {
          this._moveSpeed = value;
          this.FlushProperties();
        },
        enumerable: false,
        configurable: true
      });
      MovingBGSprite.prototype.FlushProperties = function() {
        var assembler = this._assembler;
        if (!assembler) return;
        assembler.moveSpeed = this._moveSpeed;
        this.setVertsDirty();
      };
      MovingBGSprite.prototype.onEnable = function() {
        _super.prototype.onEnable.call(this);
      };
      MovingBGSprite.prototype._resetAssembler = function() {
        this.setVertsDirty();
        var assembler = this._assembler = new MovingBGAssembler_1.default();
        this.FlushProperties();
        assembler.init(this);
        this._updateColor();
      };
      __decorate([ property(cc.Vec2) ], MovingBGSprite.prototype, "moveSpeed", null);
      __decorate([ property(cc.Vec2) ], MovingBGSprite.prototype, "_moveSpeed", void 0);
      MovingBGSprite = __decorate([ ccclass ], MovingBGSprite);
      return MovingBGSprite;
    }(cc.Sprite);
    exports.default = MovingBGSprite;
    cc._RF.pop();
  }, {
    "./MovingBGAssembler": "MovingBGAssembler"
  } ]
}, {}, [ "FlipCardAssembler", "FlipCardSprite", "FlipPageAssembler", "FlipPageSprite", "GTAssembler2D", "GTAutoFitSpriteAssembler2D", "GTSimpleSpriteAssembler2D", "LayeredBatchingAssembler", "LayeredBatchingRootRenderer", "MovingBGAssembler", "MovingBGSprite" ]);