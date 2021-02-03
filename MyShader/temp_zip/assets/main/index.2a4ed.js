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
  ADState: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e86fbdASqFPyrqUJtjRB8FO", "ADState");
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
    var ActionController_1 = require("../../controller/ActionController");
    var LotteryState_1 = require("./LotteryState");
    var ADState = function(_super) {
      __extends(ADState, _super);
      function ADState() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.name = "ADState";
        return _this;
      }
      ADState.prototype.actionOne = function(node) {
        cc.log("this class ", this.name, " action one.");
      };
      ADState.prototype.clickHandler = function(event, node, callFunc, target) {
        target.itemTips.active = false;
        target.itemNode.stopAllActions();
        target.itemNode.angle = 0;
        target.game.showTips("\u770b\u5e7f\u544a\u6210\u529f\uff01");
        ActionController_1.default.rotationNodeByScaleX(node, function() {
          target.itemBg.spriteFrame = target.spriteList[target.IMG_INDEX_ENUM.OPEN_IMG];
          target.itemIcon.spriteFrame = target.spriteList[target.IMG_INDEX_ENUM.ENEGY_IMG];
          target.itemNum.active = true;
          target.itemNum.string = "x30";
          callFunc && callFunc.call(target);
        });
      };
      ADState.prototype.initShow = function(node, callFunc, target) {
        target.itemTips.active = true;
      };
      return ADState;
    }(LotteryState_1.default);
    exports.default = ADState;
    cc._RF.pop();
  }, {
    "../../controller/ActionController": "ActionController",
    "./LotteryState": "LotteryState"
  } ],
  ActionController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6158bgWQ1xDubP6JSBfguFe", "ActionController");
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
    var Controller_1 = require("./Controller");
    var ActionController = function(_super) {
      __extends(ActionController, _super);
      function ActionController() {
        var _this = _super.call(this) || this;
        _this._currentTime = 0;
        return _this;
      }
      ActionController.GetInstance = function() {
        if (this._actionController) return this._actionController;
        this._actionController = new ActionController();
        return this._actionController;
      };
      ActionController.jumpRotateMove = function(node, toPos, callFunc, time, rotate, jumpH, jumpNum) {
        void 0 === time && (time = .6);
        void 0 === rotate && (rotate = 30);
        void 0 === jumpH && (jumpH = 20);
        void 0 === jumpNum && (jumpNum = 1);
        var jumpAction = cc.jumpTo(time, toPos, jumpH, jumpNum);
        var rotateAction = cc.sequence(cc.rotateBy(time / 4, -rotate), cc.rotateBy(time / 2, 2 * rotate), cc.rotateBy(time / 4, -rotate));
        var seqAction = cc.sequence(cc.spawn(jumpAction, rotateAction), cc.callFunc(callFunc));
        seqAction.setTag(this.ACTION_TAG_ENUM.JUMP_ROTATE_MOVE);
        seqAction.setTarget(node);
        node.runAction(seqAction);
        return seqAction;
      };
      ActionController.moveByNumAndRd = function(node, rd, num, callFunc, checkCallFunc) {
        void 0 === rd && (rd = 0);
        void 0 === num && (num = 1);
        for (var i = 0; i < num; i++) if (this.moveTrigger && node.ins.moveTrigger) {
          var jPos = cc.v3(this._unitMoveDis * Math.cos(rd), this._unitMoveDis * Math.sin(rd));
          var tPos = node.position.add(jPos);
          checkCallFunc && (tPos = checkCallFunc(node, tPos));
          node.setPosition(tPos);
        } else callFunc && callFunc(node);
        callFunc && callFunc(node);
      };
      ActionController.moveByTime = function(dt) {};
      ActionController.beHitedBlinkChangeColor = function(node, callFunc, color, time) {
        void 0 === color && (color = new cc.Color(255, 0, 0, 255));
        void 0 === time && (time = .2);
        var preColor = new cc.Color(255, 255, 255);
        var action = cc.tween(node).sequence(cc.tween(node).to(time / 2, {
          color: color
        }), cc.tween(node).to(time / 2, {
          color: preColor
        })).call(callFunc);
        action.tag = this.ACTION_TAG_ENUM.BE_HITED_BLINK;
        action.start();
        return action;
      };
      ActionController.beHurtedHighLight = function(node, callFunc, time) {
        void 0 === time && (time = 8);
        var nodeMtl = node.getComponent(cc.Sprite).getMaterial(0);
        var flag = true;
        var count = 1;
        var changeColor = function(params) {
          flag ? count++ : count--;
          params.setProperty("blendColor", [ count, count, count, 1 ]);
          count >= 10 && (flag = false);
          count <= 1 && clearInterval(id);
        };
        var id = setInterval(changeColor, time, nodeMtl);
      };
      ActionController.changeColorByColor = function(node, callFunc, color, time) {
        void 0 === color && (color = new cc.Color(255, 255, 255, 1));
        void 0 === time && (time = 200);
        var nodeMtl = node.getComponent(cc.Sprite).getMaterial(0);
        nodeMtl.setProperty("blendColor", [ color.r, color.g, color.b, color.a ]);
        nodeMtl.setProperty("blendTrigger", 1);
        var action = cc.tween(node).sequence(cc.tween(node).to(.1, {
          opacity: 100
        }), cc.tween(node).to(.1, {
          opacity: 255
        })).call();
        action.start();
        setTimeout(function(params) {
          params[0].setProperty("blendTrigger", 0);
          params[1].opacity = 255;
        }, time, [ nodeMtl, node ]);
      };
      ActionController.rotationNodeByScaleX = function(node, callFunc, time) {
        void 0 === time && (time = .3);
        var action = cc.tween(node).sequence(cc.tween().to(time / 2, {
          scaleX: -1
        }), cc.tween().to(time / 2, {
          scaleX: 1
        })).call(callFunc);
        action.start();
        return action;
      };
      ActionController.rotationNodeByAngle = function(node, callFunc, time) {
        void 0 === time && (time = .9);
        node.angle = 0;
        var action = cc.tween(node).repeatForever(cc.tween().sequence(cc.tween().to(time / 2, {
          angle: 10
        }), cc.tween().to(time / 2, {
          angle: -10
        })));
        action.start().call(callFunc);
        return action;
      };
      ActionController.ACTION_TAG_ENUM = cc.Enum({
        JUMP_ROTATE_MOVE: 1001,
        BE_HITED_BLINK: 1002
      });
      ActionController._unitMoveDis = 1;
      ActionController.moveTrigger = true;
      ActionController.stopActionByTag = function(node, tag) {
        tag ? node.stopActionByTag(tag) : node.stopAllActions();
      };
      ActionController.moveByRdDisAndSpeed = function(node, rd, dis, time, callFunc) {
        void 0 === rd && (rd = 0);
        void 0 === dis && (dis = 1e3);
        void 0 === time && (time = .3);
        var jPos = cc.v3(dis * Math.cos(rd), dis * Math.sin(rd));
        var tPos = node.position.add(jPos);
        var action = cc.tween(node).to(time, {
          position: tPos
        }).call(callFunc);
        action.start();
      };
      return ActionController;
    }(Controller_1.default);
    exports.default = ActionController;
    cc._RF.pop();
  }, {
    "./Controller": "Controller"
  } ],
  ActivationState: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0f0b4p791NC4q1gt05NkyTH", "ActivationState");
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
    var LotteryState_1 = require("./LotteryState");
    var ActivationState = function(_super) {
      __extends(ActivationState, _super);
      function ActivationState() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.name = "ActivationState";
        return _this;
      }
      ActivationState.prototype.actionOne = function(node) {
        cc.log("this class ", this.name, " action one.");
      };
      ActivationState.prototype.clickHandler = function(event, node, callFunc, target) {
        callFunc && callFunc.call(target, 2);
        return;
      };
      ActivationState.prototype.initShow = function(node, callFunc, target) {};
      return ActivationState;
    }(LotteryState_1.default);
    exports.default = ActivationState;
    cc._RF.pop();
  }, {
    "./LotteryState": "LotteryState"
  } ],
  AlgorithmUtiles: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9ac11icZWhKa6r5dD5Nh6xS", "AlgorithmUtiles");
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
    exports.Block = void 0;
    var Utiles_1 = require("./Utiles");
    var AlgorithmUtiles = function(_super) {
      __extends(AlgorithmUtiles, _super);
      function AlgorithmUtiles() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      AlgorithmUtiles.AStarWayfindingAlgorithm = function(currentPos, targetPos, roadMap, canMove) {
        if (!canMove) {
          cc.log("no canMoveMap.");
          return [];
        }
        var startBlock = new Block({
          currentPos: currentPos,
          targetPos: targetPos
        });
        var openList = new Array();
        var closeList = new Array();
        if (!canMove.has(roadMap.getTileGIDAt(targetPos))) {
          cc.log("targetPos can not move.");
          return [];
        }
        openList.push(startBlock);
        while (openList.length > 0) {
          if (openList.findIndex(function(b) {
            return b.currentPos.equals(targetPos);
          }) >= 0) {
            closeList.push(openList.pop());
            break;
          }
          openList.sort(function(a, b) {
            return a.F - b.F;
          });
          var minFBlock = openList.shift();
          closeList.push(minFBlock);
          var aroundBlockArray = minFBlock.getAroundBlock(minFBlock, canMove, roadMap);
          var _loop_1 = function(elm) {
            if (elm.currentPos.equals(targetPos)) {
              elm.parentBlock = minFBlock;
              openList.push(elm);
              return "break";
            }
            if (closeList.findIndex(function(b) {
              return elm.currentPos.equals(b.currentPos);
            }) >= 0 || !canMove.has(elm.GID)) return "continue";
            var index = openList.findIndex(function(obj) {
              return obj.currentPos.equals(elm.currentPos);
            });
            if (index > 0) {
              var openListBlock = openList[index];
              var tempG = openListBlock.countPosition(elm, openListBlock) + elm.G;
              if (tempG < openListBlock.G) {
                openListBlock.parentBlock = elm;
                openListBlock.G = tempG;
                openListBlock.F = openListBlock.countF(openListBlock.G, openListBlock.H);
                openList.sort(function(a, b) {
                  return a.F - b.F;
                });
              }
            } else openList.push(elm);
          };
          for (var _i = 0, aroundBlockArray_1 = aroundBlockArray; _i < aroundBlockArray_1.length; _i++) {
            var elm = aroundBlockArray_1[_i];
            var state_1 = _loop_1(elm);
            if ("break" === state_1) break;
          }
        }
        var moveBlockArray = new Array();
        if (closeList.findIndex(function(b) {
          return b.currentPos.equals(targetPos);
        }) >= 0 && closeList.findIndex(function(b) {
          return b.currentPos.equals(currentPos);
        }) >= 0) {
          var searchPos_1 = targetPos;
          while (closeList.length > 0) {
            var index = closeList.findIndex(function(b) {
              return b.currentPos.equals(searchPos_1);
            });
            var block = closeList[index];
            closeList.slice(index, 1);
            if (block.currentPos.equals(currentPos)) break;
            moveBlockArray.unshift(block);
            searchPos_1 = block.parentBlock.currentPos;
          }
          return moveBlockArray;
        }
        return [];
      };
      return AlgorithmUtiles;
    }(Utiles_1.default);
    exports.default = AlgorithmUtiles;
    var Block = function() {
      function Block(params) {
        this.GID = params.GID || 0;
        this.moveExpend = params.moveExpend || 10;
        this.H = params.H || 0;
        this.G = params.G || 0;
        this.F = params.F || 0;
        this.targetPos = params.targetPos || cc.v2(0, 0);
        this.currentPos = params.currentPos || cc.v2(0, 0);
        this.type = params.type || "";
      }
      Block.prototype.getAroundBlock = function(block, map, layer) {
        var mapSize = layer.getLayerSize();
        var aroundBlockArray = new Array();
        if (block.currentPos.y + 1 < mapSize.height && block.currentPos.x - 1 >= 0 && map.has(layer.getTileGIDAt(block.currentPos.x - 1, block.currentPos.y + 1))) {
          var nB = new Block({});
          nB.currentPos = cc.v2(block.currentPos.x - 1, block.currentPos.y + 1);
          nB.GID = layer.getTileGIDAt(nB.currentPos);
          nB.moveExpend = map.get(nB.GID).moveExpend;
          nB.G = block.G + 14;
          nB.H = nB.countH(nB.currentPos, block.targetPos, nB.moveExpend);
          nB.F = nB.countF(nB.G, nB.H);
          nB.parentBlock = block;
          nB.targetPos = block.targetPos;
          aroundBlockArray.push(nB);
        }
        if (block.currentPos.y + 1 < mapSize.height && map.has(layer.getTileGIDAt(block.currentPos.x, block.currentPos.y + 1))) {
          var nB = new Block({});
          nB.currentPos = cc.v2(block.currentPos.x, block.currentPos.y + 1);
          nB.GID = layer.getTileGIDAt(nB.currentPos);
          nB.moveExpend = map.get(nB.GID).moveExpend;
          nB.G = block.G + 10;
          nB.H = nB.countH(nB.currentPos, block.targetPos, nB.moveExpend);
          nB.F = nB.countF(nB.G, nB.H);
          nB.parentBlock = block;
          nB.targetPos = block.targetPos;
          aroundBlockArray.push(nB);
        }
        if (block.currentPos.y + 1 < mapSize.height && block.currentPos.x + 1 < mapSize.width && map.has(layer.getTileGIDAt(block.currentPos.x + 1, block.currentPos.y + 1))) {
          var nB = new Block({});
          nB.currentPos = cc.v2(block.currentPos.x + 1, block.currentPos.y + 1);
          nB.GID = layer.getTileGIDAt(nB.currentPos);
          nB.moveExpend = map.get(nB.GID).moveExpend;
          nB.G = block.G + 14;
          nB.H = nB.countH(nB.currentPos, block.targetPos, nB.moveExpend);
          nB.F = nB.countF(nB.G, nB.H);
          nB.parentBlock = block;
          nB.targetPos = block.targetPos;
          aroundBlockArray.push(nB);
        }
        if (block.currentPos.x + 1 < mapSize.width && map.has(layer.getTileGIDAt(block.currentPos.x + 1, block.currentPos.y))) {
          var nB = new Block({});
          nB.currentPos = cc.v2(block.currentPos.x + 1, block.currentPos.y);
          nB.GID = layer.getTileGIDAt(nB.currentPos);
          nB.moveExpend = map.get(nB.GID).moveExpend;
          nB.G = block.G + 10;
          nB.H = nB.countH(nB.currentPos, block.targetPos, nB.moveExpend);
          nB.F = nB.countF(nB.G, nB.H);
          nB.parentBlock = block;
          nB.targetPos = block.targetPos;
          aroundBlockArray.push(nB);
        }
        if (block.currentPos.x + 1 < mapSize.width && block.currentPos.y - 1 >= 0 && map.has(layer.getTileGIDAt(block.currentPos.x + 1, block.currentPos.y - 1))) {
          var nB = new Block({});
          nB.currentPos = cc.v2(block.currentPos.x + 1, block.currentPos.y - 1);
          nB.GID = layer.getTileGIDAt(nB.currentPos);
          nB.moveExpend = map.get(nB.GID).moveExpend;
          nB.G = block.G + 14;
          nB.H = nB.countH(nB.currentPos, block.targetPos, nB.moveExpend);
          nB.F = nB.countF(nB.G, nB.H);
          nB.parentBlock = block;
          nB.targetPos = block.targetPos;
          aroundBlockArray.push(nB);
        }
        if (block.currentPos.y - 1 >= 0 && map.has(layer.getTileGIDAt(block.currentPos.x, block.currentPos.y - 1))) {
          var nB = new Block({});
          nB.currentPos = cc.v2(block.currentPos.x, block.currentPos.y - 1);
          nB.GID = layer.getTileGIDAt(nB.currentPos);
          nB.moveExpend = map.get(nB.GID).moveExpend;
          nB.G = block.G + 10;
          nB.H = nB.countH(nB.currentPos, block.targetPos, nB.moveExpend);
          nB.F = nB.countF(nB.G, nB.H);
          nB.parentBlock = block;
          nB.targetPos = block.targetPos;
          aroundBlockArray.push(nB);
        }
        if (block.currentPos.y - 1 >= 0 && block.currentPos.x - 1 >= 0 && map.has(layer.getTileGIDAt(block.currentPos.x - 1, block.currentPos.y - 1))) {
          var nB = new Block({});
          nB.currentPos = cc.v2(block.currentPos.x - 1, block.currentPos.y - 1);
          nB.GID = layer.getTileGIDAt(nB.currentPos);
          nB.moveExpend = map.get(nB.GID).moveExpend;
          nB.G = block.G + 14;
          nB.H = nB.countH(nB.currentPos, block.targetPos, nB.moveExpend);
          nB.F = nB.countF(nB.G, nB.H);
          nB.parentBlock = block;
          nB.targetPos = block.targetPos;
          aroundBlockArray.push(nB);
        }
        if (block.currentPos.x - 1 >= 0 && map.has(layer.getTileGIDAt(block.currentPos.x - 1, block.currentPos.y))) {
          var nB = new Block({});
          nB.currentPos = cc.v2(block.currentPos.x - 1, block.currentPos.y);
          nB.GID = layer.getTileGIDAt(nB.currentPos);
          nB.moveExpend = map.get(nB.GID).moveExpend;
          nB.G = block.G + 10;
          nB.H = nB.countH(nB.currentPos, block.targetPos, nB.moveExpend);
          nB.F = nB.countF(nB.G, nB.H);
          nB.parentBlock = block;
          nB.targetPos = block.targetPos;
          aroundBlockArray.push(nB);
        }
        return aroundBlockArray;
      };
      Block.prototype.countH = function(cPos, tPos, mvEd) {
        return (Math.abs(tPos.x - cPos.x) + Math.abs(tPos.y - cPos.y)) * mvEd;
      };
      Block.prototype.countF = function(g, h) {
        return h + g;
      };
      Block.prototype.countPosition = function(parentBlock, childBlock) {
        if (parentBlock.currentPos.x == childBlock.currentPos.x || parentBlock.currentPos.y == childBlock.currentPos.y) return 10;
        return 14;
      };
      return Block;
    }();
    exports.Block = Block;
    cc._RF.pop();
  }, {
    "./Utiles": "Utiles"
  } ],
  AnimationController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "081d9UTs59LwIY480IbuFU6", "AnimationController");
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
    var Controller_1 = require("./Controller");
    var AnimationController = function(_super) {
      __extends(AnimationController, _super);
      function AnimationController() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      AnimationController.prototype.init = function() {};
      return AnimationController;
    }(Controller_1.default);
    exports.default = AnimationController;
    cc._RF.pop();
  }, {
    "./Controller": "Controller"
  } ],
  AssetManagerC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "604732Z895NmIlBbuSOGX5i", "AssetManagerC");
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
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var SceneC_1 = require("../SceneC");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var AssetManager = function(_super) {
      __extends(AssetManager, _super);
      function AssetManager() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.sprite = null;
        _this._url = "textures/tiled/hello";
        return _this;
      }
      AssetManager.prototype.GetAsync = function(url) {
        return __awaiter(this, void 0, void 0, function() {
          var promise;
          return __generator(this, function(_a) {
            promise = new Promise(function(resolve) {
              cc.resources.load(url, cc.SpriteFrame, function(error, asset) {
                if (error) {
                  cc.log(error);
                  return;
                }
                resolve(asset);
              });
            });
            return [ 2, promise ];
          });
        });
      };
      AssetManager.prototype.start = function() {
        return __awaiter(this, void 0, void 0, function() {
          var result;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              return [ 4, this.deploySp() ];

             case 1:
              result = _a.sent();
              cc.log(result);
              cc.log("behide");
              return [ 2 ];
            }
          });
        });
      };
      AssetManager.prototype.change = function() {
        return this.deploySp();
      };
      AssetManager.prototype.deploySp = function() {
        return __awaiter(this, void 0, void 0, function() {
          var res, promise;
          var _this = this;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              return [ 4, this.GetAsync(this._url) ];

             case 1:
              res = _a.sent();
              this.sprite.spriteFrame = res;
              promise = new Promise(function(resolve) {
                _this.scheduleOnce(function() {
                  resolve("hello");
                }, 3);
              });
              return [ 2, promise ];
            }
          });
        });
      };
      __decorate([ property(cc.Sprite) ], AssetManager.prototype, "sprite", void 0);
      AssetManager = __decorate([ ccclass ], AssetManager);
      return AssetManager;
    }(SceneC_1.default);
    exports.default = AssetManager;
    cc._RF.pop();
  }, {
    "../SceneC": "SceneC"
  } ],
  AttackController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d5c2a9lcZ5I6bGWs7f66Sck", "AttackController");
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
    var Controller_1 = require("./Controller");
    var BulletController_1 = require("./BulletController");
    var NodeController_1 = require("./NodeController");
    var RoleController_1 = require("./RoleController");
    var AttackController = function(_super) {
      __extends(AttackController, _super);
      function AttackController() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      AttackController.AttackHandler = function(node, callFunc) {
        var obj = node.ins.obj;
        var atkType = obj.getAtkType();
        switch (atkType) {
         case this.ATTACK_TYPE_ENUM.NORMAL_REMOTE:
          return this.normalRemoteAttack(node, callFunc);
        }
      };
      AttackController.normalRemoteAttack = function(node, callFunc) {
        var obj = node.ins.obj;
        return this.createBulletHandler(node, obj);
      };
      AttackController.createBulletHandler = function(node, obj) {
        var atkType = obj.getAtkType();
        switch (atkType) {
         case this.ATTACK_TYPE_ENUM.NORMAL_REMOTE:
          return this.createRemoteBullet(node, obj);
        }
      };
      AttackController.createRemoteBullet = function(node, obj) {
        var directionBullet = 0;
        var array = this.createDirectionBulletHandler(node, obj);
        return new BulletController_1.default(array);
      };
      AttackController.createDirectionBulletHandler = function(node, obj) {
        var atkDirectionType = obj.getAtkDirectionType();
        switch (atkDirectionType) {
         case this.ATTACK_DIRECTION_TYPE.NORMAL:
          return this.createNormalDirectionBullet(node, obj);
        }
      };
      AttackController.createNormalDirectionBullet = function(node, obj) {
        var bulletNum = obj.getBulletNum();
        var unitBulletNum = obj.getUnitBulletNum();
        var array = new Array();
        var rd = 0;
        var moveRd = rd;
        if (1 & bulletNum) for (var i = 0; i < bulletNum; i++) {
          var unitBulletSpacing = 0;
          var cRd = void 0;
          if (0 == i) cRd = rd; else if (1 & i) {
            rd = Math.abs(rd) + this._unitDeviationRd;
            moveRd = Math.abs(moveRd) + this._unitDeviationMoveRd;
            cRd = rd;
          } else {
            cRd = -rd;
            moveRd = -moveRd;
          }
          for (var j = 0; j < unitBulletNum; j++) {
            var bNode = NodeController_1.default.CreateNode(NodeController_1.default.NODE_ENUM.BULLET);
            var bulletObj = RoleController_1.default.getBulletByRole(obj);
            bNode.addComponent(bulletObj.component);
            node.parent.addChild(bNode);
            var cRd_1 = rd;
            bulletObj.moveRd = moveRd;
            var correctPos = cc.v3(unitBulletSpacing * Math.cos(moveRd), unitBulletSpacing * Math.sin(moveRd));
            var jPos = cc.v3(node.width / 2 * Math.cos(cRd_1), node.width / 2 * Math.sin(cRd_1)).add(correctPos);
            bNode.setPosition(node.position.add(jPos));
            bNode.ins.obj = bulletObj;
            array.push(bNode);
            unitBulletSpacing += bNode.width;
          }
        } else {
          moveRd = rd + this._moveRd / 2;
          for (var i = 0; i < bulletNum; i++) {
            var unitBulletSpacing = 0;
            var cRd = void 0;
            if (1 & i) {
              moveRd = -moveRd;
              cRd = -rd;
            } else {
              if (0 !== i) {
                rd = Math.abs(rd) + this._unitDeviationRd;
                moveRd = Math.abs(moveRd) + this._unitDeviationMoveRd;
              }
              cRd = rd;
            }
            for (var j = 0; j < unitBulletNum; j++) {
              var bNode = NodeController_1.default.CreateNode(NodeController_1.default.NODE_ENUM.BULLET);
              var bulletObj = RoleController_1.default.getBulletByRole(obj);
              bNode.addComponent(bulletObj.component);
              node.parent.addChild(bNode);
              bulletObj.moveRd = moveRd;
              var correctPos = cc.v3(unitBulletSpacing * Math.cos(moveRd), unitBulletSpacing * Math.sin(moveRd));
              var jPos = cc.v3(node.width / 2 * Math.cos(cRd), node.width / 2 * Math.sin(cRd)).add(correctPos);
              bNode.setPosition(node.position.add(jPos));
              bNode.ins.obj = bulletObj;
              array.push(bNode);
              unitBulletSpacing += bNode.width;
            }
          }
        }
        return array;
      };
      AttackController.ATTACK_TYPE_ENUM = cc.Enum({
        STORAGE_REMOTE: "storage_remote_atk",
        STORAGE_MELEE: "storage_melee_atk",
        NORMAL_MELEE: "normal_melee_atk",
        NORMAL_REMOTE: "normal_remote_atk"
      });
      AttackController.ATTACK_DIRECTION_TYPE = cc.Enum({
        NORMAL: "normal"
      });
      AttackController._moveRd = Math.PI / 36;
      AttackController._unitDeviationRd = 0;
      AttackController._unitDeviationMoveRd = Math.PI / 36;
      return AttackController;
    }(Controller_1.default);
    exports.default = AttackController;
    cc._RF.pop();
  }, {
    "./BulletController": "BulletController",
    "./Controller": "Controller",
    "./NodeController": "NodeController",
    "./RoleController": "RoleController"
  } ],
  BattleController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c1b94LmIQJD+pLmXqAWdRg5", "BattleController");
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
    var Controller_1 = require("./Controller");
    var BattleController = function(_super) {
      __extends(BattleController, _super);
      function BattleController() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.createBullet = function(obj) {
          return;
        };
        return _this;
      }
      return BattleController;
    }(Controller_1.default);
    exports.default = BattleController;
    cc._RF.pop();
  }, {
    "./Controller": "Controller"
  } ],
  BattleC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7ce69EQ/CpAN7YJZl0dG5YJ", "BattleC");
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
    var SceneC_1 = require("../SceneC");
    var GameController_1 = require("../../controller/GameController");
    var NodeController_1 = require("../../controller/NodeController");
    var RoleController_1 = require("../../controller/RoleController");
    var CollisionController_1 = require("../../controller/CollisionController");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BattleC = function(_super) {
      __extends(BattleC, _super);
      function BattleC() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.game = null;
        _this.mainCamera = null;
        _this.UICamera = null;
        _this.map = null;
        _this._onLoad = function() {
          _this._init();
        };
        _this.start = function() {
          cc.log(GameController_1.default.GameDataMap);
        };
        _this.update = function(dt) {
          _this.methodArrayHandler(_this.updateMethodArray, dt);
        };
        _this._initGame = function() {
          _this.initBattle();
          _this.initPlayer(function(node) {
            _this.initMethodArray();
            _this.collisionTrigger();
            _this.initEnemy();
          });
        };
        _this.initRole = function() {};
        _this.initPlayer = function(callFunc) {
          try {
            var role = RoleController_1.default.GetHeroById("hero_01");
            if (!role) return;
            var node = NodeController_1.default.CreateNode(NodeController_1.default.NODE_ENUM.ROLE);
            _this.node.addChild(node);
            node.addComponent(role.component);
            node.ins.obj = role;
            node.setPosition(0, 0);
            callFunc && callFunc(node);
          } catch (error) {
            cc.log(error);
          }
        };
        _this.initEnemy = function(callFunc) {
          try {
            var role = RoleController_1.default.GetHeroById("little_bee");
            if (!role) return;
            var node = NodeController_1.default.CreateNode(NodeController_1.default.NODE_ENUM.ROLE);
            _this.node.addChild(node);
            node.addComponent(role.component);
            node.ins.obj = role;
            node.setPosition(500, 0);
            callFunc && callFunc(node);
          } catch (error) {
            cc.log(error);
          }
        };
        _this.initBattle = function() {
          _this.listenTrigger(true);
        };
        _this.collisionTrigger = function() {
          CollisionController_1.default.CollisionTrigger(true, true);
        };
        _this.initMethodArray = function() {
          _this.initOperationMethodMap();
          _this.initUpdateMethodArray();
        };
        _this._initUpdateMethodArray = function() {
          _this.addMethod(_this.moveHandler);
          _this.addMethod(_this.operationHandler);
        };
        _this._initOperationMethodMap = function() {
          _this.addOperationMethod(_this.KEY_OPERATION_ENUM.ATK, _this.attackOperation);
        };
        _this.clickMap = function(touchPos) {
          var cvPos = _this.map.convertToNodeSpaceAR(touchPos);
          var cameraPos = cc.v2(_this.mainCamera.position);
          var judgePos = cvPos.add(cameraPos);
          var clickAxisPos = _this.map.ins.getAxisPosByPixelPos(judgePos);
          var mvTPos = _this.map.ins.getPixelPosByAxisPos(clickAxisPos);
          var heroNode = NodeController_1.default.getNodeByType(NodeController_1.default.TYPE_ENUM.HERO)[0];
          heroNode.ins._isMoving ? heroNode.ins.roleStopMoving() : _this.moveHandler_bak(null, heroNode, judgePos, function() {});
        };
        _this.operationHandler = function(_a) {
          var dt = _a[0];
          if (_this.keyPressArray.length > 0) for (var _i = 0, _b = _this.keyPressArray; _i < _b.length; _i++) {
            var keycodEvent = _b[_i];
            if (_this.keycodMap.has(keycodEvent.keyCode)) {
              var operation = _this.keycodMap.get(keycodEvent.keyCode);
              var func = _this.getOperationMehotdByKey(operation);
              -1 !== func && func(keycodEvent);
            }
          }
        };
        _this.attackOperation = function(evet) {
          var heroNode = NodeController_1.default.getNodeByType(NodeController_1.default.TYPE_ENUM.HERO)[0];
          heroNode.ins.attackHandler();
        };
        _this.moveHandler = function(_a) {
          var dt = _a[0];
          if (_this.moveKeyPressArray.length > 0) {
            var oneKey = _this.moveKeycodMap.get(_this.moveKeyPressArray[0].keyCode);
            var twoKey = "";
            _this.moveKeyPressArray.length > 1 && (twoKey = _this.moveKeycodMap.get(_this.moveKeyPressArray[1].keyCode));
            var ag = _this.keycodeAngleMap[oneKey + twoKey] || _this.keycodeAngleMap[twoKey];
            var heroNode = NodeController_1.default.getNodeByType(NodeController_1.default.TYPE_ENUM.HERO)[0];
            heroNode.ins.roleMoveByNumAndRd(heroNode, ag, heroNode.ins.obj.getSpeed(), function() {}, heroNode.ins.checkMove);
          }
        };
        _this.moveHandler_bak = function(type, node, toPos, callFunc) {
          var moveTiled = node.ins.obj.moveTiled;
          var moveMap = new Map();
          for (var _i = 0, moveTiled_1 = moveTiled; _i < moveTiled_1.length; _i++) {
            var id = moveTiled_1[_i];
            var tiledInfo = GameController_1.default.GameDataMap.get(id);
            moveMap.set(tiledInfo.id, tiledInfo);
          }
          var moveArray = _this.map.ins.getMovePosArrayByPixelPos(node.position, toPos, moveMap);
          if (moveArray.length > 0) {
            cc.log(moveArray);
            node.ins.roleMoveByBlockArray(node, moveArray, callFunc);
          } else cc.log("can not move.");
        };
        _this.touchHandler = function(type, eOne, eTwo) {
          switch (type) {
           case _this.OPER_ENUM.CLICK:
            _this.singleClick(eOne);
            break;

           case _this.OPER_ENUM.DEFAULT:
            _this.defaultClick(eOne);
            break;

           case _this.OPER_ENUM.MOVE:
            _this.moveClick(eOne);
            break;

           case _this.OPER_ENUM.SCALE:
            _this.doubleMoveClick(eOne, eTwo);
          }
        };
        _this.singleClick = function(event) {
          var clickPos = event.getStartLocation();
          _this.clickMap(clickPos);
        };
        _this.defaultClick = function(event) {};
        _this.moveClick = function(event) {
          var curTouchPos = event.getLocation();
          var preTouchPos = event.getPreviousLocation();
          var vec = curTouchPos.sub(preTouchPos);
          _this.mainCamera.ins.cameraMove(vec);
        };
        _this.doubleMoveClick = function(eOne, eTwo) {};
        _this._onTouchStartCallFunc = function(event) {
          if (_this.touchPointArray.length < _this.touchPointMax) {
            _this.operation == _this.OPER_ENUM.DEFAULT && (_this.operation = _this.OPER_ENUM.CLICK);
            _this.touchPointArray.push(event.getStartLocation());
          }
        };
        _this._onTouchMoveCallFunc = function(event) {
          _this.touchPointArray.find(function(elm, index) {
            if (event.getStartLocation().equals(elm)) {
              var curTouchPos = event.getLocation();
              var vector = curTouchPos.sub(event.getStartLocation());
              var dis = vector.mag();
              dis > _this.misOperDis && _this.operation & _this.OPER_ENUM.CLICK && (_this.operation = _this.OPER_ENUM.MOVE);
              _this.touchHandler(_this.OPER_ENUM.MOVE, event);
            }
          });
        };
        _this._onTouchCancelCallFunc = function(event) {
          _this.touchPointArray.find(function(elm, index) {
            if (event.getStartLocation().equals(elm)) {
              if (_this.operation & _this.OPER_ENUM.CLICK) {
                cc.log("click here.");
                _this.touchHandler(_this.OPER_ENUM.CLICK, event);
              }
              _this.touchPointArray.splice(index, 1);
              _this.resetProperty();
            }
          });
        };
        _this._onTouchEndCallFunc = function(event) {
          _this.touchPointArray.find(function(elm, index) {
            if (event.getStartLocation().equals(elm)) {
              if (_this.operation & _this.OPER_ENUM.CLICK) {
                cc.log("click here.");
                _this.touchHandler(_this.OPER_ENUM.CLICK, event);
              }
              _this.touchPointArray.splice(index, 1);
              _this.resetProperty();
            }
          });
        };
        _this._listenTrigger = function(flag, callFunc) {
          if (flag) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, _this.onKeyDownCallFunc);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, _this.onKeyUpCallFunc);
          } else {
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN);
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP);
          }
        };
        _this._onKeyDownCallFunc = function(event) {
          _this.keyboardDownHandler(event);
        };
        _this._onKeyUpCallFunc = function(event) {
          var index = _this.keyPressArray.findIndex(function(b) {
            return b.keyCode == event.keyCode;
          });
          index > -1 && _this.keyPressArray.splice(index, 1);
          var indexT = _this.moveKeyPressArray.findIndex(function(b) {
            return b.keyCode == event.keyCode;
          });
          indexT > -1 && _this.moveKeyPressArray.splice(indexT, 1);
          _this.keyboardUpHandler(event);
        };
        _this.keyboardDownHandler = function(event) {
          var key = event.keyCode;
          if (_this.keycodMap.has(key)) {
            var index = _this.keyPressArray.findIndex(function(b) {
              return b.keyCode == event.keyCode;
            });
            -1 === index && _this.keyPressArray.push(event);
          }
          if (_this.moveKeycodMap.has(key)) {
            var index = _this.moveKeyPressArray.findIndex(function(b) {
              return b.keyCode == event.keyCode;
            });
            -1 === index && _this.moveKeyPressArray.push(event);
          }
        };
        _this.keyboardUpHandler = function(event) {
          var key = event.keyCode;
        };
        _this.test = function() {
          cc.log("i am test func.");
        };
        return _this;
      }
      BattleC.prototype._init = function() {
        var _this = this;
        var sceneName = cc.director.getScene().name;
        var sceneInfos = GameController_1.default.GameDataMap.get("scenes");
        var sceneInfo = null;
        for (var k in sceneInfos) {
          var v = sceneInfos[k];
          if (v.name == sceneName && "default" != k) {
            sceneInfo = v;
            break;
          }
        }
        this.preloadAssets(sceneInfo, function() {
          cc.log("\u8d44\u6e90\u52a0\u8f7d\u5b8c\u6bd5\u3002");
          NodeController_1.default.InitPool();
          _this._initGame();
        });
      };
      __decorate([ property({
        displayName: "\u6e38\u620f\u4e3b\u8282\u70b9",
        type: cc.Node
      }) ], BattleC.prototype, "game", void 0);
      __decorate([ property({
        displayName: "\u4e3b\u76f8\u673a",
        type: cc.Node
      }) ], BattleC.prototype, "mainCamera", void 0);
      __decorate([ property({
        displayName: "UI\u76f8\u673a",
        type: cc.Node
      }) ], BattleC.prototype, "UICamera", void 0);
      __decorate([ property({
        displayName: "\u5730\u56fe",
        type: cc.Node
      }) ], BattleC.prototype, "map", void 0);
      BattleC = __decorate([ ccclass ], BattleC);
      return BattleC;
    }(SceneC_1.default);
    exports.default = BattleC;
    cc._RF.pop();
  }, {
    "../../controller/CollisionController": "CollisionController",
    "../../controller/GameController": "GameController",
    "../../controller/NodeController": "NodeController",
    "../../controller/RoleController": "RoleController",
    "../SceneC": "SceneC"
  } ],
  BhvButtonGroup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "41df676L55LvJ52uxkQpfxJ", "BhvButtonGroup");
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
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
    var PARAM_TYPE;
    (function(PARAM_TYPE) {
      PARAM_TYPE[PARAM_TYPE["CHILDREN_INDEX"] = 0] = "CHILDREN_INDEX";
      PARAM_TYPE[PARAM_TYPE["CHILDREN_NAME"] = 1] = "CHILDREN_NAME";
    })(PARAM_TYPE || (PARAM_TYPE = {}));
    var BhvButtonGroup = function(_super) {
      __extends(BhvButtonGroup, _super);
      function BhvButtonGroup() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.transition = cc.Button.Transition.NONE;
        _this.hoverColor = cc.color(255, 255, 255);
        _this.normalColor = cc.color(214, 214, 214);
        _this.pressedColor = cc.color(211, 211, 211);
        _this.disabledColor = cc.color(124, 124, 124);
        _this.normalSprite = null;
        _this.pressedSprite = null;
        _this.hoverSprite = null;
        _this.disabledSprite = null;
        _this.duration = 1;
        _this.zoomScale = 1.1;
        _this.paramType = PARAM_TYPE.CHILDREN_INDEX;
        _this.touchEvents = [];
        return _this;
      }
      BhvButtonGroup.prototype.onLoad = function() {
        var _this = this;
        this.node.children.forEach(function(node, nodeIndex) {
          var comp = node.getComponent(cc.Button);
          comp || (comp = node.addComponent(cc.Button));
          comp.target = node;
          comp.transition = _this.transition;
          comp.zoomScale = _this.zoomScale;
          comp.disabledSprite = _this.disabledSprite;
          comp.hoverSprite = _this.hoverSprite;
          comp.normalSprite = _this.normalSprite;
          comp.pressedSprite = _this.pressedSprite;
          comp.hoverColor = _this.hoverColor;
          comp.normalColor = _this.normalColor;
          comp.pressedColor = _this.pressedColor;
          comp.disabledColor = _this.disabledColor;
          _this.touchEvents.forEach(function(event) {
            var hd = new cc.Component.EventHandler();
            hd.target = event.target;
            hd.handler = event.handler;
            hd.component = event.component;
            hd["_componentId"] = event["_componentId"];
            _this.paramType === PARAM_TYPE.CHILDREN_INDEX ? hd.customEventData = nodeIndex.toString() : hd.customEventData = node.name;
            comp.clickEvents.push(hd);
          });
        });
      };
      __decorate([ property({
        type: cc.Enum(cc.Button.Transition)
      }) ], BhvButtonGroup.prototype, "transition", void 0);
      __decorate([ property({
        visible: function() {
          return this.transition === cc.Button.Transition.COLOR;
        }
      }) ], BhvButtonGroup.prototype, "hoverColor", void 0);
      __decorate([ property({
        visible: function() {
          return this.transition === cc.Button.Transition.COLOR;
        }
      }) ], BhvButtonGroup.prototype, "normalColor", void 0);
      __decorate([ property({
        visible: function() {
          return this.transition === cc.Button.Transition.COLOR;
        }
      }) ], BhvButtonGroup.prototype, "pressedColor", void 0);
      __decorate([ property({
        visible: function() {
          return this.transition === cc.Button.Transition.COLOR;
        }
      }) ], BhvButtonGroup.prototype, "disabledColor", void 0);
      __decorate([ property({
        type: cc.SpriteFrame,
        visible: function() {
          return this.transition === cc.Button.Transition.SPRITE;
        }
      }) ], BhvButtonGroup.prototype, "normalSprite", void 0);
      __decorate([ property({
        type: cc.SpriteFrame,
        visible: function() {
          return this.transition === cc.Button.Transition.SPRITE;
        }
      }) ], BhvButtonGroup.prototype, "pressedSprite", void 0);
      __decorate([ property({
        type: cc.SpriteFrame,
        visible: function() {
          return this.transition === cc.Button.Transition.SPRITE;
        }
      }) ], BhvButtonGroup.prototype, "hoverSprite", void 0);
      __decorate([ property({
        type: cc.SpriteFrame,
        visible: function() {
          return this.transition === cc.Button.Transition.SPRITE;
        }
      }) ], BhvButtonGroup.prototype, "disabledSprite", void 0);
      __decorate([ property({
        visible: function() {
          return this.transition === cc.Button.Transition.SCALE || this.transition === cc.Button.Transition.COLOR;
        }
      }) ], BhvButtonGroup.prototype, "duration", void 0);
      __decorate([ property({
        visible: function() {
          return this.transition === cc.Button.Transition.SCALE;
        }
      }) ], BhvButtonGroup.prototype, "zoomScale", void 0);
      __decorate([ property({
        type: cc.Enum(PARAM_TYPE)
      }) ], BhvButtonGroup.prototype, "paramType", void 0);
      __decorate([ property([ cc.Component.EventHandler ]) ], BhvButtonGroup.prototype, "touchEvents", void 0);
      BhvButtonGroup = __decorate([ ccclass, menu("\u6dfb\u52a0\u7279\u6b8a\u884c\u4e3a/Input/Button Group(\u4e00\u7ec4\u6309\u94ae\u63a7\u5236)") ], BhvButtonGroup);
      return BhvButtonGroup;
    }(cc.Component);
    exports.default = BhvButtonGroup;
    cc._RF.pop();
  }, {} ],
  BhvFrameIndex: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c238ewfJ2VJnZ8Gb8YQs5Ts", "BhvFrameIndex");
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
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode, requireComponent = _a.requireComponent, menu = _a.menu;
    var BhvFrameIndex = function(_super) {
      __extends(BhvFrameIndex, _super);
      function BhvFrameIndex() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.spriteFrames = [ null ];
        _this._index = 0;
        return _this;
      }
      Object.defineProperty(BhvFrameIndex.prototype, "index", {
        get: function() {
          return this._index;
        },
        set: function(value) {
          if (value < 0) return;
          this._index = value % this.spriteFrames.length;
          var sprite = this.node.getComponent(cc.Sprite);
          sprite.spriteFrame = this.spriteFrames[this._index];
        },
        enumerable: false,
        configurable: true
      });
      BhvFrameIndex.prototype.setName = function(name) {
        var index = this.spriteFrames.findIndex(function(v) {
          return v.name == name;
        });
        index < 0 && cc.error("frameIndex \u8bbe\u7f6e\u4e86\u4e0d\u5b58\u5728\u7684name:", name);
        this.index = index || 0;
      };
      BhvFrameIndex.prototype.random = function(min, max) {
        if (!this.spriteFrames) return;
        var frameMax = this.spriteFrames.length;
        (null == min || min < 0) && (min = 0);
        (null == max || max > frameMax) && (max = frameMax);
        this.index = Math.floor(Math.random() * (max - min) + min);
      };
      BhvFrameIndex.prototype.next = function() {
        this.index++;
      };
      BhvFrameIndex.prototype.previous = function() {
        this.index--;
      };
      __decorate([ property({
        type: [ cc.SpriteFrame ],
        tooltip: "sprite\u5c06\u4f1a\u7528\u5230\u5e27\u56fe\u7247"
      }) ], BhvFrameIndex.prototype, "spriteFrames", void 0);
      __decorate([ property({
        tooltip: "\u5f53\u524d\u663e\u793a\u7684\u5e27\u56fe",
        type: cc.Integer
      }) ], BhvFrameIndex.prototype, "index", null);
      __decorate([ property ], BhvFrameIndex.prototype, "_index", void 0);
      BhvFrameIndex = __decorate([ ccclass, executeInEditMode, requireComponent(cc.Sprite), menu("\u6dfb\u52a0\u7279\u6b8a\u884c\u4e3a/UI/Frame Index(\u5e27\u56fe\u6539\u53d8)") ], BhvFrameIndex);
      return BhvFrameIndex;
    }(cc.Component);
    exports.default = BhvFrameIndex;
    cc._RF.pop();
  }, {} ],
  BhvRollNumber: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "72d13dwmG9LS4gkJhSuAp3F", "BhvRollNumber");
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
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
    var VALUE_TYPE;
    (function(VALUE_TYPE) {
      VALUE_TYPE[VALUE_TYPE["INTEGER"] = 0] = "INTEGER";
      VALUE_TYPE[VALUE_TYPE["FIXED_2"] = 1] = "FIXED_2";
      VALUE_TYPE[VALUE_TYPE["TIMER"] = 2] = "TIMER";
      VALUE_TYPE[VALUE_TYPE["PERCENTAGE"] = 3] = "PERCENTAGE";
      VALUE_TYPE[VALUE_TYPE["KMBT_FIXED2"] = 4] = "KMBT_FIXED2";
      VALUE_TYPE[VALUE_TYPE["CUSTOMER"] = 5] = "CUSTOMER";
    })(VALUE_TYPE || (VALUE_TYPE = {}));
    var BhvRollNumber = function(_super) {
      __extends(BhvRollNumber, _super);
      function BhvRollNumber() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.value = 0;
        _this.showPlusSymbol = false;
        _this._targetValue = 100;
        _this.lerp = .1;
        _this.playAtStart = true;
        _this.runWaitTimer = 0;
        _this.valueType = VALUE_TYPE.INTEGER;
        _this._custom_callback = null;
        _this.isScrolling = false;
        _this._lastLabelText = "";
        return _this;
      }
      Object.defineProperty(BhvRollNumber.prototype, "targetValue", {
        get: function() {
          return this._targetValue;
        },
        set: function(v) {
          this._targetValue = v;
          this.scroll();
        },
        enumerable: false,
        configurable: true
      });
      BhvRollNumber.prototype.onLoad = function() {
        void 0 == this.label && (this.label = this.node.getComponent(cc.Label));
        if (this.playAtStart) {
          this.updateLabel();
          this.scroll();
        }
      };
      BhvRollNumber.prototype.scroll = function() {
        var _this = this;
        if (this.isScrolling) return;
        this.runWaitTimer > 0 ? this.scheduleOnce(function() {
          _this.isScrolling = true;
        }, this.runWaitTimer) : this.isScrolling = true;
      };
      BhvRollNumber.prototype.stop = function() {
        this.value = this.targetValue;
        this.isScrolling = false;
        this.updateLabel();
      };
      BhvRollNumber.prototype.init = function(value, target, lerp) {
        this.targetValue = target || 0;
        this.value = value || 0;
        this.lerp = lerp || .1;
      };
      BhvRollNumber.prototype.scrollTo = function(target) {
        if (null === target || void 0 === target) return;
        this.targetValue = target;
      };
      BhvRollNumber.prototype.updateLabel = function() {
        var value = this.value;
        var string = "";
        switch (this.valueType) {
         case VALUE_TYPE.INTEGER:
          string = Math.round(value) + "";
          break;

         case VALUE_TYPE.FIXED_2:
          string = value.toFixed(2);
          break;

         case VALUE_TYPE.TIMER:
          string = parseTimer(value);
          break;

         case VALUE_TYPE.PERCENTAGE:
          string = Math.round(100 * value) + "%";
          break;

         case VALUE_TYPE.KMBT_FIXED2:
          string = value >= Number.MAX_VALUE ? "MAX" : value > 1e12 ? (value / 1e12).toFixed(2) + "T" : value > 1e9 ? (value / 1e9).toFixed(2) + "B" : value > 1e6 ? (value / 1e6).toFixed(2) + "M" : value > 1e3 ? (value / 1e3).toFixed(2) + "K" : Math.round(value).toString();
          break;

         case VALUE_TYPE.CUSTOMER:
          this._custom_callback && (string = this._custom_callback(this.value, this.targetValue));
        }
        this.showPlusSymbol && (value > 0 ? string = "+" + string : value < 0 && (string = "-" + string));
        if (this.label) {
          if (string === this.label.string) return;
          this.label.string = string;
        }
      };
      BhvRollNumber.prototype.update = function(dt) {
        if (false == this.isScrolling) return;
        this.value = cc.misc.lerp(this.value, this.targetValue, this.lerp);
        this.updateLabel();
        if (Math.abs(this.value - this.targetValue) <= 1e-4) {
          this.value = this.targetValue;
          this.isScrolling = false;
          return;
        }
      };
      __decorate([ property({
        type: cc.Label,
        tooltip: "\u9700\u8981\u6eda\u52a8\u7684 Label \u7ec4\u4ef6,\u5982\u679c\u4e0d\u8fdb\u884c\u8bbe\u7f6e\uff0c\u5c31\u4f1a\u4ece\u81ea\u5df1\u7684\u8282\u70b9\u81ea\u52a8\u67e5\u627e"
      }) ], BhvRollNumber.prototype, "label", void 0);
      __decorate([ property({
        tooltip: "\u5f53\u524d\u7684\u6eda\u52a8\u503c(\u5f00\u59cb\u7684\u6eda\u52a8\u503c)"
      }) ], BhvRollNumber.prototype, "value", void 0);
      __decorate([ property({
        tooltip: "\u662f\u5426\u663e\u793a\u6b63\u8d1f\u7b26\u53f7"
      }) ], BhvRollNumber.prototype, "showPlusSymbol", void 0);
      __decorate([ property({
        tooltip: "\u6eda\u52a8\u7684\u76ee\u6807\u503c"
      }) ], BhvRollNumber.prototype, "targetValue", null);
      __decorate([ property ], BhvRollNumber.prototype, "_targetValue", void 0);
      __decorate([ property({
        tooltip: "\u6eda\u52a8\u7684\u7ebf\u6027\u5dee\u503c",
        step: .01,
        max: 1,
        min: 0
      }) ], BhvRollNumber.prototype, "lerp", void 0);
      __decorate([ property({
        tooltip: "\u662f\u5426\u5728\u5f00\u59cb\u65f6\u5c31\u64ad\u653e"
      }) ], BhvRollNumber.prototype, "playAtStart", void 0);
      __decorate([ property({
        tooltip: "\u5728\u6eda\u52a8\u4e4b\u524d\u4f1a\u7b49\u5f85\u51e0\u79d2",
        step: .1,
        max: 1,
        min: 0
      }) ], BhvRollNumber.prototype, "runWaitTimer", void 0);
      __decorate([ property({
        type: cc.Enum(VALUE_TYPE),
        tooltip: "\u662f\u5426\u5728\u5f00\u59cb\u65f6\u5c31\u64ad\u653e"
      }) ], BhvRollNumber.prototype, "valueType", void 0);
      BhvRollNumber = __decorate([ ccclass, menu("\u6dfb\u52a0\u7279\u6b8a\u884c\u4e3a/UI/Roll Number (\u6eda\u52a8\u6570\u5b57)") ], BhvRollNumber);
      return BhvRollNumber;
    }(cc.Component);
    exports.default = BhvRollNumber;
    function parseTimer(timer, isFullTimer) {
      void 0 === timer && (timer = 0);
      void 0 === isFullTimer && (isFullTimer = true);
      var t = Math.floor(timer);
      var hours = Math.floor(t / 3600);
      var mins = Math.floor(t % 3600 / 60);
      var secs = t % 60;
      var m = "" + mins;
      var s = "" + secs;
      secs < 10 && (s = "0" + secs);
      if (isFullTimer) {
        mins < 10 && (m = "0" + mins);
        return hours + ":" + m + ":" + s;
      }
      m = "" + (mins + 60 * hours);
      mins < 10 && (m = "0" + mins);
      return m + ":" + s;
    }
    cc._RF.pop();
  }, {} ],
  BhvSwitchPage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b3d083kncpDPqVztMtiq6DO", "BhvSwitchPage");
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
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode, menu = _a.menu;
    var BhvSwitchPage = function(_super) {
      __extends(BhvSwitchPage, _super);
      function BhvSwitchPage() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isLoopPage = false;
        _this._index = 0;
        _this.preIndex = 0;
        _this._isChanging = false;
        return _this;
      }
      Object.defineProperty(BhvSwitchPage.prototype, "index", {
        get: function() {
          return this._index;
        },
        set: function(v) {
          if (this.isChanging) return;
          v = Math.round(v);
          var count = this.node.childrenCount - 1;
          if (this.isLoopPage) {
            v > count && (v = 0);
            v < 0 && (v = count);
          } else {
            v > count && (v = count);
            v < 0 && (v = 0);
          }
          this.preIndex = this._index;
          this._index = v;
          false;
          this._updatePage(v);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(BhvSwitchPage.prototype, "isChanging", {
        get: function() {
          return this._isChanging;
        },
        enumerable: false,
        configurable: true
      });
      BhvSwitchPage.prototype.onLoad = function() {
        this.preIndex = this.index;
      };
      BhvSwitchPage.prototype._updateEditorPage = function(page) {
        true;
        return;
        var children;
        var i;
        var node;
      };
      BhvSwitchPage.prototype._updatePage = function(page) {
        var children = this.node.children;
        var preIndex = this.preIndex;
        var curIndex = this.index;
        if (preIndex === curIndex) return;
        var preNode = children[preIndex];
        var showNode = children[curIndex];
        preNode.active = false;
        showNode.active = true;
      };
      BhvSwitchPage.prototype.next = function() {
        if (this.isChanging) return false;
        this.index++;
        return true;
      };
      BhvSwitchPage.prototype.previous = function() {
        if (this.isChanging) return false;
        this.index--;
        return true;
      };
      BhvSwitchPage.prototype.setEventIndex = function(e, index) {
        if (this.index >= 0 && null != this.index && false === this.isChanging) {
          this.index = index;
          return true;
        }
        return false;
      };
      __decorate([ property ], BhvSwitchPage.prototype, "isLoopPage", void 0);
      __decorate([ property ], BhvSwitchPage.prototype, "_index", void 0);
      __decorate([ property({
        type: cc.Integer
      }) ], BhvSwitchPage.prototype, "index", null);
      BhvSwitchPage = __decorate([ ccclass, executeInEditMode, menu("\u6dfb\u52a0\u7279\u6b8a\u884c\u4e3a/UI/Switch Page (\u5207\u6362\u9875\u9762)") ], BhvSwitchPage);
      return BhvSwitchPage;
    }(cc.Component);
    exports.default = BhvSwitchPage;
    cc._RF.pop();
  }, {} ],
  BulletController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cd8fcwOLfFEH6xC+8Jvs0f9", "BulletController");
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
    var Controller_1 = require("./Controller");
    var BulletController = function(_super) {
      __extends(BulletController, _super);
      function BulletController(array) {
        var _this = _super.call(this) || this;
        _this.bulletArray = array;
        return _this;
      }
      BulletController.prototype.openFire = function() {
        for (var _i = 0, _a = this.bulletArray; _i < _a.length; _i++) {
          var bullet = _a[_i];
          bullet.ins && bullet.ins.openFire();
        }
      };
      return BulletController;
    }(Controller_1.default);
    exports.default = BulletController;
    cc._RF.pop();
  }, {
    "./Controller": "Controller"
  } ],
  Bullet: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "82564z2OFBCoKqdwekZzSOr", "Bullet");
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
    var ObjectBase_1 = require("../ObjectBase");
    var Bullet = function(_super) {
      __extends(Bullet, _super);
      function Bullet(param) {
        var _this = _super.call(this) || this;
        _this.id = param.id || 0;
        _this.skin = param.skin || "";
        _this.component = param.component || "";
        _this.type = param.type || [];
        _this.state = param.state || [];
        _this.speed = param.speed || 0;
        _this.moveRd = param.moveRd || 0;
        _this.moveTiled = param.moveTiled || [];
        return _this;
      }
      return Bullet;
    }(ObjectBase_1.default);
    exports.default = Bullet;
    cc._RF.pop();
  }, {
    "../ObjectBase": "ObjectBase"
  } ],
  CollisionController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2c132Kt2htKfKQZItXhCbOI", "CollisionController");
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
    var Controller_1 = require("./Controller");
    var MathUtiles_1 = require("../lib/MathUtiles");
    var CollisionController = function(_super) {
      __extends(CollisionController, _super);
      function CollisionController() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      CollisionController.createCollision = function(type, node, callFunc, width, height, collisionName) {
        switch (type) {
         case this.COLLISION_BOX_ENUM.CIRCAL:
          this.createCircalCollision(node, callFunc, width, collisionName);
          break;

         case this.COLLISION_BOX_ENUM.RECT:
          this.createRectCollision(node, callFunc, width, height, collisionName);
        }
      };
      CollisionController.createCircalCollision = function(node, callFunc, radius, collisionName) {
        var name = node.name + "Collision" || collisionName;
        node.getChildByName(name) && node.getChildByName(name).destroy();
        var collisionNode = new cc.Node(name);
        var collision = collisionNode.addComponent(cc.CircleCollider);
        collision.radius = radius || MathUtiles_1.default.GetHypotenuseByWH(node.width, node.height);
        callFunc && callFunc(collisionNode, collision);
      };
      CollisionController.createRectCollision = function(node, callFunc, width, height, collisionName) {
        var name = node.name + "Collision" || collisionName;
        node.getChildByName(name) && node.getChildByName(name).destroy();
        var collisionNode = new cc.Node(name);
        var collision = collisionNode.addComponent(cc.BoxCollider);
        collision.size.width = width || node.width;
        collision.size.height = height || node.height;
        callFunc && callFunc(collisionNode, collision);
      };
      CollisionController.COLLISION_TAG_ENUM = cc.Enum({
        WALL: 1e3,
        ROLE: 1001
      });
      CollisionController.COLLISION_BOX_ENUM = cc.Enum({
        RECT: 1,
        CIRCAL: 2
      });
      CollisionController.COLLISION_TYEP_ENUM = cc.Enum({
        RECT_RECT: 1,
        CIRCAL_RECT: 2
      });
      CollisionController.CollisionTrigger = function(flag, draw) {
        void 0 === flag && (flag = true);
        void 0 === draw && (draw = false);
        var manager = cc.director.getCollisionManager();
        manager.enabled = flag;
        manager.enabledDebugDraw = draw;
        manager.enabledDrawBoundingBox = draw;
        return manager;
      };
      CollisionController.JudgeCollision = function(type, one, two) {
        switch (type) {
         case 1:
          return cc.Intersection.rectRect(one, two);
        }
        return;
      };
      return CollisionController;
    }(Controller_1.default);
    exports.default = CollisionController;
    cc._RF.pop();
  }, {
    "../lib/MathUtiles": "MathUtiles",
    "./Controller": "Controller"
  } ],
  Controller: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fdd98kRs4NE66RRBCDYaxdX", "Controller");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Controller = function() {
      function Controller() {}
      Controller.getInstance = function() {
        this.instance || (this.instance = new this());
        return this.instance;
      };
      return Controller;
    }();
    exports.default = Controller;
    cc._RF.pop();
  }, {} ],
  DataController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a6194TQ9uxL+73RJ90BTM5m", "DataController");
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
    var Controller_1 = require("./Controller");
    var GameController_1 = require("./GameController");
    var DataController = function(_super) {
      __extends(DataController, _super);
      function DataController() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      DataController.GetDataById = function(id) {
        var result = GameController_1.default.GameDataMap.has(id);
        if (result) return JSON.parse(JSON.stringify(GameController_1.default.GameDataMap.get(id)));
        return false;
      };
      return DataController;
    }(Controller_1.default);
    exports.default = DataController;
    cc._RF.pop();
  }, {
    "./Controller": "Controller",
    "./GameController": "GameController"
  } ],
  DataUtiles: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "62e2ct3Dt1IeY8YvBWn9Qky", "DataUtiles");
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
    var Utiles_1 = require("./Utiles");
    var DataUtiles = function(_super) {
      __extends(DataUtiles, _super);
      function DataUtiles() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      DataUtiles.Encrypt = function(str) {
        var c = String.fromCharCode(str.charCodeAt(0) + str.length);
        for (var i = 1; i < str.length; i++) c += String.fromCharCode(str.charCodeAt(i) + str.charCodeAt(i - 1));
        return escape(c);
      };
      DataUtiles.Decrypt = function(str) {
        str = unescape(str);
        var c = String.fromCharCode(str.charCodeAt(0) - str.length);
        for (var i = 1; i < str.length; i++) c += String.fromCharCode(str.charCodeAt(i) - c.charCodeAt(i - 1));
        return c;
      };
      DataUtiles.StrMapToObj = function(strMap) {
        var obj = Object.create(null);
        for (var _i = 0, strMap_1 = strMap; _i < strMap_1.length; _i++) {
          var _a = strMap_1[_i], k = _a[0], v = _a[1];
          obj[k] = v;
        }
        return obj;
      };
      DataUtiles.ObjToStrMap = function(obj) {
        var strMap = new Map();
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
          var k = _a[_i];
          strMap.set(k, obj[k]);
        }
        return strMap;
      };
      DataUtiles.StrMapToJson = function(strMap) {
        return JSON.stringify(this.StrMapToObj(strMap));
      };
      DataUtiles.JsonToStrMap = function(jsonStr) {
        return this.ObjToStrMap(JSON.parse(jsonStr));
      };
      return DataUtiles;
    }(Utiles_1.default);
    exports.default = DataUtiles;
    cc._RF.pop();
  }, {
    "./Utiles": "Utiles"
  } ],
  EnclosureGameC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bcfe8w/e2JHUYMoZthAcH2u", "EnclosureGameC");
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
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var EnclosureGameC = function(_super) {
      __extends(EnclosureGameC, _super);
      function EnclosureGameC() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.pannel = null;
        _this.globalPoly = {
          regions: [ [] ],
          inverted: false
        };
        _this.touchPArray = [ [] ];
        _this._polyOne = [ [ [ 50, 50 ], [ 150, 150 ], [ 190, 50 ] ], [ [ 130, 50 ], [ 290, 150 ], [ 290, 50 ] ] ];
        _this._polyTwo = [ [ [ 110, 20 ], [ 110, 110 ], [ 20, 20 ] ], [ [ 130, 170 ], [ 130, 20 ], [ 260, 20 ], [ 260, 170 ] ] ];
        _this._polyThree = [ [ [ 50, 50 ], [ 150, 150 ], [ 190, 50 ] ] ];
        _this._polyFour = [ [ [ 130, 50 ], [ 290, 150 ], [ 290, 50 ] ] ];
        return _this;
      }
      EnclosureGameC.prototype.onLoad = function() {
        this.openListen();
      };
      EnclosureGameC.prototype.start = function() {};
      EnclosureGameC.prototype.openListen = function() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStartCallFunc, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveCalMovelFunc, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndCallFunc, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancelCallFunc, this);
      };
      EnclosureGameC.prototype.touchStartCallFunc = function(event) {
        this.touchPArray = [ [] ];
        var startP = event.getLocation();
        var startPCv = this.node.convertToNodeSpaceAR(startP);
        this.touchPArray[0].push([ startPCv.x, startPCv.y ]);
      };
      EnclosureGameC.prototype.touchMoveCalMovelFunc = function(event) {
        var startP = event.getLocation();
        var startPCv = this.node.convertToNodeSpaceAR(startP);
        this.touchPArray[0].push([ startPCv.x, startPCv.y ]);
      };
      EnclosureGameC.prototype.touchEndCallFunc = function(event) {
        var tempPolygon = {
          regions: this.touchPArray,
          inverted: false
        };
        var resultPolygon = PolyBool.union(this.globalPoly, tempPolygon);
        this.globalPoly = resultPolygon;
        this.drawByPolyBool(this.globalPoly);
      };
      EnclosureGameC.prototype.touchCancelCallFunc = function(event) {};
      EnclosureGameC.prototype.drawByArray = function(pointsArray) {
        this.pannel.clear();
        for (var _i = 0, pointsArray_1 = pointsArray; _i < pointsArray_1.length; _i++) {
          var points = pointsArray_1[_i];
          var arr1 = points.shift();
          var p1 = cc.v2(arr1[0], arr1[1]);
          this.pannel.lineWidth = 3;
          this.pannel.strokeColor = cc.Color.WHITE;
          this.pannel.fillColor = cc.Color.YELLOW;
          this.pannel.moveTo(p1.x, p1.y);
          for (var _a = 0, points_1 = points; _a < points_1.length; _a++) {
            var point = points_1[_a];
            var p = cc.v2(point[0], point[1]);
            this.pannel.lineTo(p.x, p.y);
            this.pannel.close();
            this.pannel.stroke();
            this.pannel.fill();
          }
        }
      };
      EnclosureGameC.prototype.drawByPolyBool = function(polyBool) {
        var pointsArray = polyBool.regions;
        this.drawByArray(pointsArray);
      };
      __decorate([ property({
        type: cc.Graphics,
        displayName: "\u753b\u677f"
      }) ], EnclosureGameC.prototype, "pannel", void 0);
      EnclosureGameC = __decorate([ ccclass ], EnclosureGameC);
      return EnclosureGameC;
    }(cc.Component);
    exports.default = EnclosureGameC;
    cc._RF.pop();
  }, {} ],
  Enemy: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ec5470jqZFARqmLuoQXcSWl", "Enemy");
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
    var Role_1 = require("./Role");
    var Enemy = function(_super) {
      __extends(Enemy, _super);
      function Enemy(param) {
        return _super.call(this, param) || this;
      }
      return Enemy;
    }(Role_1.default);
    exports.default = Enemy;
    cc._RF.pop();
  }, {
    "./Role": "Role"
  } ],
  FirstLoadC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "41bc6MSrGVBWIEmA1RxJ6Ln", "FirstLoadC");
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
    var GameController_1 = require("../../controller/GameController");
    var SceneC_1 = require("../SceneC");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var FirstLoadC = function(_super) {
      __extends(FirstLoadC, _super);
      function FirstLoadC() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.loadBg = null;
        _this.loadProgressBar = null;
        _this._onLoad = function() {
          try {
            GameController_1.default.InitGameController(function(completedCount, totalCount, item) {
              _this.loadProgressBar.getComponent(cc.ProgressBar).progress = completedCount / totalCount;
            }, function() {
              var sceneInfo = GameController_1.default.GameDataMap.get("scenes");
              _this._switchToDefaultScene(sceneInfo.default.name);
            });
          } catch (error) {
            cc.log(error);
          }
        };
        return _this;
      }
      FirstLoadC.prototype._switchToDefaultScene = function(name, callFunc) {
        cc.director.preloadScene(name, function(err) {
          if (err) {
            cc.log(err);
            return;
          }
          cc.director.loadScene(name, function() {
            callFunc && callFunc();
          });
        });
      };
      __decorate([ property({
        type: cc.Node,
        displayName: "\u52a0\u8f7d\u754c\u9762\u80cc\u666f"
      }) ], FirstLoadC.prototype, "loadBg", void 0);
      __decorate([ property({
        type: cc.Node,
        displayName: "\u52a0\u8f7d\u8fdb\u5ea6\u6761"
      }) ], FirstLoadC.prototype, "loadProgressBar", void 0);
      FirstLoadC = __decorate([ ccclass ], FirstLoadC);
      return FirstLoadC;
    }(SceneC_1.default);
    exports.default = FirstLoadC;
    cc._RF.pop();
  }, {
    "../../controller/GameController": "GameController",
    "../SceneC": "SceneC"
  } ],
  FlipCardC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e4ee4tvlV9Cm6iD9nuWK176", "FlipCardC");
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
    var FlipCardSprite_1 = require("../../../resources/shader/FlipCard/FlipCardSprite");
    var PolygonUtils_1 = require("../../lib/PolygonUtils");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var RectPoint = function() {
      function RectPoint() {}
      return RectPoint;
    }();
    var NewClass = function(_super) {
      __extends(NewClass, _super);
      function NewClass() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.drawBorad = null;
        _this.card = null;
        _this.guideborad = null;
        _this.bgBoard = null;
        _this.reflectBoard = null;
        _this.topPoint = cc.v2(0, 0);
        _this.bottomPoint = cc.v2(0, 0);
        _this.flipPoint = cc.v2(0, 0);
        _this.rect = null;
        _this.rectSize = 2;
        return _this;
      }
      NewClass.prototype.onLoad = function() {
        this.openListen();
        this.topPoint.y = this.card.height / this.rectSize;
        this.bottomPoint.y = -this.card.height / this.rectSize;
        this.flipPoint.y = -this.card.height / this.rectSize;
        this.flipPoint.x = this.card.width / this.rectSize;
        var _a = [ -this.card.width / this.rectSize, this.card.height / this.rectSize, -this.card.height / this.rectSize, this.card.width / this.rectSize ], l = _a[0], t = _a[1], b = _a[2], r = _a[3];
        this.rect = [ cc.v2(l, t), cc.v2(r, t), cc.v2(r, b), cc.v2(l, b) ];
        this.drawBg();
      };
      NewClass.prototype.start = function() {};
      NewClass.prototype.update = function(dt) {};
      NewClass.prototype.openListen = function() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartCallFunc, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveCallFunc, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelCallFunc, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCancelCallFunc, this);
      };
      NewClass.prototype.onTouchStartCallFunc = function(event) {
        var pos = event.getLocation();
        var cPos = this.node.convertToNodeSpaceAR(pos);
        this.getPointByTouchPoint(cPos);
      };
      NewClass.prototype.onTouchMoveCallFunc = function(event) {
        var pos = event.getLocation();
        var cPos = this.node.convertToNodeSpaceAR(pos);
        this.getPointByTouchPoint(cPos);
      };
      NewClass.prototype.onTouchCancelCallFunc = function(event) {
        this.drawBorad.clear();
        this.guideborad.clear();
        this.reflectBoard.clear();
        this.card.getComponent(FlipCardSprite_1.default).initPic();
      };
      NewClass.prototype.onTouchEndCallFunc = function(event) {
        this.drawBorad.clear();
        this.guideborad.clear();
        this.reflectBoard.clear();
        this.card.getComponent(FlipCardSprite_1.default).initPic();
      };
      NewClass.prototype.draw = function(pos, p1, p2, p3) {
        this.drawBorad.clear();
        this.drawBorad.strokeColor = cc.Color.BLACK;
        this.drawBorad.lineWidth = 10;
        this.drawBorad.moveTo(pos.x, pos.y);
        p3 && this.drawBorad.lineTo(p3.x, p3.y);
        this.drawBorad.lineTo(p1.x, p1.y);
        this.drawBorad.lineTo(p2.x, p2.y);
        this.drawBorad.close();
        this.drawBorad.stroke();
      };
      NewClass.prototype.drawNormal = function(p1, p2) {
        this.drawBorad.clear();
        this.drawBorad.strokeColor = cc.Color.BLACK;
        this.drawBorad.lineWidth = 10;
        this.drawBorad.moveTo(p2.x, p2.y);
        this.drawBorad.lineTo(p1.x, p1.y);
        this.drawBorad.stroke();
      };
      NewClass.prototype.drawGuide = function(p1, p2, p3) {
        this.guideborad.clear();
        this.guideborad.strokeColor = cc.Color.BLUE;
        this.guideborad.lineWidth = 10;
        this.guideborad.moveTo(p2.x, p2.y);
        this.guideborad.lineTo(p1.x, p1.y);
        this.guideborad.stroke();
        this.guideborad.moveTo(p3.x, p3.y);
        this.guideborad.lineTo(this.flipPoint.x, this.flipPoint.y);
        this.guideborad.strokeColor = cc.Color.YELLOW;
        this.guideborad.stroke();
      };
      NewClass.prototype.drawReflect = function(p1, p2) {
        this.reflectBoard.clear();
        this.reflectBoard.strokeColor = cc.Color.RED;
        this.reflectBoard.lineWidth = 10;
        this.reflectBoard.moveTo(p2.x, p2.y);
        this.reflectBoard.lineTo(p1.x, p1.y);
        this.reflectBoard.stroke();
      };
      NewClass.prototype.drawBg = function() {
        this.bgBoard.clear();
        this.bgBoard.strokeColor = cc.Color.BLACK;
        this.bgBoard.lineWidth = 10;
        this.bgBoard.moveTo(this.rect[0].x, this.rect[0].y);
        this.bgBoard.lineTo(this.rect[1].x, this.rect[1].y);
        this.bgBoard.lineTo(this.rect[2].x, this.rect[2].y);
        this.bgBoard.lineTo(this.rect[3].x, this.rect[3].y);
        this.bgBoard.close();
        this.bgBoard.stroke();
      };
      NewClass.prototype.getPointByTouchPoint = function(p) {
        var cTouchV = p.sub(this.flipPoint);
        var rd = Math.atan2(cTouchV.y, cTouchV.x);
        var slope = -1 / Math.tan(rd);
        slope = Number(slope.toFixed(2));
        var midPoint = cc.v2((p.x + this.flipPoint.x) / 2, (p.y + this.flipPoint.y) / 2);
        var polygons = [ this.rect ];
        var result = this.getIntersectionByPointAndSlope(midPoint, slope, polygons, p);
        result.length > 1 ? this.draw(p, result[0], result[1], result[2]) : this.drawBorad.clear();
      };
      NewClass.prototype.getReflectPointByPointAndLine = function(point, p1, p2) {
        var vec_r = cc.v2(0, 0);
        var a1 = (p2.y - p1.y) / (p2.x - p1.x);
        var b1 = p2.y - a1 * p2.x;
        var a2 = -1 / a1;
        var b2 = point.y - a2 * point.x;
        var returnX = ((a1 - a2) * point.x + 2 * b1 - 2 * b2) / (a2 - a1);
        var returnY = ((a1 - a2) * point.y - 2 * a1 * b2 + 2 * a2 * b1) / (a2 - a1);
        this.drawReflect(p1, cc.v2(returnX, returnY));
        return cc.v2(returnX, returnY);
      };
      NewClass.prototype.judgeGenPoints = function(p1, p2, p3, p4) {
        var resultArr = [];
        resultArr.push(p3);
        for (var _i = 0, _a = this.rect; _i < _a.length; _i++) {
          var point = _a[_i];
          if (point.equals(this.flipPoint)) continue;
          var result = PolygonUtils_1.PolygonUtil.rayPointToLine(point, p1, p2);
          cc.log(result);
          if (-1 == result) {
            var reflectPoint = this.getReflectPointByPointAndLine(point.clone(), p3.clone(), p4.clone());
            cc.log(reflectPoint.x, reflectPoint.y);
            resultArr.push(reflectPoint);
          }
        }
        this.changePicPos(p1, p2, p3, p4);
        resultArr.push(p4);
        return resultArr;
      };
      NewClass.prototype.getIntersectionByPointAndSlope = function(point, slope, polygons, touchP, range) {
        void 0 === range && (range = 2e4);
        var p1 = cc.v2(point.x + range + point.x, slope * (point.x + range) + point.y).clone();
        var p2 = cc.v2(point.x - range + point.x, slope * (point.x - range) + point.y).clone();
        var result = [];
        this.drawGuide(p1, p2, touchP);
        for (var _i = 0, polygons_1 = polygons; _i < polygons_1.length; _i++) {
          var polygon = polygons_1[_i];
          for (var i = 0; i < polygon.length; i++) {
            var p3 = polygon[i].clone();
            var p4 = i == polygon.length - 1 ? polygon[0].clone() : polygon[i + 1].clone();
            var intersction = PolygonUtils_1.PolygonUtil.lineCrossPoint(p1.clone(), p2.clone(), p3.clone(), p4.clone());
            intersction[0] > -1 && result.push(intersction[1]);
          }
        }
        result.length > 1 && (result = this.judgeGenPoints(p1, p2, result[0], result[1]));
        return result;
      };
      NewClass.prototype.changePicPos = function(p1, p2, p3, p4) {
        var sprite = this.card.getComponent(FlipCardSprite_1.default);
        var yPointNum = sprite.yPointNum;
        var xPointNum = sprite.xPointNum;
        var pointList = sprite._pointList;
        for (var y = 0; y < yPointNum; y++) for (var x = 0; x < xPointNum; x++) {
          var posY = y / (yPointNum - 1) * sprite.node.height;
          var posX = x / (xPointNum - 1) * sprite.node.width;
          var archOffsetX = sprite.node.anchorX * sprite.node.width;
          var archOffsetY = sprite.node.anchorY * sprite.node.height;
          var point = pointList[y][x];
          var pos = cc.v2(posX - archOffsetX, posY - archOffsetY);
          var result = PolygonUtils_1.PolygonUtil.rayPointToLine(pos, p1, p2);
          if (-1 == result) {
            var reflectPoint = this.getReflectPointByPointAndLine(pos.clone(), p3.clone(), p4.clone());
            point.pos = reflectPoint;
          } else point.pos = pos;
        }
        sprite.setVertsDirty();
      };
      __decorate([ property({
        type: cc.Graphics,
        displayName: "\u753b\u677f"
      }) ], NewClass.prototype, "drawBorad", void 0);
      __decorate([ property({
        type: cc.Node,
        displayName: "\u5361\u724c"
      }) ], NewClass.prototype, "card", void 0);
      __decorate([ property({
        type: cc.Graphics,
        displayName: "\u8f85\u52a9\u7ebf\u753b\u677f"
      }) ], NewClass.prototype, "guideborad", void 0);
      __decorate([ property({
        type: cc.Graphics,
        displayName: "\u80cc\u666f\u753b\u677f"
      }) ], NewClass.prototype, "bgBoard", void 0);
      __decorate([ property({
        type: cc.Graphics,
        displayName: "\u53cd\u5c04\u7ebf\u753b\u677f"
      }) ], NewClass.prototype, "reflectBoard", void 0);
      NewClass = __decorate([ ccclass ], NewClass);
      return NewClass;
    }(cc.Component);
    exports.default = NewClass;
    cc._RF.pop();
  }, {
    "../../../resources/shader/FlipCard/FlipCardSprite": void 0,
    "../../lib/PolygonUtils": "PolygonUtils"
  } ],
  FormulaController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1f976qVlmxGBZ+9bmkp7Ugw", "FormulaController");
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
    var Controller_1 = require("./Controller");
    var FormulaController = function(_super) {
      __extends(FormulaController, _super);
      function FormulaController() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      FormulaController._analysisFormula = function(formula, key) {
        return formula.split(key);
      };
      FormulaController.GetResultByObjAndFormula = function(formula, obj) {
        var array = this._analysisFormula(formula.value, formula.key);
        for (var i = 0; i < array.length; i++) {
          var elm = array[i];
          if (!elm.search(/[A-Za-z]/i)) {
            if (!obj[elm]) {
              cc.log("obj not have this " + i + " property. ");
              return -1;
            }
            array[i] = obj[elm];
          }
        }
        return eval(array.join(""));
      };
      return FormulaController;
    }(Controller_1.default);
    exports.default = FormulaController;
    cc._RF.pop();
  }, {
    "./Controller": "Controller"
  } ],
  GameController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "42549xigwJF+JKSPr8EYGkR", "GameController");
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
    var Controller_1 = require("./Controller");
    var GameController = function(_super) {
      __extends(GameController, _super);
      function GameController() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      GameController._preLoadSystemConfig = function(callFunc, progressCall) {
        var _this = this;
        try {
          cc.loader.loadRes(this.PREFIX_RES.JSON + this._systemConfig + this.SUFFIX_RES.DEFAULT, null, function(err, asset) {
            if (err) {
              cc.log(err);
              return;
            }
            cc.log(">> file load start.");
            cc.log(">>> main system file load start.");
            cc.log(">>> main file " + asset.name + " load completed.");
            var loadResArray = asset.json.loadResArray;
            cc.log(">>>> additional file load start.");
            if (loadResArray && loadResArray.length > 0) {
              cc.log(">>>> " + loadResArray.length + " additional file need to load.");
              cc.loader.loadResArray(loadResArray, null, function(completedCount, totalCount, item) {
                cc.log(">>>>> asset " + item.config.name + " load completed.");
                progressCall && progressCall(completedCount, totalCount, item);
              }, function(err, assets) {
                if (err) {
                  cc.log(err);
                  return;
                }
                cc.log(">>>> " + assets.length + " additional file load completed.");
                cc.log(">> file load completed.");
                loadResArray.push(_this.PREFIX_RES.JSON + _this._systemConfig + _this.SUFFIX_RES.DEFAULT);
                callFunc && callFunc(loadResArray);
              });
            } else {
              cc.log(">>>> no additional file need to load.");
              cc.log(">> file load completed.");
              loadResArray.push(_this.PREFIX_RES.JSON + _this._systemConfig + _this.SUFFIX_RES.DEFAULT);
              callFunc && callFunc(loadResArray);
            }
          });
        } catch (error) {
          cc.log(error);
        }
      };
      GameController._initGameDataMap = function(array, callFunc, progressCall) {
        try {
          cc.log(">> load system resource to map start.");
          for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var i = array_1[_i];
            var assetNameList = new Array();
            var asset = cc.loader.getRes(i);
            if (!asset) continue;
            var assetJson = asset.json;
            cc.log(">>> load " + asset.name + " to map start.");
            for (var j in assetJson) {
              cc.log(">>>> load " + asset.name + "'s " + j + " to map start.");
              this.GameDataMap.set(j, assetJson[j]);
              assetNameList.push(j);
              cc.log(">>>> load " + asset.name + "'s " + j + " to map compeleted.");
            }
            this.GameDataMap.set(asset.name, assetNameList);
            cc.log(">>> load " + asset.name + " to map compeleted.");
          }
          cc.log(">> load system resource to map compeleted.");
          callFunc && callFunc(array);
        } catch (error) {
          cc.log(error);
        }
      };
      GameController.ReleaseAssets = function(urls, callFunc, progressCall) {
        try {
          cc.log("> release resource start.");
          if ("string" == typeof urls) {
            cc.log(">> release resource " + urls + " start.");
            cc.loader.release(urls);
            cc.log(">> release resource " + urls + " compeleted.");
          } else {
            cc.log(">> " + urls.length + " file have to release.");
            var num = 0;
            for (var _i = 0, urls_1 = urls; _i < urls_1.length; _i++) {
              var url = urls_1[_i];
              cc.log(">>> release resource " + url + " start.");
              cc.loader.release(url);
              num++;
              cc.log(">>> release resource " + url + " compeleted.");
            }
            cc.log(">> " + num + " file release compeleted.");
          }
          cc.log("> release resource compeleted.");
          callFunc && callFunc(urls);
        } catch (error) {
          cc.log(error);
        }
      };
      GameController.InitGameController = function(progressCall, callFunc) {
        var _this = this;
        cc.log("> init GameController start.");
        this._preLoadSystemConfig(function(array) {
          _this._initGameDataMap(array, function(array) {
            _this.ReleaseAssets(array);
          });
          cc.log("> init GameController completed.");
          callFunc && callFunc();
        }, progressCall || null);
      };
      GameController.GAME_GROUP_ENUM = cc.Enum({
        DEFAULT: "default",
        ROLE: "role",
        BULLET: "bullet",
        BUILD: "build"
      });
      GameController.PREFIX_RES = cc.Enum({
        JSON: "json/",
        PREFAB_ROLE: "prefab/role/",
        PREFAB_BULLET: "prefab/bullet/"
      });
      GameController.SUFFIX_RES = cc.Enum({
        DEFAULT: ""
      });
      GameController._systemConfig = "SystemConfig";
      GameController.GameDataMap = new Map();
      return GameController;
    }(Controller_1.default);
    exports.default = GameController;
    cc._RF.pop();
  }, {
    "./Controller": "Controller"
  } ],
  HallC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "948deNWGsZMrY1aE8ZUBr3n", "HallC");
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
    var SceneC_1 = require("../SceneC");
    var GameController_1 = require("../../controller/GameController");
    var NodeController_1 = require("../../controller/NodeController");
    var RoleController_1 = require("../../controller/RoleController");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var HallC = function(_super) {
      __extends(HallC, _super);
      function HallC() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.game = null;
        _this.mainCamera = null;
        _this.UICamera = null;
        _this.map = null;
        _this._onLoad = function() {
          _this._init();
        };
        _this.start = function() {
          cc.log(GameController_1.default.GameDataMap);
        };
        _this._initGame = function() {
          var rect = new cc.Rect(0, 0, 100, 100);
          rect.center.set(cc.v2(0, 0));
          var g = _this.map.getComponent(cc.Graphics);
          g.rect(0, 0, 100, 100);
          g.fillColor = new cc.Color(255, 0, 0);
          g.fill();
          g.rect(-200, -200, 100, 100);
          g.fillColor = new cc.Color(0, 0, 255);
          g.fill();
          _this.scheduleOnce(function() {
            var newNode = new cc.Node();
            _this.node.addChild(newNode);
            var a = newNode.addComponent(cc.Graphics);
            a.rect(0, 0, 50, 50);
            a.fillColor = new cc.Color(0, 255, 0);
            a.fill();
            newNode.width = 100;
            newNode.height = 100;
            newNode.setPosition(0, 0);
            var action = cc.tween(newNode).repeatForever(cc.tween(newNode).sequence(cc.tween(newNode).by(.3, {
              x: 100
            }), cc.tween(newNode).by(.3, {
              x: -100
            })));
            action.start();
          }, 3);
        };
        _this.initPlayer = function() {
          try {
            var role = RoleController_1.default.GetHeroById("hero_01");
            if (!role) return;
            var genAxisPos = cc.v2(12, 11);
            var node = NodeController_1.default.CreateNode(NodeController_1.default.NODE_ENUM.ROLE);
            node.addComponent(role.component);
            _this.map.ins.addNodeToMapLayerByLayer(node);
            node.ins.obj = role;
            node.setPosition(30, 30);
          } catch (error) {
            cc.log(error);
          }
        };
        _this.initHall = function() {};
        _this.clickMap = function(touchPos) {
          var cvPos = _this.map.convertToNodeSpaceAR(touchPos);
          var cameraPos = cc.v2(_this.mainCamera.position);
          var judgePos = cvPos.add(cameraPos);
          var clickAxisPos = _this.map.ins.getAxisPosByPixelPos(judgePos);
          var mvTPos = _this.map.ins.getPixelPosByAxisPos(clickAxisPos);
          var heroNode = NodeController_1.default.getNodeByType(NodeController_1.default.TYPE_ENUM.HERO)[0];
          heroNode.ins._isMoving ? heroNode.ins.roleStopMoving() : _this.moveHandler(null, heroNode, judgePos, function() {});
        };
        _this.moveHandler = function(type, node, toPos, callFunc) {
          var moveTiled = node.ins.obj.moveTiled;
          var moveMap = new Map();
          for (var _i = 0, moveTiled_1 = moveTiled; _i < moveTiled_1.length; _i++) {
            var id = moveTiled_1[_i];
            var tiledInfo = GameController_1.default.GameDataMap.get(id);
            moveMap.set(tiledInfo.id, tiledInfo);
          }
          var moveArray = _this.map.ins.getMovePosArrayByPixelPos(node.position, toPos, moveMap);
          if (moveArray.length > 0) {
            cc.log(moveArray);
            node.ins.roleMoveByBlockArray(node, moveArray, callFunc);
          } else cc.log("can not move.");
        };
        _this.touchHandler = function(type, eOne, eTwo) {
          switch (type) {
           case _this.OPER_ENUM.CLICK:
            _this.singleClick(eOne);
            break;

           case _this.OPER_ENUM.DEFAULT:
            _this.defaultClick(eOne);
            break;

           case _this.OPER_ENUM.MOVE:
            _this.moveClick(eOne);
            break;

           case _this.OPER_ENUM.SCALE:
            _this.doubleMoveClick(eOne, eTwo);
          }
        };
        _this.singleClick = function(event) {
          var clickPos = event.getStartLocation();
          _this.clickMap(clickPos);
        };
        _this.defaultClick = function(event) {};
        _this.moveClick = function(event) {
          var curTouchPos = event.getLocation();
          var preTouchPos = event.getPreviousLocation();
          var vec = curTouchPos.sub(preTouchPos);
          _this.mainCamera.ins.cameraMove(vec);
        };
        _this.doubleMoveClick = function(eOne, eTwo) {};
        _this._onTouchStartCallFunc = function(event) {
          if (_this.touchPointArray.length < _this.touchPointMax) {
            _this.operation == _this.OPER_ENUM.DEFAULT && (_this.operation = _this.OPER_ENUM.CLICK);
            _this.touchPointArray.push(event.getStartLocation());
          }
        };
        _this._onTouchMoveCallFunc = function(event) {
          _this.touchPointArray.find(function(elm, index) {
            if (event.getStartLocation().equals(elm)) {
              var curTouchPos = event.getLocation();
              var vector = curTouchPos.sub(event.getStartLocation());
              var dis = vector.mag();
              dis > _this.misOperDis && _this.operation & _this.OPER_ENUM.CLICK && (_this.operation = _this.OPER_ENUM.MOVE);
              _this.touchHandler(_this.OPER_ENUM.MOVE, event);
            }
          });
        };
        _this._onTouchCancelCallFunc = function(event) {
          _this.touchPointArray.find(function(elm, index) {
            if (event.getStartLocation().equals(elm)) {
              if (_this.operation & _this.OPER_ENUM.CLICK) {
                cc.log("click here.");
                _this.touchHandler(_this.OPER_ENUM.CLICK, event);
              }
              _this.touchPointArray.splice(index, 1);
              _this.resetProperty();
            }
          });
        };
        _this._onTouchEndCallFunc = function(event) {
          _this.touchPointArray.find(function(elm, index) {
            if (event.getStartLocation().equals(elm)) {
              if (_this.operation & _this.OPER_ENUM.CLICK) {
                cc.log("click here.");
                _this.touchHandler(_this.OPER_ENUM.CLICK, event);
              }
              _this.touchPointArray.splice(index, 1);
              _this.resetProperty();
            }
          });
        };
        _this._listenTrigger = function(flag, callFunc) {
          if (flag) {
            _this.node.on(cc.Node.EventType.TOUCH_START, _this.onTouchStartCallFunc, _this);
            _this.node.on(cc.Node.EventType.TOUCH_MOVE, _this.onTouchMoveCallFunc, _this);
            _this.node.on(cc.Node.EventType.TOUCH_CANCEL, _this.onTouchCancelCallFunc, _this);
            _this.node.on(cc.Node.EventType.TOUCH_END, _this.onTouchEndCallFunc, _this);
          } else {
            _this.node.off(cc.Node.EventType.TOUCH_START);
            _this.node.off(cc.Node.EventType.TOUCH_MOVE);
            _this.node.off(cc.Node.EventType.TOUCH_CANCEL);
            _this.node.off(cc.Node.EventType.TOUCH_END);
          }
        };
        return _this;
      }
      HallC.prototype._init = function() {
        var _this = this;
        var sceneName = cc.director.getScene().name;
        var sceneInfos = GameController_1.default.GameDataMap.get("scenes");
        var sceneInfo = null;
        for (var k in sceneInfos) {
          var v = sceneInfos[k];
          if (v.name == sceneName && "default" != k) {
            sceneInfo = v;
            break;
          }
        }
        this.preloadAssets(sceneInfo, function() {
          cc.log("\u8d44\u6e90\u52a0\u8f7d\u5b8c\u6bd5\u3002");
          NodeController_1.default.getInstance().InitPool(sceneInfo.loadPrefabAssets);
          _this._initGame();
        });
      };
      __decorate([ property({
        displayName: "\u6e38\u620f\u4e3b\u8282\u70b9",
        type: cc.Node
      }) ], HallC.prototype, "game", void 0);
      __decorate([ property({
        displayName: "\u4e3b\u76f8\u673a",
        type: cc.Node
      }) ], HallC.prototype, "mainCamera", void 0);
      __decorate([ property({
        displayName: "UI\u76f8\u673a",
        type: cc.Node
      }) ], HallC.prototype, "UICamera", void 0);
      __decorate([ property({
        displayName: "\u5730\u56fe",
        type: cc.Node
      }) ], HallC.prototype, "map", void 0);
      HallC = __decorate([ ccclass ], HallC);
      return HallC;
    }(SceneC_1.default);
    exports.default = HallC;
    cc._RF.pop();
  }, {
    "../../controller/GameController": "GameController",
    "../../controller/NodeController": "NodeController",
    "../../controller/RoleController": "RoleController",
    "../SceneC": "SceneC"
  } ],
  Hero: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e07558IY3FOzojFwYsqeD93", "Hero");
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
    var Role_1 = require("./Role");
    var Hero = function(_super) {
      __extends(Hero, _super);
      function Hero(param) {
        return _super.call(this, param) || this;
      }
      return Hero;
    }(Role_1.default);
    exports.default = Hero;
    cc._RF.pop();
  }, {
    "./Role": "Role"
  } ],
  JsonOb: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "000b00Lx19Ke4hAFc9/Qlnh", "JsonOb");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.JsonOb = void 0;
    var OP = Object.prototype;
    var types = {
      obj: "[object Object]",
      array: "[object Array]"
    };
    var OAM = [ "push", "pop", "shift", "unshift", "sort", "reverse", "splice" ];
    var JsonOb = function() {
      function JsonOb(obj, callback) {
        OP.toString.call(obj) !== types.obj && OP.toString.call(obj) !== types.array && console.error("\u8bf7\u4f20\u5165\u4e00\u4e2a\u5bf9\u8c61\u6216\u6570\u7ec4");
        this._callback = callback;
        this.observe(obj);
      }
      JsonOb.prototype.observe = function(obj, path) {
        var _this = this;
        OP.toString.call(obj) === types.array && this.overrideArrayProto(obj, path);
        Object.keys(obj).forEach(function(key) {
          var self = _this;
          var oldVal = obj[key];
          var pathArray = path && path.slice();
          pathArray ? pathArray.push(key) : pathArray = [ key ];
          Object.defineProperty(obj, key, {
            get: function() {
              return oldVal;
            },
            set: function(newVal) {
              if (oldVal !== newVal) {
                "[object Object]" === OP.toString.call(newVal) && self.observe(newVal, pathArray);
                self._callback(newVal, oldVal, pathArray);
                oldVal = newVal;
              }
            }
          });
          OP.toString.call(obj[key]) !== types.obj && OP.toString.call(obj[key]) !== types.array || _this.observe(obj[key], pathArray);
        }, this);
      };
      JsonOb.prototype.overrideArrayProto = function(array, path) {
        var originalProto = Array.prototype;
        var overrideProto = Object.create(Array.prototype);
        var self = this;
        var result;
        OAM.forEach(function(method) {
          Object.defineProperty(overrideProto, method, {
            value: function() {
              var oldVal = this.slice();
              result = originalProto[method].apply(this, arguments);
              self.observe(this, path);
              self._callback(this, oldVal, path);
              return result;
            }
          });
        });
        array["__proto__"] = overrideProto;
      };
      return JsonOb;
    }();
    exports.JsonOb = JsonOb;
    cc._RF.pop();
  }, {} ],
  LoadC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "752e44ySM1NmaWnhVJN7WFk", "LoadC");
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
    var SceneC_1 = require("../SceneC");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LoadC = function(_super) {
      __extends(LoadC, _super);
      function LoadC() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.loadBg = null;
        _this.loadProgressBar = null;
        return _this;
      }
      LoadC.prototype._onLoad = function() {};
      __decorate([ property({
        type: cc.Node,
        displayName: "\u52a0\u8f7d\u754c\u9762\u80cc\u666f"
      }) ], LoadC.prototype, "loadBg", void 0);
      __decorate([ property({
        type: cc.Node,
        displayName: "\u52a0\u8f7d\u8fdb\u5ea6\u6761"
      }) ], LoadC.prototype, "loadProgressBar", void 0);
      LoadC = __decorate([ ccclass ], LoadC);
      return LoadC;
    }(SceneC_1.default);
    exports.default = LoadC;
    cc._RF.pop();
  }, {
    "../SceneC": "SceneC"
  } ],
  LotteryC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a1c10v25ihHeZll8+Ptkj95", "LotteryC");
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
    var MathUtiles_1 = require("../../lib/MathUtiles");
    var ADState_1 = require("../../state/lottery_state/ADState");
    var NormalState_1 = require("../../state/lottery_state/NormalState");
    var SceneC_1 = require("../SceneC");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LotteryC = function(_super) {
      __extends(LotteryC, _super);
      function LotteryC() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.itemPrefab = null;
        _this.itemContent = null;
        _this.openNumNode = null;
        _this.adBtnNode = null;
        _this.btnNode = null;
        _this.tipsNode = null;
        _this.keyCount = 0;
        _this.keyUseMax = 6;
        _this.itemNum = 9;
        _this.initOpenNum = 3;
        _this.initAdChestNum = 3;
        _this.initShakeChestNum = 3;
        _this._openNum = 3;
        _this._itemList = new Array();
        _this._adState = 1;
        return _this;
      }
      LotteryC.prototype._onLoad = function() {
        this.createItemNode();
      };
      LotteryC.prototype.update = function() {};
      LotteryC.prototype.createItemNode = function() {
        var array = new Array();
        for (var i = 0; i < this.itemNum; i++) {
          var node = cc.instantiate(this.itemPrefab);
          node.parent = this.itemContent;
          node.ins.setState(new NormalState_1.default());
          node.ins.game = this;
          array.push(node);
        }
        for (var i = 0; i < this.initAdChestNum; i++) {
          var index = MathUtiles_1.default.Random(0, array.length - 1);
          var node = array.splice(index, 1)[0];
          this._itemList.push(node);
          node.ins.setState(new ADState_1.default());
        }
        this._itemList = this._itemList.concat(array);
        array = new Array();
        for (var i = 0; i < this.initShakeChestNum; i++) {
          var index = MathUtiles_1.default.Random(0, this._itemList.length - 1);
          var node = this._itemList.splice(index, 1)[0];
          array.push(node);
          node.ins.shake();
        }
        this._itemList = this._itemList.concat(array);
      };
      LotteryC.prototype.openChest = function() {
        if (this._openNum > 0) {
          this.keyCount += 1;
          this._openNum -= 1;
          this.checkAdBtn();
          return true;
        }
        this.showTips("\u94a5\u5319\u4e0d\u8db3");
        return false;
      };
      LotteryC.prototype.checkAdBtn = function() {
        0 == this._openNum ? this.keyCount >= this.keyUseMax ? this.showContinueBtn() : this.showAdBtn() : this.showKeyNum();
      };
      LotteryC.prototype.showKeyNum = function() {
        this.openNumNode.active = true;
        this.btnNode.active = false;
        this.adBtnNode.active = false;
        var font = this.openNumNode.getChildByName("num");
        font.getComponent(cc.Label).string = "x" + this._openNum;
      };
      LotteryC.prototype.showAdBtn = function() {
        this.openNumNode.active = false;
        this.btnNode.active = false;
        this.adBtnNode.active = true;
      };
      LotteryC.prototype.showContinueBtn = function() {
        this.openNumNode.active = false;
        this.btnNode.active = true;
        this.adBtnNode.active = false;
      };
      LotteryC.prototype.clickHandler = function() {
        this._adState;
      };
      LotteryC.prototype.showTips = function(tips) {
        var font = this.tipsNode.getChildByName("content");
        font.getComponent(cc.Label).string = tips;
        this.tipsNode.opacity = 255;
        this.tipsNode.stopAllActions();
        this.tipsNode.runAction(cc.fadeOut(.3));
      };
      LotteryC.prototype.addNum = function(event) {
        var node = event.target;
        var toggleNode = node.getChildByName("Toggle");
        var isChecked = toggleNode.getComponent(cc.Toggle).isChecked;
        if (isChecked) {
          this._openNum = this.initOpenNum;
          this.checkAdBtn();
        } else this.showContinueBtn();
      };
      LotteryC.prototype.toggle = function(event) {
        var node = event.target.parent;
        var isChecked = node.getComponent(cc.Toggle).isChecked;
        cc.log(isChecked);
      };
      __decorate([ property({
        displayName: "\u5956\u54c1\u9884\u5236\u4f53",
        type: cc.Prefab
      }) ], LotteryC.prototype, "itemPrefab", void 0);
      __decorate([ property({
        displayName: "\u5956\u54c1\u5bb9\u5668\u8282\u70b9",
        type: cc.Node
      }) ], LotteryC.prototype, "itemContent", void 0);
      __decorate([ property({
        displayName: "\u6253\u5f00\u6b21\u6570\u663e\u793a\u8282\u70b9",
        type: cc.Node
      }) ], LotteryC.prototype, "openNumNode", void 0);
      __decorate([ property({
        displayName: "ad\u6309\u94ae\u8282\u70b9",
        type: cc.Node
      }) ], LotteryC.prototype, "adBtnNode", void 0);
      __decorate([ property({
        displayName: "\u6309\u94ae\u8282\u70b9",
        type: cc.Node
      }) ], LotteryC.prototype, "btnNode", void 0);
      __decorate([ property({
        displayName: "\u63d0\u793a\u8282\u70b9",
        type: cc.Node
      }) ], LotteryC.prototype, "tipsNode", void 0);
      LotteryC = __decorate([ ccclass ], LotteryC);
      return LotteryC;
    }(SceneC_1.default);
    exports.default = LotteryC;
    cc._RF.pop();
  }, {
    "../../lib/MathUtiles": "MathUtiles",
    "../../state/lottery_state/ADState": "ADState",
    "../../state/lottery_state/NormalState": "NormalState",
    "../SceneC": "SceneC"
  } ],
  LotteryItemC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "71201IIfdVLabVjkWmNk/Kv", "LotteryItemC");
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
    var ActionController_1 = require("../../controller/ActionController");
    var ActivationState_1 = require("../../state/lottery_state/ActivationState");
    var PrefabC_1 = require("../PrefabC");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LotteryItemC = function(_super) {
      __extends(LotteryItemC, _super);
      function LotteryItemC() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.itemBtn = null;
        _this.itemBg = null;
        _this.itemIcon = null;
        _this.itemNode = null;
        _this.itemNum = null;
        _this.itemTips = null;
        _this.spriteList = [];
        _this.audioArray = [];
        _this.IMG_INDEX_ENUM = cc.Enum({
          OPEN_IMG: 0,
          DIS_OPEN_IMG: 1,
          ENEGY_IMG: 2,
          NONE_REWARD: 3
        });
        _this.SOUND_INDEX_ENUM = cc.Enum({
          OPEN_CHEST: 0,
          CLICK_BTN: 1
        });
        _this._rewardMap = new Map();
        _this._rewardIndexMap = {
          1: 1,
          2: 2,
          3: 3,
          4: 5,
          5: false
        };
        return _this;
      }
      LotteryItemC.prototype._onLoad = function() {
        this.initRewardProbability();
      };
      LotteryItemC.prototype.start = function() {
        this.initShow();
      };
      LotteryItemC.prototype.initRewardProbability = function() {
        this._rewardMap.set(1, .2);
        this._rewardMap.set(2, .2);
        this._rewardMap.set(3, .2);
        this._rewardMap.set(4, .3);
        this._rewardMap.set(5, .1);
      };
      LotteryItemC.prototype.clickEventHandler = function(event) {
        var _this = this;
        this.itemBtn.getComponent(cc.Button).interactable = false;
        this._state.clickHandler(event, this.node, function() {
          _this.setState(new ActivationState_1.default());
        }, this);
      };
      LotteryItemC.prototype.initShow = function() {
        this._state.initShow(this.node, function() {}, this);
      };
      LotteryItemC.prototype.shake = function() {
        ActionController_1.default.rotationNodeByAngle(this.itemNode);
      };
      __decorate([ property({
        displayName: "\u5956\u52b1\u6309\u94ae\u8282\u70b9",
        type: cc.Node
      }) ], LotteryItemC.prototype, "itemBtn", void 0);
      __decorate([ property({
        displayName: "\u5956\u52b1\u80cc\u666f",
        type: cc.Sprite
      }) ], LotteryItemC.prototype, "itemBg", void 0);
      __decorate([ property({
        displayName: "\u5956\u52b1Icon",
        type: cc.Sprite
      }) ], LotteryItemC.prototype, "itemIcon", void 0);
      __decorate([ property({
        displayName: "\u5956\u52b1\u8282\u70b9",
        type: cc.Node
      }) ], LotteryItemC.prototype, "itemNode", void 0);
      __decorate([ property({
        displayName: "\u5956\u52b1\u6570\u91cf",
        type: cc.Label
      }) ], LotteryItemC.prototype, "itemNum", void 0);
      __decorate([ property({
        displayName: "\u5956\u52b1TIPS",
        type: cc.Node
      }) ], LotteryItemC.prototype, "itemTips", void 0);
      __decorate([ property({
        displayName: "\u9700\u8981\u7684\u56fe\u8d44\u6e90",
        type: [ cc.SpriteFrame ]
      }) ], LotteryItemC.prototype, "spriteList", void 0);
      __decorate([ property({
        displayName: "\u97f3\u6548",
        type: [ cc.AudioClip ]
      }) ], LotteryItemC.prototype, "audioArray", void 0);
      LotteryItemC = __decorate([ ccclass ], LotteryItemC);
      return LotteryItemC;
    }(PrefabC_1.default);
    exports.default = LotteryItemC;
    cc._RF.pop();
  }, {
    "../../controller/ActionController": "ActionController",
    "../../state/lottery_state/ActivationState": "ActivationState",
    "../PrefabC": "PrefabC"
  } ],
  LotteryState: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "188ccTWhfNOz4XVF/yYsJkc", "LotteryState");
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
    var StateBase_1 = require("../StateBase");
    var LotteryState = function(_super) {
      __extends(LotteryState, _super);
      function LotteryState() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.name = "LotteryState";
        return _this;
      }
      LotteryState.prototype.actionOne = function(node) {
        cc.log("this class ", this.name, " action one.");
      };
      LotteryState.prototype.clickHandler = function(event, node, callFunc, target) {
        callFunc && callFunc.call(target, 2);
        return;
      };
      LotteryState.prototype.initShow = function(node, callFunc, target) {};
      return LotteryState;
    }(StateBase_1.default);
    exports.default = LotteryState;
    cc._RF.pop();
  }, {
    "../StateBase": "StateBase"
  } ],
  MainC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5e377Q21whHOb11LtSmgBM2", "MainC");
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
    var SceneC_1 = require("../SceneC");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MainC = function(_super) {
      __extends(MainC, _super);
      function MainC() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Object.defineProperty(MainC.prototype, "sex", {
        get: function() {
          return this._sex;
        },
        set: function(value) {
          this._sex = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(MainC.prototype, "age", {
        get: function() {
          return this._age;
        },
        set: function(v) {
          this._age = v;
          cc.log("use func");
        },
        enumerable: false,
        configurable: true
      });
      MainC.prototype.onLoad = function() {
        this._age = "hello";
        cc.log(this._age);
        this.age = "hello";
        cc.log(this._age);
        cc.log("here");
      };
      MainC = __decorate([ ccclass ], MainC);
      return MainC;
    }(SceneC_1.default);
    exports.default = MainC;
    cc._RF.pop();
  }, {
    "../SceneC": "SceneC"
  } ],
  MathUtiles: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a60a9y/xZdA2JqwsMWKLKYl", "MathUtiles");
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
    var Utiles_1 = require("./Utiles");
    var MathUtiles = function(_super) {
      __extends(MathUtiles, _super);
      function MathUtiles() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      MathUtiles.Random = function(lower, upper) {
        void 0 === lower && (lower = 0);
        void 0 === upper && (upper = 1);
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
      };
      MathUtiles.GetHypotenuseByWH = function(a, b) {
        return Math.round(Math.sqrt(Math.pow(Math.abs(a), 2) + Math.pow(Math.abs(b), 2)));
      };
      MathUtiles.GetRandomValueByValueProbability = function(_a) {
        var _b = _a.min, min = void 0 === _b ? 0 : _b, _c = _a.max, max = void 0 === _c ? 10 : _c, _d = _a.valueProbabilityMap, valueProbabilityMap = void 0 === _d ? new Map() : _d;
        var getAvailablePercentage = function() {
          var result = 0;
          var array = valueProbabilityMap.values();
          for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var i = array_1[_i];
            0 < i && i < 1 && (result += i);
          }
          return result;
        };
        var setAvailablePercentage = function() {
          var availablePercentage = (1 - getAvailablePercentage()) / (max - min - valueProbabilityMap.size);
          return availablePercentage;
        };
        var random = function() {
          var t = 0, r = Math.random();
          for (var i = min; i < max; i++) {
            valueProbabilityMap.has(i) ? t += valueProbabilityMap.get(i) : t += setAvailablePercentage();
            if (t > r) return i;
          }
          return false;
        };
        return random();
      };
      MathUtiles.pointInPolygon = function(point, polygon) {
        var inside = false;
        var x = point.x;
        var y = point.y;
        var length = polygon.length;
        for (var i = 0, j = length - 1; i < length; j = i++) {
          var xi = polygon[i].x, yi = polygon[i].y, xj = polygon[j].x, yj = polygon[j].y, intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
          intersect && (inside = !inside);
        }
        return inside;
      };
      return MathUtiles;
    }(Utiles_1.default);
    exports.default = MathUtiles;
    cc._RF.pop();
  }, {
    "./Utiles": "Utiles"
  } ],
  NodeController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5c894V5W/dG2520IXRariw4", "NodeController");
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
    var GameController_1 = require("./GameController");
    var Controller_1 = require("./Controller");
    var NodeController = function(_super) {
      __extends(NodeController, _super);
      function NodeController() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.TYPE_ENUM = cc.Enum({
          ROLE: "role",
          HERO: "hero",
          ENEMY: "enemy"
        });
        _this.NODE_ENUM = cc.Enum({
          ROLE: "role",
          BULLET: "bullet"
        });
        _this._rolePool = new cc.NodePool();
        _this._rolePoolSize = 10;
        _this._bulletPool = new cc.NodePool();
        _this._bulletPoolSize = 20;
        _this._initPoolMap = {
          "prefab/role/role": function() {
            return _this._initRolePool;
          },
          "prefab/bullet/bullet": function() {
            return _this._initBulletPool;
          }
        };
        _this.nodeArray = new Map();
        return _this;
      }
      NodeController.prototype._preReturnNode = function(node) {
        this.nodeArray.delete(node.uuid);
        node.stopAllActions();
      };
      NodeController.prototype._preCreateNode = function(node) {
        node.ins && node.ins.destroy();
        node.stopAllActions();
        this.nodeArray.set(node.uuid, node);
      };
      NodeController.prototype._initRolePool = function() {
        cc.log(">> init role pool start.");
        var initNum = this._rolePoolSize - this._rolePool.size();
        cc.log(">>> " + initNum + " role node need to init.");
        for (var i = 0; i < initNum; i++) {
          var prefab = cc.loader.getRes(GameController_1.default.PREFIX_RES.PREFAB_ROLE + this.NODE_ENUM.ROLE + GameController_1.default.SUFFIX_RES.DEFAULT);
          var node = cc.instantiate(prefab);
          this._rolePool.put(node);
          cc.log(">>>> " + (i + 1) + " role node init completed.");
        }
        cc.log(">>> " + initNum + " role node init completed.");
        cc.log(">> init role pool completed.");
      };
      NodeController.prototype._initBulletPool = function() {
        cc.log(">> init bullet pool start.");
        var initNum = this._bulletPoolSize - this._bulletPool.size();
        cc.log(">>> " + initNum + " bullet node need to init.");
        for (var i = 0; i < initNum; i++) {
          var prefab = cc.loader.getRes(GameController_1.default.PREFIX_RES.PREFAB_BULLET + this.NODE_ENUM.BULLET + GameController_1.default.SUFFIX_RES.DEFAULT);
          var node = cc.instantiate(prefab);
          this._bulletPool.put(node);
          cc.log(">>>> " + (i + 1) + " bullet node init completed.");
        }
        cc.log(">>> " + initNum + " bullet node init completed.");
        cc.log(">> init bullet pool completed.");
      };
      NodeController.prototype._createRoleNode = function() {
        var node = null;
        if (this._rolePool && this._rolePool.size() > 0) node = this._rolePool.get(); else {
          var prefab = cc.loader.getRes(GameController_1.default.PREFIX_RES.PREFAB_ROLE + this.NODE_ENUM.ROLE + GameController_1.default.SUFFIX_RES.DEFAULT);
          node = cc.instantiate(prefab);
        }
        node.returnType = this.NODE_ENUM.ROLE;
        return node;
      };
      NodeController.prototype._createBulletNode = function() {
        var node = null;
        if (this._bulletPool && this._bulletPool.size() > 0) node = this._bulletPool.get(); else {
          var prefab = cc.loader.getRes(GameController_1.default.PREFIX_RES.PREFAB_BULLET + this.NODE_ENUM.BULLET + GameController_1.default.SUFFIX_RES.DEFAULT);
          node = cc.instantiate(prefab);
        }
        node.returnType = this.NODE_ENUM.BULLET;
        return node;
      };
      NodeController.prototype._returnRoleNode = function(node) {
        node && this._rolePool.put(node);
      };
      NodeController.prototype._returnBulletNode = function(node) {
        node && this._bulletPool.put(node);
      };
      NodeController.prototype.InitPool = function(array) {
        cc.log("> init pool start.");
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
          var elm = array_1[_i];
          this._initPoolMap[elm]();
        }
        cc.log("> init pool completed.");
      };
      NodeController.prototype.CreateNode = function(name) {
        var node = null;
        switch (name) {
         case this.NODE_ENUM.ROLE:
          node = this._createRoleNode();
          break;

         case this.NODE_ENUM.BULLET:
          node = this._createBulletNode();
          break;

         default:
          cc.log("node " + name + " not find.");
        }
        this._preCreateNode(node);
        return node;
      };
      NodeController.prototype.ReturnNode = function(node) {
        this._preReturnNode(node);
        switch (node.returnType) {
         case this.NODE_ENUM.ROLE:
          this._returnRoleNode(node);
          break;

         case this.NODE_ENUM.BULLET:
          this._returnBulletNode(node);
        }
      };
      NodeController.prototype.getNodeByType = function(type) {
        var nodeArray = new Array();
        this.nodeArray.forEach(function(v, k) {
          type ? v.ins && v.ins.obj && v.ins.obj.type.find(function(str) {
            return str == type;
          }) && nodeArray.push(v) : nodeArray.push(v);
        });
        return nodeArray;
      };
      NodeController.prototype.judgeTypeByTypeAndNode = function(type, node) {
        if (node.ins && node.ins.obj && node.ins.obj.type.find(function(str) {
          return str == type;
        })) return true;
        return false;
      };
      return NodeController;
    }(Controller_1.default);
    exports.default = NodeController;
    cc._RF.pop();
  }, {
    "./Controller": "Controller",
    "./GameController": "GameController"
  } ],
  NormalState: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "981f6jHcwlFEZq3GtCuUXQe", "NormalState");
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
    var ActionController_1 = require("../../controller/ActionController");
    var MathUtiles_1 = require("../../lib/MathUtiles");
    var LotteryState_1 = require("./LotteryState");
    var NormalState = function(_super) {
      __extends(NormalState, _super);
      function NormalState(name, count) {
        void 0 === name && (name = "NormalState");
        void 0 === count && (count = 1);
        var _this = _super.call(this) || this;
        _this.name = "NormalState";
        _this._stateNum = 1;
        _this.name = name;
        _this._stateNum = count;
        return _this;
      }
      NormalState.prototype.actionOne = function(node) {
        cc.log("this class ", this.name, " action one.");
      };
      NormalState.prototype.clickHandler = function(event, node, callFunc, target) {
        var open = target.game.openChest();
        if (!open) {
          target.itemBtn.getComponent(cc.Button).interactable = true;
          return;
        }
        var result = MathUtiles_1.default.GetRandomValueByValueProbability({
          min: 1,
          max: 6,
          valueProbabilityMap: target._rewardMap
        });
        target.itemNode.stopAllActions();
        target.itemNode.angle = 0;
        ActionController_1.default.rotationNodeByScaleX(node, function() {
          target.itemBg.spriteFrame = target.spriteList[target.IMG_INDEX_ENUM.OPEN_IMG];
          var v = target._rewardIndexMap[result];
          cc.log(v);
          if (v) {
            target.itemIcon.spriteFrame = target.spriteList[target.IMG_INDEX_ENUM.ENEGY_IMG];
            target.itemNum.active = true;
            target.itemNum.string = "x" + v;
          } else target.itemIcon.spriteFrame = target.spriteList[target.IMG_INDEX_ENUM.NONE_REWARD];
          callFunc && callFunc.call(target);
        });
      };
      NormalState.prototype.initShow = function(node, callFunc, target) {};
      return NormalState;
    }(LotteryState_1.default);
    exports.default = NormalState;
    cc._RF.pop();
  }, {
    "../../controller/ActionController": "ActionController",
    "../../lib/MathUtiles": "MathUtiles",
    "./LotteryState": "LotteryState"
  } ],
  ObjectBase: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bebd4dBTpRDlYRJW/SrRC8j", "ObjectBase");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ObjectBase = function() {
      function ObjectBase() {}
      return ObjectBase;
    }();
    exports.default = ObjectBase;
    cc._RF.pop();
  }, {} ],
  ObjectC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3562dVvU5lDQ4f7J6CmfpXj", "ObjectC");
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
    var CollisionController_1 = require("../controller/CollisionController");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ObjectC = function(_super) {
      __extends(ObjectC, _super);
      function ObjectC() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._state = null;
        _this.touchPointArray = new Array();
        _this.keyPressArray = new Array();
        _this.moveKeyPressArray = new Array();
        _this.touchPointMax = 1;
        _this.operation = 0;
        _this.misOperDis = 50;
        _this.unitMoveDis = .5;
        _this.OPER_ENUM = cc.Enum({
          DEFAULT: 0,
          CLICK: 1,
          MOVE: 2,
          SCALE: 3
        });
        _this.KEY_OPERATION_ENUM = cc.Enum({
          ATK: "attack",
          UP: "up",
          RIGHT: "right",
          LEFT: "left",
          DOWN: "down"
        });
        _this.updateMethodArray = new Array();
        _this.operationMethodMap = new Map();
        _this.keycodMap = new Map();
        _this.moveKeycodMap = new Map();
        _this.keycodeAngleMap = {
          up: Math.PI / 2,
          left: Math.PI,
          down: -Math.PI / 2,
          right: 0,
          upleft: 3 * Math.PI / 4,
          leftup: 3 * Math.PI / 4,
          upright: 1 * Math.PI / 4,
          rightup: 1 * Math.PI / 4,
          leftdown: 3 * -Math.PI / 4,
          downleft: 3 * -Math.PI / 4,
          downright: 1 * -Math.PI / 4,
          rightdown: 1 * -Math.PI / 4
        };
        _this.DEPLOY_TYPE_ENUM = cc.Enum({
          SPINE: 1,
          SPRITE: 2,
          MATERIAL: 3
        });
        _this.initIns = function() {
          _this.node.ins = _this;
        };
        _this.resetProperty = function() {
          _this.operation = _this.OPER_ENUM.DEFAULT;
          _this.touchPointArray.splice(0, _this.touchPointArray.length);
        };
        _this.initKeycodMap = function() {
          _this.keycodMap.set(32, _this.KEY_OPERATION_ENUM.ATK);
          _this.keycodMap.set(83, _this.KEY_OPERATION_ENUM.DOWN);
          _this.keycodMap.set(87, _this.KEY_OPERATION_ENUM.UP);
          _this.keycodMap.set(65, _this.KEY_OPERATION_ENUM.LEFT);
          _this.keycodMap.set(68, _this.KEY_OPERATION_ENUM.RIGHT);
          _this.initMoveKeycodMap();
        };
        _this.initMoveKeycodMap = function() {
          _this.moveKeycodMap.set(83, _this.KEY_OPERATION_ENUM.DOWN);
          _this.moveKeycodMap.set(87, _this.KEY_OPERATION_ENUM.UP);
          _this.moveKeycodMap.set(65, _this.KEY_OPERATION_ENUM.LEFT);
          _this.moveKeycodMap.set(68, _this.KEY_OPERATION_ENUM.RIGHT);
        };
        _this.preloadAssets = function(scenesSysInfo, callFunc) {
          try {
            var preLoadAssetsArray = scenesSysInfo.loadAssetsArray || [];
            var preLoadSpineArray_1 = scenesSysInfo.loadSpineAssets || [];
            var preloadPrefabArray_1 = scenesSysInfo.loadPrefabAssets || [];
            var preloadSpriteArray_1 = scenesSysInfo.loadSpriteAssets || [];
            cc.loader.loadResArray(preLoadAssetsArray, function(error, assets) {
              error && cc.log(error);
              for (var _i = 0, assets_1 = assets; _i < assets_1.length; _i++) {
                var elm = assets_1[_i];
                cc.log(">preload asset ", elm.name, " compelete.");
              }
              cc.loader.loadResArray(preLoadSpineArray_1, sp.SkeletonData, function(error, assets) {
                error && cc.log(error);
                for (var _i = 0, assets_2 = assets; _i < assets_2.length; _i++) {
                  var elm = assets_2[_i];
                  cc.log(">preload spine asset ", elm.name, " compelete.");
                }
                cc.loader.loadResArray(preloadSpriteArray_1, cc.SpriteFrame, function(error, assets) {
                  error && cc.log(error);
                  for (var _i = 0, assets_3 = assets; _i < assets_3.length; _i++) {
                    var elm = assets_3[_i];
                    cc.log(">preload sprite asset ", elm.name, " compelete.");
                  }
                  cc.loader.loadResArray(preloadPrefabArray_1, cc.Prefab, function(error, assets) {
                    error && cc.log(error);
                    for (var _i = 0, assets_4 = assets; _i < assets_4.length; _i++) {
                      var elm = assets_4[_i];
                      cc.log(">preload prefab asset ", elm.name, " compelete.");
                    }
                    callFunc && callFunc();
                  });
                });
              });
            });
          } catch (error) {
            cc.log(error);
          }
        };
        _this.releaseAssets = function() {};
        _this.deploySprite = function(node, url, callFunc) {
          if (!url) return;
          try {
            var sprite = node.getComponent(cc.Sprite);
            sprite.spriteFrame = new cc.SpriteFrame(cc.loader.getRes(url));
            callFunc && callFunc(sprite);
          } catch (error) {}
        };
        _this.deploySpine = function(node, url, callFunc) {
          if (!url) return;
          try {
            var spine = node.getChildByName(node.name).getComponent("sp.Skeleton");
            spine.skeletonData = cc.loader.getRes(url, sp.SkeletonData);
            callFunc && callFunc(spine);
          } catch (error) {}
        };
        _this.deployMaterial = function(node, url, callFunc) {
          if (!url) return;
          try {
            var material = cc.loader.getRes(url, cc.Material);
            var com = null;
            node.getComponent(cc.Sprite) ? com = node.getComponent(cc.Sprite) : node.getComponent(sp.Skeleton) && (com = node.getComponent(sp.Skeleton));
            null != com && com.setMaterial(0, material);
            callFunc && callFunc(com);
          } catch (error) {}
        };
        _this.listenTrigger = function(flag, callFunc) {
          void 0 === flag && (flag = true);
          _this._listenTrigger(flag, callFunc);
        };
        _this.onTouchStartCallFunc = function(event) {
          _this._onTouchStartCallFunc(event);
        };
        _this.onTouchMoveCallFunc = function(event) {
          _this._onTouchMoveCallFunc(event);
        };
        _this.onTouchCancelCallFunc = function(event) {
          _this._onTouchCancelCallFunc(event);
        };
        _this.onTouchEndCallFunc = function(event) {
          _this._onTouchEndCallFunc(event);
        };
        _this.onKeyDownCallFunc = function(event) {
          _this._onKeyDownCallFunc(event);
        };
        _this.onKeyUpCallFunc = function(event) {
          _this._onKeyUpCallFunc(event);
        };
        _this.addMethod = function(func, isRepeat, array) {
          void 0 === isRepeat && (isRepeat = false);
          void 0 === array && (array = _this.updateMethodArray);
          var index = array.findIndex(function(b) {
            return b === func;
          });
          return isRepeat ? array.push(func) - 1 : index > -1 ? index : array.push(func) - 1;
        };
        _this.delMethod = function(func, array) {
          void 0 === array && (array = _this.updateMethodArray);
          var index = array.findIndex(function(b) {
            return b === func;
          });
          return array.splice(index, 1)[0];
        };
        _this.methodArrayHandler = function(array) {
          void 0 === array && (array = _this.updateMethodArray);
          var param = [];
          for (var _i = 1; _i < arguments.length; _i++) param[_i - 1] = arguments[_i];
          for (var _a = 0, array_1 = array; _a < array_1.length; _a++) {
            var func = array_1[_a];
            func instanceof Function && func && func(param);
          }
          return array.length;
        };
        _this.addOperationMethod = function(key, value) {
          if (_this.operationMethodMap.has(key)) return _this.operationMethodMap.get(key);
          _this.operationMethodMap.set(key, value);
          return value;
        };
        _this.delOperationMethod = function(key) {
          if (_this.operationMethodMap.has(key)) {
            var result = _this.operationMethodMap.delete(key);
            return result;
          }
          return false;
        };
        _this.getOperationMehotdByKey = function(key) {
          if (_this.operationMethodMap.has(key)) return _this.operationMethodMap.get(key);
          return -1;
        };
        _this.initOperationMethodMap = function() {
          _this._initOperationMethodMap();
        };
        _this.initUpdateMethodArray = function() {
          _this._initUpdateMethodArray();
        };
        _this.initCollision = function(node, group, tag, callFunc, type, width, height, name) {
          void 0 === type && (type = CollisionController_1.default.COLLISION_BOX_ENUM.RECT);
          width = width || node.width, height = height || node.height;
          CollisionController_1.default.createCollision(type, node, function(collisionNode, collision) {
            collision.tag = tag || 0;
            collisionNode.rIns = _this;
            collisionNode.group = group;
            collisionNode.addComponent("ColliderC");
            node.addChild(collisionNode);
            _this._initCollision(node, callFunc, collisionNode, collision);
          }, width, height, name);
        };
        _this.collisionHandler = function(type, other, self) {
          switch (type) {
           case "enter":
            _this.collisionEnterHandler(other, self);
            break;

           case "stay":
            _this.collisionStayHandler(other, self);
            break;

           case "exit":
            _this.collisionExitHandler(other, self);
            break;

           default:
            cc.log("collision handler ", type, " not find.");
          }
        };
        _this.collisionEnterHandler = function(other, self) {
          var tag = other.tag;
          switch (tag) {
           case CollisionController_1.default.COLLISION_TAG_ENUM.WALL:
            _this.wallCollisionEnterCallFunc(other, self);
            break;

           case CollisionController_1.default.COLLISION_TAG_ENUM.ROLE:
            _this.roleCollisionEnterCallFunc(other, self);
            break;

           default:
            cc.log("no '" + tag + "' type collision enter callFunc.");
          }
        };
        _this.collisionStayHandler = function(other, self) {
          var tag = other.tag;
          switch (tag) {
           case CollisionController_1.default.COLLISION_TAG_ENUM.WALL:
            _this.wallCollisionStayCallFunc(other, self);
            break;

           default:
            cc.log("no '" + tag + "' type collision stay callFunc.");
          }
        };
        _this.collisionExitHandler = function(other, self) {
          var tag = other.tag;
          switch (tag) {
           case CollisionController_1.default.COLLISION_TAG_ENUM.WALL:
            _this.wallCollisionExitCallFunc(other, self);
            break;

           default:
            cc.log("no '" + tag + "' type collision exit callFunc.");
          }
        };
        _this.wallCollisionEnterCallFunc = function(other, self) {
          _this._wallCollisionEnterCallFunc(other, self);
        };
        _this.wallCollisionStayCallFunc = function(other, self) {};
        _this.wallCollisionExitCallFunc = function(other, self) {};
        _this.roleCollisionEnterCallFunc = function(other, self) {
          _this._roleCollisionEnterCallFunc(other, self);
        };
        _this._onTouchStartCallFunc = function(event) {};
        _this._onTouchMoveCallFunc = function(event) {};
        _this._onTouchCancelCallFunc = function(event) {};
        _this._onTouchEndCallFunc = function(event) {};
        _this._onKeyDownCallFunc = function(event) {};
        _this._onKeyUpCallFunc = function(event) {};
        _this._listenTrigger = function(flag, callFunc) {};
        _this._initOperationMethodMap = function() {};
        _this._initUpdateMethodArray = function() {};
        _this._initCollision = function(node, callFunc, colNode, collision) {};
        _this._wallCollisionEnterCallFunc = function(other, self) {};
        _this._roleCollisionEnterCallFunc = function(other, self) {};
        return _this;
      }
      ObjectC.prototype.onLoad = function() {
        this.initIns();
        this.initKeycodMap();
        this._onLoad();
      };
      ObjectC.prototype.setState = function(state) {
        this._state = state;
      };
      ObjectC.prototype.deployHandler = function(type, node, url, callFunc) {
        switch (type) {
         case this.DEPLOY_TYPE_ENUM.SPINE:
          this.deploySpine(node, url, callFunc);
          break;

         case this.DEPLOY_TYPE_ENUM.SPRITE:
          this.deploySprite(node, url, callFunc);
          break;

         case this.DEPLOY_TYPE_ENUM.MATERIAL:
          this.deployMaterial(node, url, callFunc);
        }
      };
      ObjectC.prototype.onCollisionEnter = function(other, self) {
        this.collisionHandler("enter", other, self);
      };
      ObjectC.prototype.onCollisionStay = function(other, self) {
        this.collisionHandler("stay", other, self);
      };
      ObjectC.prototype.onCollisionExit = function(other, self) {
        this.collisionHandler("exit", other, self);
      };
      ObjectC.prototype._onLoad = function() {};
      ObjectC.ins = null;
      ObjectC = __decorate([ ccclass ], ObjectC);
      return ObjectC;
    }(cc.Component);
    exports.default = ObjectC;
    cc._RF.pop();
  }, {
    "../controller/CollisionController": "CollisionController"
  } ],
  PolygonUtils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e7502eF3hREmLNGzfwO/Z/G", "PolygonUtils");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.PolygonUtil = void 0;
    var PolygonUtil = function() {
      function PolygonUtil() {}
      PolygonUtil.splitPolygonByLine = function(l0, l1, polygon, useDichotomy) {
        void 0 === useDichotomy && (useDichotomy = false);
        var result = [];
        for (var i = polygon.length - 1; i >= 0; i--) {
          var p0 = polygon[i], p1 = 0 == i ? polygon[polygon.length - 1] : polygon[i - 1];
          var _a = this.lineCrossPoint(p0, p1, l0, l1), n = _a[0], p = _a[1];
          if (-1 == n) continue;
          polygon.splice(i, -1, p);
          result.push(i + 1);
        }
        return result;
      };
      PolygonUtil.lineCrossPoint = function(p1, p2, q1, q2) {
        var a = p1, b = p2, c = q1, d = q2;
        var s1, s2, s3, s4;
        var d1, d2, d3, d4;
        var p = new cc.Vec2(0, 0);
        d1 = this.dblcmp(s1 = this.ab_cross_ac(a, b, c), 0);
        d2 = this.dblcmp(s2 = this.ab_cross_ac(a, b, d), 0);
        d3 = this.dblcmp(s3 = this.ab_cross_ac(c, d, a), 0);
        d4 = this.dblcmp(s4 = this.ab_cross_ac(c, d, b), 0);
        if (-2 == (d1 ^ d2) && -2 == (d3 ^ d4)) {
          p.x = (c.x * s2 - d.x * s1) / (s2 - s1);
          p.y = (c.y * s2 - d.y * s1) / (s2 - s1);
          return [ 0, p ];
        }
        if (0 == d1 && this.point_on_line(c, a, b) <= 0) {
          p = c;
          return [ 1, p ];
        }
        if (0 == d2 && this.point_on_line(d, a, b) <= 0) {
          p = d;
          return [ 1, p ];
        }
        if (0 == d3 && this.point_on_line(a, c, d) <= 0) {
          p = a;
          return [ 1, p ];
        }
        if (0 == d4 && this.point_on_line(b, c, d) <= 0) {
          p = b;
          return [ 1, p ];
        }
        return [ -1, null ];
      };
      PolygonUtil.isLineSegmentCross = function(P1, P2, Q1, Q2) {
        if (((Q1.x - P1.x) * (Q1.y - Q2.y) - (Q1.y - P1.y) * (Q1.x - Q2.x)) * ((Q1.x - P2.x) * (Q1.y - Q2.y) - (Q1.y - P2.y) * (Q1.x - Q2.x)) < 0 || ((P1.x - Q1.x) * (P1.y - P2.y) - (P1.y - Q1.y) * (P1.x - P2.x)) * ((P1.x - Q2.x) * (P1.y - P2.y) - (P1.y - Q2.y) * (P1.x - P2.x)) < 0) return true;
        return false;
      };
      PolygonUtil.point_on_line = function(a, p1, p2) {
        return this.dblcmp(this.dot(p1.x - a.x, p1.y - a.y, p2.x - a.x, p2.y - a.y), 0);
      };
      PolygonUtil.rayPointToLine = function(point, linePA, linePB) {
        var minX = Math.min(linePA.x, linePB.x);
        var maxX = Math.max(linePA.x, linePB.x);
        var minY = Math.min(linePA.y, linePB.y);
        var maxY = Math.max(linePA.y, linePB.y);
        if (point.y < minY || point.y > maxY || point.x > maxX) return -1;
        var x0 = linePA.x + (linePB.x - linePA.x) / (linePB.y - linePA.y) * (point.y - linePA.y);
        if (x0 > point.x) return 0;
        if (x0 == point.x) return 1;
        return -1;
      };
      PolygonUtil.relationPointToPolygon = function(point, polygon) {
        var count = 0;
        for (var i = 0; i < polygon.length; ++i) {
          if (polygon[i].equals(point)) return 2;
          var pa = polygon[i];
          var pb = polygon[0];
          i < polygon.length - 1 && (pb = polygon[i + 1]);
          var re = this.rayPointToLine(point, pa, pb);
          if (1 == re) return 1;
          0 == re && count++;
        }
        if (count % 2 == 0) return -1;
        return 0;
      };
      PolygonUtil.lineCutPolygon = function(pa, pb, polygon) {
        var ret = [];
        var points = [];
        var pointIndex = [];
        for (var i = 0; i < polygon.length; ++i) {
          points.push(polygon[i]);
          var a = polygon[i];
          var b = polygon[0];
          i < polygon.length - 1 && (b = polygon[i + 1]);
          var c = this.lineCrossPoint(pa, pb, a, b);
          if (0 == c[0]) {
            pointIndex.push(points.length);
            points.push(c[1]);
          } else c[0] > 0 && (c[1].equals(a) ? pointIndex.push(points.length - 1) : pointIndex.push(points.length));
        }
        if (pointIndex.length > 1) {
          var cp0 = points[pointIndex[0]];
          var cp1 = points[pointIndex[1]];
          var r = this.relationPointToPolygon(new cc.Vec2((cp0.x + cp1.x) / 2, (cp0.y + cp1.y) / 2), polygon);
          var inPolygon = r >= 0;
          if (pointIndex.length > 2 && cp0.sub(cp1).mag() > cp0.sub(points[pointIndex[pointIndex.length - 1]]).mag()) {
            cp1 = points[pointIndex[pointIndex.length - 1]];
            r = this.relationPointToPolygon(new cc.Vec2((cp0.x + cp1.x) / 2, (cp0.y + cp1.y) / 2), polygon);
            inPolygon = r < 0;
          }
          var firstInPolygon = inPolygon;
          var index = 0;
          var startIndex = pointIndex[index];
          var oldPoints = [];
          var newPoints = [];
          var count = 0;
          oldPoints.push(points[startIndex]);
          inPolygon ? newPoints.push(points[startIndex]) : cc.log("i am out.");
          index++;
          count++;
          startIndex++;
          while (count < points.length) {
            startIndex == points.length && (startIndex = 0);
            var p = points[startIndex];
            if (index >= 0 && startIndex == pointIndex[index]) {
              index++;
              index >= pointIndex.length && (index = 0);
              if (inPolygon) {
                newPoints.push(p);
                ret.push(newPoints);
                newPoints = [];
              } else {
                newPoints = [];
                newPoints.push(p);
              }
              oldPoints.push(p);
              inPolygon = !inPolygon;
            } else inPolygon ? newPoints.push(p) : oldPoints.push(p);
            startIndex++;
            count++;
          }
          if (inPolygon) if (!firstInPolygon && newPoints.length > 1) {
            newPoints.push(points[pointIndex[0]]);
            ret.push(newPoints);
          } else {
            cc.log(newPoints);
            for (var i = 0; i < newPoints.length; ++i) oldPoints.push(newPoints[i]);
          }
          ret.push(oldPoints);
        }
        return ret;
      };
      PolygonUtil.ab_cross_ac = function(a, b, c) {
        return this.cross(b.x - a.x, b.y - a.y, c.x - a.x, c.y - a.y);
      };
      PolygonUtil.dot = function(x1, y1, x2, y2) {
        return x1 * x2 + y1 * y2;
      };
      PolygonUtil.cross = function(x1, y1, x2, y2) {
        return x1 * y2 - x2 * y1;
      };
      PolygonUtil.dblcmp = function(a, b) {
        if (Math.abs(a - b) <= 1e-6) return 0;
        return a > b ? 1 : -1;
      };
      PolygonUtil.getReflectPointByPointAndLine = function(point, p1, p2) {
        var vec_r = cc.v2(0, 0);
        var a1 = (p2.y - p1.y) / (p2.x - p1.x);
        var b1 = p2.y - a1 * p2.x;
        var a2 = -1 / a1;
        var b2 = point.y - a2 * point.x;
        var returnX = ((a1 - a2) * point.x + 2 * b1 - 2 * b2) / (a2 - a1);
        var returnY = ((a1 - a2) * point.y - 2 * a1 * b2 + 2 * a2 * b1) / (a2 - a1);
        return cc.v2(returnX, returnY);
      };
      return PolygonUtil;
    }();
    exports.PolygonUtil = PolygonUtil;
    cc._RF.pop();
  }, {} ],
  PrefabC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a9aae7KRjZCKbcV4v8L12aQ", "PrefabC");
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
    var ObjectC_1 = require("./ObjectC");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var PrefabC = function(_super) {
      __extends(PrefabC, _super);
      function PrefabC() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      PrefabC = __decorate([ ccclass ], PrefabC);
      return PrefabC;
    }(ObjectC_1.default);
    exports.default = PrefabC;
    cc._RF.pop();
  }, {
    "./ObjectC": "ObjectC"
  } ],
  RayCollisionComp: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "17980C0aVxETqpQKV/RE5nJ", "RayCollisionComp");
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
    var SceneC_1 = require("../SceneC");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var RayCollisionComp = function(_super) {
      __extends(RayCollisionComp, _super);
      function RayCollisionComp() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.targetNode = null;
        return _this;
      }
      RayCollisionComp.prototype._onLoad = function() {};
      __decorate([ property({
        displayName: "\u76ee\u6807\u8282\u70b9"
      }) ], RayCollisionComp.prototype, "targetNode", void 0);
      RayCollisionComp = __decorate([ ccclass ], RayCollisionComp);
      return RayCollisionComp;
    }(SceneC_1.default);
    exports.default = RayCollisionComp;
    cc._RF.pop();
  }, {
    "../SceneC": "SceneC"
  } ],
  RoleController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "16849YyCXdFPIPURF8s7Kob", "RoleController");
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
    var GameController_1 = require("./GameController");
    var Hero_1 = require("../model/role/Hero");
    var Controller_1 = require("./Controller");
    var MathUtiles_1 = require("../lib/MathUtiles");
    var Bullet_1 = require("../model/bullet/Bullet");
    var RoleController = function(_super) {
      __extends(RoleController, _super);
      function RoleController() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      RoleController.GetHeroById = function(id) {
        var roleInfo = JSON.parse(JSON.stringify(GameController_1.default.GameDataMap.get(id)));
        var role = new Hero_1.default(roleInfo);
        this._deployEquip(role);
        this._deploySkill(role);
        return role;
      };
      RoleController.UpdateHeroByHero = function(role) {};
      RoleController._deployEquip = function(role) {};
      RoleController._deploySkill = function(role) {};
      RoleController.getBulletByRole = function(role) {
        var bulletArray = role.getBullet();
        var bulletStateArray = role.getBulletState();
        var cBulletArray = new Array();
        var cBulletStateArray = [];
        for (var _i = 0, bulletArray_1 = bulletArray; _i < bulletArray_1.length; _i++) {
          var elm = bulletArray_1[_i];
          var randomNum = MathUtiles_1.default.Random(elm.mix, elm.max);
          randomNum <= elm.value + 100 * role.getLuck() && cBulletArray.push(elm);
        }
        for (var _a = 0, bulletStateArray_1 = bulletStateArray; _a < bulletStateArray_1.length; _a++) {
          var elm = bulletStateArray_1[_a];
          var randomNum = MathUtiles_1.default.Random(elm.mix, elm.max);
          randomNum <= elm.value + 100 * role.getLuck() && cBulletStateArray.push(elm);
        }
        var bulletInfo = JSON.parse(JSON.stringify(GameController_1.default.GameDataMap.get(bulletArray[bulletArray.length - 1].id)));
        var bullet = new Bullet_1.default(bulletInfo);
        bullet.speed = role.getBulletSpeed();
        bullet.moveDis = role.getAtkRange();
        bullet.state = cBulletStateArray;
        return bullet;
      };
      return RoleController;
    }(Controller_1.default);
    exports.default = RoleController;
    cc._RF.pop();
  }, {
    "../lib/MathUtiles": "MathUtiles",
    "../model/bullet/Bullet": "Bullet",
    "../model/role/Hero": "Hero",
    "./Controller": "Controller",
    "./GameController": "GameController"
  } ],
  Role: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "79bc6OjMG9GQKTTVy0a2843", "Role");
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
    var ObjectBase_1 = require("../ObjectBase");
    var Role = function(_super) {
      __extends(Role, _super);
      function Role(param) {
        var _this = _super.call(this) || this;
        _this.id = param.id || "";
        _this.skin = param.skin || "";
        _this.component = param.component || "";
        _this.name = param.name || "";
        _this.description = param.description || "";
        _this.atk_type = param.atk_type || "";
        _this.atk_direction_type = param.atk_direction_type || "";
        _this.bullet_num = param.bullet_num || 0;
        _this.unit_bullet_num = param.unit_bullet_num || 0;
        _this.type = param.type || [];
        _this.dmg = param.dmg || null;
        _this.dfs = param.dfs || null;
        _this.hp = param.hp || null;
        _this.mp = param.mp || null;
        _this.bullet = param.bullet || [];
        _this.bullet_state = param.bullet_state || [];
        _this.bullet_speed = param.bullet_speed || null;
        _this.atk_speed = param.atk_speed || null;
        _this.atk_range = param.atk_range || null;
        _this.luck = param.luck || null;
        _this.speed = param.speed || null;
        _this.moveTiled = param.moveTiled || [];
        return _this;
      }
      Role.prototype.getId = function() {
        return this.id;
      };
      Role.prototype.setId = function(value) {
        this.id = value;
      };
      Role.prototype.getSkin = function() {
        return this.skin;
      };
      Role.prototype.setSkin = function(value) {
        this.skin = value;
      };
      Role.prototype.getComponent = function() {
        return this.component;
      };
      Role.prototype.setComponent = function(value) {
        this.component = value;
      };
      Role.prototype.getName = function() {
        return this.name;
      };
      Role.prototype.setName = function(value) {
        this.name = value;
      };
      Role.prototype.getDescription = function() {
        return this.description;
      };
      Role.prototype.setDescription = function(value) {
        this.description = value;
      };
      Role.prototype.getAtkType = function() {
        return this.atk_type;
      };
      Role.prototype.setAtkType = function(value) {
        this.atk_type = value;
      };
      Role.prototype.getAtkDirectionType = function() {
        return this.atk_direction_type;
      };
      Role.prototype.setAtkDirectionType = function(value) {
        this.atk_direction_type = value;
      };
      Role.prototype.getBulletNum = function() {
        return this.bullet_num;
      };
      Role.prototype.setBulletNum = function(value) {
        this.bullet_num = value;
      };
      Role.prototype.getUnitBulletNum = function() {
        return this.unit_bullet_num;
      };
      Role.prototype.setUnitBulletNum = function(value) {
        this.unit_bullet_num = value;
      };
      Role.prototype.getType = function() {
        return this.type;
      };
      Role.prototype.setType = function(value) {
        this.type = value;
      };
      Role.prototype.getDmg = function() {
        return this.dmg.value;
      };
      Role.prototype.setDmg = function(value) {
        value > this.dmg.max ? this.dmg.value = this.dmg.max : value < this.dmg.min ? this.dmg.value = this.dmg.min : this.dmg.value = value;
      };
      Role.prototype.getDfs = function() {
        return this.dfs.value;
      };
      Role.prototype.setDfs = function(value) {
        value > this.dfs.max ? this.dfs.value = this.dfs.max : value < this.dfs.min ? this.dfs.value = this.dfs.min : this.dfs.value = value;
      };
      Role.prototype.getHp = function() {
        return this.hp.value;
      };
      Role.prototype.setHp = function(value) {
        value > this.hp.max ? this.hp.value = this.hp.max : value < this.hp.min ? this.hp.value = this.hp.min : this.hp.value = value;
      };
      Role.prototype.getMp = function() {
        return this.mp.value;
      };
      Role.prototype.setMp = function(value) {
        value > this.mp.max ? this.mp.value = this.mp.max : value < this.mp.min ? this.mp.value = this.mp.min : this.mp.value = value;
      };
      Role.prototype.getBullet = function() {
        return this.bullet;
      };
      Role.prototype.setBullet = function(value) {
        this.bullet = value;
      };
      Role.prototype.getBulletState = function() {
        return this.bullet_state;
      };
      Role.prototype.setBulletState = function(value) {
        this.bullet_state = value;
      };
      Role.prototype.getBulletSpeed = function() {
        return this.bullet_speed.value;
      };
      Role.prototype.setBulletSpeed = function(value) {
        value > this.bullet_speed.max ? this.bullet_speed.value = this.bullet_speed.max : value < this.bullet_speed.min ? this.bullet_speed.value = this.bullet_speed.min : this.bullet_speed.value = value;
      };
      Role.prototype.getAtkSpeed = function() {
        return this.atk_speed.value;
      };
      Role.prototype.setAtkSpeed = function(value) {
        value > this.atk_speed.max ? this.atk_speed.value = this.atk_speed.max : value < this.atk_speed.min ? this.atk_speed.value = this.atk_speed.min : this.atk_speed.value = value;
      };
      Role.prototype.getAtkRange = function() {
        return this.atk_range.value;
      };
      Role.prototype.setAtkRange = function(value) {
        value > this.atk_range.max ? this.atk_range.value = this.atk_range.max : value < this.atk_range.min ? this.atk_range.value = this.atk_range.min : this.atk_range.value = value;
      };
      Role.prototype.getLuck = function() {
        return this.luck.value;
      };
      Role.prototype.setLuck = function(value) {
        value > this.luck.max ? this.luck.value = this.luck.max : value < this.luck.min ? this.luck.value = this.luck.min : this.luck.value = value;
      };
      Role.prototype.getSpeed = function() {
        return this.speed.value;
      };
      Role.prototype.setSpeed = function(value) {
        value > this.speed.max ? this.speed.value = this.speed.max : value < this.speed.min ? this.speed.value = this.speed.min : this.speed.value = value;
      };
      Role.prototype.getMoveTiled = function() {
        return this.moveTiled;
      };
      Role.prototype.setMoveTiled = function(value) {
        this.moveTiled = value;
      };
      return Role;
    }(ObjectBase_1.default);
    exports.default = Role;
    cc._RF.pop();
  }, {
    "../ObjectBase": "ObjectBase"
  } ],
  SceneController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5246aX8HmNF8aLFHqAB0hsP", "SceneController");
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
    var Controller_1 = require("./Controller");
    var SceneController = function(_super) {
      __extends(SceneController, _super);
      function SceneController() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      SceneController.SwitchScene = function(name, callFunc, progressCall) {
        var _this = this;
        try {
          cc.log("> switch scene " + name + " start.");
          cc.log(">> preload scene " + name + " start.");
          cc.director.preloadScene(this.SCENES_NAME_ENUM.LOAD, function(err) {
            if (err) {
              cc.log(err);
              return;
            }
            cc.director.loadScene(_this.SCENES_NAME_ENUM.LOAD, function() {
              cc.director.preloadScene(name, function(completedCount, totalCount, item) {
                var progress = completedCount / totalCount;
                var loadingProgress = cc.director.getScene().getChildByName("Canvas").ins.loadProgressBar;
                loadingProgress.getComponent(cc.ProgressBar).progress = progress;
                progressCall && progressCall(completedCount, totalCount, item);
              }, function(err, asset) {
                if (err) {
                  cc.log(err);
                  return;
                }
                cc.log(">> preload scene " + name + " compeleted.");
                cc.log(">>> load scene " + name + " start.");
                _this._switchSceneHandler(asset, callFunc);
              });
            });
          });
        } catch (error) {
          cc.log(error);
        }
      };
      SceneController._switchSceneHandler = function(asset, callFunc) {
        if (!asset || !asset.name) return;
        asset.name;
        this._switchScene(asset, callFunc);
      };
      SceneController._switchScene = function(asset, callFunc) {
        cc.director.loadScene(asset.name, function() {
          cc.log(">>> load scene " + asset.name + " compelet.");
          cc.log("> switch scene " + asset.name + " compelet.");
          callFunc && callFunc();
        });
      };
      SceneController._switchToHallScene = function(asset, callFunc) {
        cc.director.loadScene(asset.name, function() {
          cc.log(">>> load scene " + asset.name + " compelet.");
          cc.log("> switch scene " + asset.name + " compelet.");
          callFunc && callFunc();
        });
      };
      SceneController.SCENES_NAME_ENUM = cc.Enum({
        DEFAULT: "hall",
        LOAD: "load",
        BATTLE: "battle"
      });
      return SceneController;
    }(Controller_1.default);
    exports.default = SceneController;
    cc._RF.pop();
  }, {
    "./Controller": "Controller"
  } ],
  SceneC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7b065EomTZJaaOKzA13RxSp", "SceneC");
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
    var ObjectC_1 = require("./ObjectC");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var SceneC = function(_super) {
      __extends(SceneC, _super);
      function SceneC() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      SceneC = __decorate([ ccclass ], SceneC);
      return SceneC;
    }(ObjectC_1.default);
    exports.default = SceneC;
    cc._RF.pop();
  }, {
    "./ObjectC": "ObjectC"
  } ],
  ShadowViewC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "81a54q+e+5NFISjVxAH2W/l", "ShadowViewC");
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
    var SceneC_1 = require("../SceneC");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MainC = function(_super) {
      __extends(MainC, _super);
      function MainC() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.player = null;
        _this.wall = null;
        _this.graphics = null;
        _this.mask = null;
        _this._rayNum = 720;
        _this._rayRadiu = 1e3;
        _this._lightVertsArray = new Array();
        return _this;
      }
      Object.defineProperty(MainC.prototype, "sex", {
        get: function() {
          return this._sex;
        },
        set: function(value) {
          this._sex = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(MainC.prototype, "age", {
        get: function() {
          return this._age;
        },
        set: function(v) {
          this._age = v;
          cc.log("use func");
        },
        enumerable: false,
        configurable: true
      });
      MainC.prototype.update = function(dt) {
        this.renderSightArea();
      };
      MainC.prototype.onLoad = function() {
        var _this = this;
        cc.director.getPhysicsManager().enabled = true;
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event) {
          var pos = event.getLocation();
          _this.node.convertToNodeSpaceAR(pos, pos);
          _this.player.setPosition(pos);
        }, this);
        this.scheduleOnce(function() {
          _this.player.runAction(cc.sequence(cc.moveBy(.6, cc.v2(0, -500)), cc.moveBy(.6, cc.v2(-500, 0)), cc.moveBy(.6, cc.v2(0, 350)), cc.moveBy(.6, cc.v2(500, 0)), cc.moveBy(.9, cc.v2(0, 350))));
        }, 3);
      };
      MainC.prototype.renderSightArea = function() {
        var p1 = this.player.position;
        p1 = this.node.convertToWorldSpaceAR(p1);
        this.drawRayByNum(p1);
        this.renderMask();
      };
      MainC.prototype.drawRayByNum = function(p1) {
        var unitRd = 2 * Math.PI / this._rayNum;
        this._lightVertsArray = new Array();
        for (var i = 0; i < this._rayNum; i++) {
          var p3 = cc.v2(Math.cos(i * unitRd) * this._rayRadiu + p1.x, Math.sin(i * unitRd) * this._rayRadiu + p1.y);
          var physicsManager = cc.director.getPhysicsManager();
          var result = physicsManager.rayCast(p1, p3, cc.RayCastType.Closest);
          result.length > 0 && (p3 = result[0].point);
          this._lightVertsArray.push(p3);
        }
      };
      MainC.prototype.renderMask = function() {
        var _this = this;
        var potArr = this._lightVertsArray;
        this.mask._updateGraphics = function() {
          var graphics = _this.mask._graphics;
          graphics.clear(false);
          graphics.lineWidth = 10;
          graphics.fillColor.fromHEX("#ff0000");
          graphics.moveTo(potArr[0].x, potArr[0].y);
          for (var i = 1; i < potArr.length; i++) {
            var p = potArr[i];
            graphics.lineTo(p.x, p.y);
          }
          graphics.close();
          graphics.stroke();
          graphics.fill();
        };
        this.mask._updateGraphics();
      };
      __decorate([ property({
        displayName: "\u73a9\u5bb6\u8282\u70b9",
        type: cc.Node
      }) ], MainC.prototype, "player", void 0);
      __decorate([ property({
        displayName: "\u969c\u788d\u7269",
        type: cc.Node
      }) ], MainC.prototype, "wall", void 0);
      __decorate([ property({
        displayName: "\u7ed8\u56fe\u8282\u70b9",
        type: cc.Node
      }) ], MainC.prototype, "graphics", void 0);
      __decorate([ property({
        displayName: "\u906e\u7f69\u8282\u70b9",
        type: cc.Mask
      }) ], MainC.prototype, "mask", void 0);
      MainC = __decorate([ ccclass ], MainC);
      return MainC;
    }(SceneC_1.default);
    exports.default = MainC;
    cc._RF.pop();
  }, {
    "../SceneC": "SceneC"
  } ],
  SliderBtnComp: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9e95arLPSZMn6lDyPxJ4ha7", "SliderBtnComp");
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
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var SliderBtnComp = function(_super) {
      __extends(SliderBtnComp, _super);
      function SliderBtnComp() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      SliderBtnComp.prototype.onLoad = function() {};
      SliderBtnComp.prototype.test = function() {
        cc.log("here");
      };
      SliderBtnComp = __decorate([ ccclass ], SliderBtnComp);
      return SliderBtnComp;
    }(cc.Component);
    exports.default = SliderBtnComp;
    cc._RF.pop();
  }, {} ],
  SpineController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6124bYGXWNNUZLDdt4A7qTA", "SpineController");
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
    var Controller_1 = require("./Controller");
    var SpineController = function(_super) {
      __extends(SpineController, _super);
      function SpineController() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      return SpineController;
    }(Controller_1.default);
    exports.default = SpineController;
    cc._RF.pop();
  }, {
    "./Controller": "Controller"
  } ],
  StateBase: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "05b2aMYAQ5No7dEnHSNV70o", "StateBase");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var StateBase = function() {
      function StateBase() {}
      StateBase.prototype.actionOne = function(node) {};
      StateBase.prototype.clickHandler = function(event, node, callFunc, target) {
        callFunc && callFunc.call(target, 2);
        return;
      };
      StateBase.prototype.initShow = function(node, callFunc, target) {};
      return StateBase;
    }();
    exports.default = StateBase;
    cc._RF.pop();
  }, {} ],
  StateController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6a139Nn+6JBLqQuxRokRWFW", "StateController");
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
    var Controller_1 = require("./Controller");
    var StateController = function(_super) {
      __extends(StateController, _super);
      function StateController() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      StateController.setState = function() {};
      return StateController;
    }(Controller_1.default);
    exports.default = StateController;
    cc._RF.pop();
  }, {
    "./Controller": "Controller"
  } ],
  StateFuncC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ac0e39exoZJspyOp9qXwz8/", "StateFuncC");
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
    var ViewModel_1 = require("../../lib/mvvm/ViewModel");
    var SceneC_1 = require("../SceneC");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var StateFuncC = function(_super) {
      __extends(StateFuncC, _super);
      function StateFuncC() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.editBox = null;
        _this.info = null;
        _this.riceInfo = null;
        _this.data = {
          id: 100,
          name: "wck",
          hpMax: 100,
          hpMin: 0,
          hp: 50
        };
        _this._infoText = "1";
        return _this;
      }
      Object.defineProperty(StateFuncC.prototype, "infoText", {
        get: function() {
          return this._infoText;
        },
        set: function(value) {
          this.info.string = value;
          this._infoText = value;
        },
        enumerable: false,
        configurable: true
      });
      StateFuncC.prototype.onLoad = function() {
        ViewModel_1.VM.add(this.data, "gb");
        this.fsm = new StateMachine({
          init: "none",
          transitions: [ {
            name: "normal",
            from: "normal",
            to: "invalid"
          } ],
          methods: {
            onBeforeTransition: function(lifecycle) {
              cc.log("BEFORE: " + lifecycle.transition, true);
            },
            onLeaveState: function(lifecycle) {
              cc.log("LEAVE: " + lifecycle.from);
            },
            onEnterState: function(lifecycle) {
              cc.log("ENTER: " + lifecycle.to);
            },
            onAfterTransition: function(lifecycle) {
              cc.log("AFTER: " + lifecycle.transition);
            },
            onTransition: function(lifecycle) {
              cc.log("DURING: " + lifecycle.transition + " (from " + lifecycle.from + " to " + lifecycle.to + ")");
            }
          }
        });
      };
      StateFuncC.prototype.start = function() {
        var _this = this;
        this.scheduleOnce(function() {
          _this.infoText = "hello world.";
        }, 3);
        var str = this.changeRiceInfo("wck");
      };
      StateFuncC.prototype.changeRiceInfoBak = function(arg) {
        var str = "<color=yellow>wck</c><color=red>\u6211\u7231\u4f60</c>\u5df4\u62c9\u5df4\u62c9\u5df4\u62c9";
        var charArr = str.replace(/<.+?\/?>/g, "").split("");
        var tempStrArr = [ str ];
        for (var i = charArr.length; i > 1; i--) {
          var curStr = tempStrArr[charArr.length - i];
          var lastIdx = curStr.lastIndexOf(charArr[i - 1]);
          var prevStr = curStr.slice(0, lastIdx);
          var nextStr = curStr.slice(lastIdx + 1, curStr.length);
          tempStrArr.push(prevStr + nextStr);
        }
        console.log(tempStrArr);
        cc.log(charArr);
        return arg;
      };
      StateFuncC.prototype.changeRiceInfo = function(arg) {
        var _this = this;
        var str = "<color=yellow>wck</c><color=red>\u6211\u7231\u4f60</c>\u5df4\u62c9\u5df4\u62c9\u5df4\u62c9\n \u5c0f\u5317\u662f\u4e2a\u61a8\u61a8";
        var temp = "";
        var jump = true;
        var firstArr = [];
        var charArr = str.replace(/<.+?\/?>/g, "").split("");
        for (var _i = 0, str_1 = str; _i < str_1.length; _i++) {
          var char = str_1[_i];
          if ("<" == char) {
            jump = false;
            temp = "";
          }
          jump && firstArr.push(char);
          jump || (temp += char);
          if (">" == char) {
            firstArr.push(temp);
            jump = true;
          }
        }
        var printArr = [];
        printArr.push(firstArr.join(""));
        for (var i = charArr.length - 1; i > 0; i--) {
          var testChar = charArr[i];
          for (var j = firstArr.length; j > 0; j--) {
            var char = firstArr[j];
            if (char === testChar) {
              firstArr.splice(j, 1);
              printArr.push(firstArr.join(""));
              break;
            }
          }
        }
        var printRvArr = printArr.reverse();
        this.schedule(function() {
          _this.riceInfo.string = "";
          _this.riceInfo.string += printRvArr.shift();
        }, .2, printRvArr.length - 1);
        return arg;
      };
      StateFuncC.prototype.changeInfoEditBox = function() {
        this.infoText = this.editBox.string;
      };
      __decorate([ property(cc.EditBox) ], StateFuncC.prototype, "editBox", void 0);
      __decorate([ property(cc.Label) ], StateFuncC.prototype, "info", void 0);
      __decorate([ property({
        type: cc.RichText,
        displayName: "\u5bcc\u6587\u672c"
      }) ], StateFuncC.prototype, "riceInfo", void 0);
      StateFuncC = __decorate([ ccclass ], StateFuncC);
      return StateFuncC;
    }(SceneC_1.default);
    exports.default = StateFuncC;
    cc._RF.pop();
  }, {
    "../../lib/mvvm/ViewModel": "ViewModel",
    "../SceneC": "SceneC"
  } ],
  StringFormat: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "85fe8Gc6h5Ava+JsdbBs8cR", "StringFormat");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.StringFormatFunction = void 0;
    var StringFormat = function() {
      function StringFormat() {}
      StringFormat.prototype.deal = function(value, format) {
        if ("" === format) return value;
        format = format.toLowerCase().trim();
        var match_func = format.match(/^[a-z|A-Z]+/gi);
        var match_num = format.match(/\d+$/gi);
        var func = "";
        var num;
        var res = "";
        match_func && (func = match_func[0]);
        match_num && (num = parseInt(match_num[0]));
        if ("number" == typeof value) switch (func) {
         case "int":
          res = this.int(value);
          break;

         case "fix":
          res = this.fix(value, num);
          break;

         case "kmbt":
          res = this.KMBT(value);
          break;

         case "per":
          res = this.per(value, num);
          break;

         case "sep":
          res = this.sep(value);
        } else {
          switch (func) {
           case "limit":
            res = this.limit(value, num);
          }
          res = value;
        }
        return res;
      };
      StringFormat.prototype.sep = function(value) {
        var num = Math.round(value).toString();
        return num.replace(new RegExp("(\\d)(?=(\\d{3})+$)", "ig"), "$1,");
      };
      StringFormat.prototype.time_m = function(value) {};
      StringFormat.prototype.time_s = function(value) {};
      StringFormat.prototype.time_ms = function(value) {};
      StringFormat.prototype.timeStamp = function(value) {
        return new Date(value).toString();
      };
      StringFormat.prototype.per = function(value, fd) {
        return Math.round(100 * value).toFixed(fd);
      };
      StringFormat.prototype.int = function(value) {
        return Math.round(value);
      };
      StringFormat.prototype.fix = function(value, fd) {
        return value.toFixed(fd);
      };
      StringFormat.prototype.limit = function(value, count) {
        return value.substring(0, count);
      };
      StringFormat.prototype.KMBT = function(value, lang) {
        void 0 === lang && (lang = "en");
        var counts = [ 1e3, 1e6, 1e9, 1e12 ];
        var units = [ "", "K", "M", "B", "T" ];
        switch (lang) {
         case "zh":
          var counts_1 = [ 1e4, 1e8, 1e12, 1e16 ];
          var units_1 = [ "", "\u4e07", "\u4ebf", "\u5146", "\u4eac" ];
        }
        return this.compressUnit(value, counts, units, 2);
      };
      StringFormat.prototype.compressUnit = function(value, valueArr, unitArr, fixNum) {
        void 0 === fixNum && (fixNum = 2);
        var counts = valueArr;
        var units = unitArr;
        var res;
        var index;
        for (index = 0; index < counts.length; index++) {
          var e = counts[index];
          if (value < e) {
            res = index > 0 ? (value / counts[index - 1]).toFixed(fixNum) : value.toFixed(0);
            break;
          }
        }
        return res + units[index];
      };
      return StringFormat;
    }();
    exports.StringFormatFunction = new StringFormat();
    cc._RF.pop();
  }, {} ],
  Utiles: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9f4efjmPMpCsa+a7HP0gpCU", "Utiles");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Utiles = function() {
      function Utiles() {}
      Utiles.getInstance = function() {
        this.instance || (this.instance = new this());
        return this.instance;
      };
      return Utiles;
    }();
    exports.default = Utiles;
    cc._RF.pop();
  }, {} ],
  VMBase: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2f6f36IvUdPO7xynnVTPgzb", "VMBase");
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
    var ViewModel_1 = require("./ViewModel");
    var DEBUG_WATCH_PATH = false;
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var VMBase = function(_super) {
      __extends(VMBase, _super);
      function VMBase() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.watchPath = "";
        _this.watchPathArr = [];
        _this.templateMode = false;
        _this.templateValueArr = [];
        _this.VM = ViewModel_1.VM;
        return _this;
      }
      VMBase.prototype.onLoad = function() {
        var _this = this;
        false;
        var paths = this.watchPath.split(".");
        for (var i = 1; i < paths.length; i++) {
          var p = paths[i];
          if ("*" == p) {
            var index = this.node.getParent().children.findIndex(function(n) {
              return n === _this.node;
            });
            index <= 0 && (index = 0);
            paths[i] = index.toString();
            break;
          }
        }
        this.watchPath = paths.join(".");
        var pathArr = this.watchPathArr;
        if (pathArr.length >= 1) for (var i = 0; i < pathArr.length; i++) {
          var path = pathArr[i];
          var paths_1 = path.split(".");
          for (var i_1 = 1; i_1 < paths_1.length; i_1++) {
            var p = paths_1[i_1];
            if ("*" == p) {
              var index = this.node.getParent().children.findIndex(function(n) {
                return n === _this.node;
              });
              index <= 0 && (index = 0);
              paths_1[i_1] = index.toString();
              break;
            }
          }
          this.watchPathArr[i] = paths_1.join(".");
        }
        DEBUG_WATCH_PATH && true && cc.log("\u6240\u6709\u8def\u5f84", this.watchPath ? [ this.watchPath ] : this.watchPathArr, "<<", this.node.getParent().name + "." + this.node.name);
        "" == this.watchPath && "" == this.watchPathArr.join("") && cc.log("\u53ef\u80fd\u672a\u8bbe\u7f6e\u8def\u5f84\u7684\u8282\u70b9:", this.node.getParent().name + "." + this.node.name);
      };
      VMBase.prototype.onEnable = function() {
        false;
        this.templateMode ? this.setMultPathEvent(true) : "" != this.watchPath && this.VM.bindPath(this.watchPath, this.onValueChanged, this);
        this.onValueInit();
      };
      VMBase.prototype.onDisable = function() {
        false;
        this.templateMode ? this.setMultPathEvent(false) : "" != this.watchPath && this.VM.unbindPath(this.watchPath, this.onValueChanged, this);
      };
      VMBase.prototype.setMultPathEvent = function(enabled) {
        void 0 === enabled && (enabled = true);
        false;
        var arr = this.watchPathArr;
        for (var i = 0; i < arr.length; i++) {
          var path = arr[i];
          enabled ? this.VM.bindPath(path, this.onValueChanged, this) : this.VM.unbindPath(path, this.onValueChanged, this);
        }
      };
      VMBase.prototype.onValueInit = function() {};
      VMBase.prototype.onValueChanged = function(n, o, pathArr) {};
      VMBase = __decorate([ ccclass ], VMBase);
      return VMBase;
    }(cc.Component);
    exports.default = VMBase;
    cc._RF.pop();
  }, {
    "./ViewModel": "ViewModel"
  } ],
  VMCompsEdit: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2359eFXKF5HFYS74K7Y17/U", "VMCompsEdit");
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
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode, menu = _a.menu, help = _a.help;
    var ACTION_MODE;
    (function(ACTION_MODE) {
      ACTION_MODE[ACTION_MODE["SEARCH_COMPONENT"] = 0] = "SEARCH_COMPONENT";
      ACTION_MODE[ACTION_MODE["ENABLE_COMPONENT"] = 1] = "ENABLE_COMPONENT";
      ACTION_MODE[ACTION_MODE["REPLACE_WATCH_PATH"] = 2] = "REPLACE_WATCH_PATH";
      ACTION_MODE[ACTION_MODE["DELETE_COMPONENT"] = 3] = "DELETE_COMPONENT";
    })(ACTION_MODE || (ACTION_MODE = {}));
    var MVCompsEdit = function(_super) {
      __extends(MVCompsEdit, _super);
      function MVCompsEdit() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.findList = [ "VMBase", "VMParent" ];
        _this.actionType = ACTION_MODE.SEARCH_COMPONENT;
        _this.allowDelete = false;
        _this.targetPath = "game";
        _this.replacePath = "*";
        _this.canCollectNodes = false;
        _this.collectNodes = [];
        return _this;
      }
      Object.defineProperty(MVCompsEdit.prototype, "findTrigger", {
        get: function() {
          return false;
        },
        set: function(v) {
          this.setComponents(0);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(MVCompsEdit.prototype, "enableTrigger", {
        get: function() {
          return false;
        },
        set: function(v) {
          this.setComponents(1);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(MVCompsEdit.prototype, "disableTrigger", {
        get: function() {
          return false;
        },
        set: function(v) {
          this.setComponents(2);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(MVCompsEdit.prototype, "deleteTrigger", {
        get: function() {
          return false;
        },
        set: function(v) {
          this.setComponents(3);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(MVCompsEdit.prototype, "replaceTrigger", {
        get: function() {
          return false;
        },
        set: function(v) {
          this.setComponents(4);
        },
        enumerable: false,
        configurable: true
      });
      MVCompsEdit.prototype.onLoad = function() {
        true;
        var path = this.getNodePath(this.node);
        console.error("you forget delete MVEditFinder,[path]", path);
      };
      MVCompsEdit.prototype.setComponents = function(state) {
        var _this = this;
        var array = this.findList;
        var title = "\u641c\u7d22\u5230\u5f53\u524d\u8282\u70b9\u4e0b\u9762\u7684\u7ec4\u4ef6";
        switch (state) {
         case 0:
          title = "\u641c\u7d22\u5230\u5f53\u524d\u8282\u70b9\u4e0b\u9762\u7684\u7ec4\u4ef6";
          break;

         case 1:
          title = "\u6fc0\u6d3b\u4ee5\u4e0b\u8282\u70b9\u7684\u7ec4\u4ef6";
          break;

         case 2:
          title = "\u5173\u95ed\u4ee5\u4e0b\u8282\u70b9\u7684\u7ec4\u4ef6";
          break;

         case 3:
          title = "\u5220\u9664\u4ee5\u4e0b\u8282\u70b9\u7684\u7ec4\u4ef6";
          break;

         case 4:
          title = "\u66ff\u6362\u4ee5\u4e0b\u8282\u70b9\u7684\u8def\u5f84";
        }
        cc.log(title);
        cc.log("______________________");
        array.forEach(function(name) {
          _this.searchComponent(name, state);
        });
        cc.log("______________________");
      };
      MVCompsEdit.prototype.searchComponent = function(className, state) {
        var _this = this;
        void 0 === state && (state = 0);
        this.collectNodes = [];
        var comps = this.node.getComponentsInChildren(className);
        if (null == comps || comps.length < 1) return;
        cc.log("[" + className + "]:");
        comps.forEach(function(v) {
          var ext = "";
          state <= 3 && (ext = true === v.templateMode ? v.watchPathArr ? ":[Path:" + v.watchPathArr.join("|") + "]" : "" : v.watchPath ? ":[Path:" + v.watchPath + "]" : "");
          cc.log(_this.getNodePath(v.node) + ext);
          switch (state) {
           case 0:
            _this.canCollectNodes && -1 === _this.collectNodes.indexOf(v.node) && _this.collectNodes.push(v.node);
            break;

           case 1:
            v.enabled = true;
            break;

           case 2:
            v.enabled = false;
            break;

           case 3:
            v.node.removeComponent(v);
            break;

           case 4:
            var targetPath = _this.targetPath;
            var replacePath = _this.replacePath;
            if (true === v.templateMode) for (var i = 0; i < v.watchPathArr.length; i++) {
              var path = v.watchPathArr[i];
              v.watchPathArr[i] = _this.replaceNodePath(path, targetPath, replacePath);
            } else v.watchPath = _this.replaceNodePath(v.watchPath, targetPath, replacePath);
          }
        });
      };
      MVCompsEdit.prototype.replaceNodePath = function(path, search, replace) {
        var pathArr = path.split(".");
        var searchArr = search.split(".");
        var replaceArr = replace.split(".");
        var match = true;
        for (var i = 0; i < searchArr.length; i++) if (pathArr[i] !== searchArr[i]) {
          match = false;
          break;
        }
        if (true === match) {
          for (var i = 0; i < replaceArr.length; i++) pathArr[i] = replaceArr[i];
          cc.log(" \u8def\u5f84\u66f4\u65b0:", path, ">>>", pathArr.join("."));
        }
        return pathArr.join(".");
      };
      MVCompsEdit.prototype.getNodePath = function(node) {
        var parent = node;
        var array = [];
        while (parent) {
          var p = parent.getParent();
          if (!p) break;
          array.push(parent.name);
          parent = p;
        }
        return array.reverse().join("/");
      };
      __decorate([ property({
        type: [ cc.String ]
      }) ], MVCompsEdit.prototype, "findList", void 0);
      __decorate([ property({
        type: cc.Enum(ACTION_MODE)
      }) ], MVCompsEdit.prototype, "actionType", void 0);
      __decorate([ property({
        tooltip: "\u52fe\u9009\u540e,\u4f1a\u81ea\u52a8\u67e5\u627e find list \u4e2d\u586b\u5199\u7684\u7ec4\u4ef6",
        visible: function() {
          return this.actionType === ACTION_MODE.SEARCH_COMPONENT;
        }
      }) ], MVCompsEdit.prototype, "findTrigger", null);
      __decorate([ property({
        tooltip: "\u52fe\u9009\u540e,\u4f1a\u6279\u91cf\u6fc0\u6d3b find list \u4e2d\u586b\u5199\u7684\u7ec4\u4ef6",
        visible: function() {
          return this.actionType === ACTION_MODE.ENABLE_COMPONENT;
        }
      }) ], MVCompsEdit.prototype, "enableTrigger", null);
      __decorate([ property({
        tooltip: "\u52fe\u9009\u540e,\u4f1a\u6279\u91cf\u5173\u95ed find list \u4e2d\u586b\u5199\u7684\u7ec4\u4ef6",
        visible: function() {
          return this.actionType === ACTION_MODE.ENABLE_COMPONENT;
        }
      }) ], MVCompsEdit.prototype, "disableTrigger", null);
      __decorate([ property({
        tooltip: "\u5141\u8bb8\u5220\u9664\u8282\u70b9\u7684\u7ec4\u4ef6,\u786e\u5b9a\u9700\u8981\u79fb\u9664\u8bf7\u52fe\u9009,\u9632\u6b62\u8bef\u64cd\u4f5c",
        visible: function() {
          return this.actionType === ACTION_MODE.DELETE_COMPONENT;
        }
      }) ], MVCompsEdit.prototype, "allowDelete", void 0);
      __decorate([ property({
        tooltip: "\u52fe\u9009\u540e,\u4f1a\u6279\u91cf\u5220\u9664 find list \u4e2d\u586b\u5199\u7684\u7ec4\u4ef6",
        displayName: "[ X DELETE X ]",
        visible: function() {
          return this.allowDelete && this.actionType === ACTION_MODE.DELETE_COMPONENT;
        }
      }) ], MVCompsEdit.prototype, "deleteTrigger", null);
      __decorate([ property({
        tooltip: "\u52fe\u9009\u540e,\u4f1a\u6279\u91cf\u66ff\u6362\u6389\u6307\u5b9a\u7684\u8def\u5f84",
        visible: function() {
          return this.actionType === ACTION_MODE.REPLACE_WATCH_PATH;
        }
      }) ], MVCompsEdit.prototype, "replaceTrigger", null);
      __decorate([ property({
        tooltip: "\u5339\u914d\u7684\u8def\u5f84,\u5339\u914d\u89c4\u5219: \u641c\u7d22\u5f00\u5934\u4e3a game\u7684\u8def\u5f84",
        visible: function() {
          return this.actionType === ACTION_MODE.REPLACE_WATCH_PATH;
        }
      }) ], MVCompsEdit.prototype, "targetPath", void 0);
      __decorate([ property({
        tooltip: "\u66ff\u6362\u7684\u8def\u5f84,\u5c06\u5339\u914d\u5230\u7684\u8def\u5f84\u66ff\u6362",
        visible: function() {
          return this.actionType === ACTION_MODE.REPLACE_WATCH_PATH;
        }
      }) ], MVCompsEdit.prototype, "replacePath", void 0);
      __decorate([ property({
        tooltip: "\u662f\u5426\u641c\u96c6\u7ed1\u5b9aVM\u7ec4\u4ef6\u7684\u8282\u70b9?",
        visible: function() {
          return this.actionType === ACTION_MODE.SEARCH_COMPONENT;
        }
      }) ], MVCompsEdit.prototype, "canCollectNodes", void 0);
      __decorate([ property({
        type: [ cc.Node ],
        readonly: true,
        tooltip: "\u6536\u96c6\u5230\u7ed1\u5b9a\u4e86VM\u7ec4\u4ef6\u76f8\u5173\u7684\u8282\u70b9\uff0c\u53ef\u4ee5\u81ea\u5df1\u8df3\u8f6c\u8fc7\u53bb",
        visible: function() {
          return this.canCollectNodes && this.actionType === ACTION_MODE.SEARCH_COMPONENT;
        }
      }) ], MVCompsEdit.prototype, "collectNodes", void 0);
      MVCompsEdit = __decorate([ ccclass, executeInEditMode, menu("ModelViewer/Edit-Comps (\u5feb\u901f\u7ec4\u4ef6\u64cd\u4f5c)"), help("https://github.com/wsssheep/cocos_creator_mvvm_tools/blob/master/docs/VMCompsEdit.md") ], MVCompsEdit);
      return MVCompsEdit;
    }(cc.Component);
    exports.default = MVCompsEdit;
    cc._RF.pop();
  }, {} ],
  VMCustom: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ce662fwsSVPLKpmHx+KocFu", "VMCustom");
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
    var VMBase_1 = require("./VMBase");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode, menu = _a.menu, help = _a.help;
    var COMP_ARRAY_CHECK = [ [ "BhvFrameIndex", "index", false ], [ "BhvGroupToggle", "index", false ], [ "BhvRollNumber", "targetValue", false ], [ "cc.Label", "string", false ], [ "cc.RichText", "string", false ], [ "cc.EditBox", "string", true ], [ "cc.Slider", "progress", true ], [ "cc.ProgressBar", "progress", false ], [ "cc.Toggle", "isChecked", true ], [ "cc.Node", "scale", false ] ];
    var VMCustom = function(_super) {
      __extends(VMCustom, _super);
      function VMCustom() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.controller = false;
        _this.watchPath = "";
        _this.componentName = "";
        _this.componentProperty = "";
        _this.refreshRate = .1;
        _this._timer = 0;
        _this._watchComponent = null;
        _this._canWatchComponent = false;
        _this._oldValue = null;
        return _this;
      }
      VMCustom.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        this.checkEditorComponent();
        true;
        this._watchComponent = this.node.getComponent(this.componentName);
        this.checkComponentState();
      };
      VMCustom.prototype.onRestore = function() {
        this.checkEditorComponent();
      };
      VMCustom.prototype.start = function() {
        this.onValueInit();
      };
      VMCustom.prototype.checkEditorComponent = function() {
        var checkArray;
        var i;
        var params;
        var comp;
        false;
      };
      VMCustom.prototype.checkComponentState = function() {
        this._canWatchComponent = false;
        if (!this._watchComponent) {
          console.error("\u672a\u8bbe\u7f6e\u9700\u8981\u76d1\u542c\u7684\u7ec4\u4ef6");
          return;
        }
        if (!this.componentProperty) {
          console.error("\u672a\u8bbe\u7f6e\u9700\u8981\u76d1\u542c\u7684\u7ec4\u4ef6 \u7684\u5c5e\u6027");
          return;
        }
        if (this.componentProperty in this._watchComponent === false) {
          console.error("\u9700\u8981\u76d1\u542c\u7684\u7ec4\u4ef6\u7684\u5c5e\u6027\u4e0d\u5b58\u5728");
          return;
        }
        this._canWatchComponent = true;
      };
      VMCustom.prototype.getComponentValue = function() {
        return this._watchComponent[this.componentProperty];
      };
      VMCustom.prototype.setComponentValue = function(value) {
        if ("cc.Toggle" == this.componentName) {
          true == value && this.node.getComponent(cc.Toggle).check();
          false == value && this.node.getComponent(cc.Toggle).uncheck();
        } else this._watchComponent[this.componentProperty] = value;
      };
      VMCustom.prototype.onValueInit = function() {
        false;
        this.setComponentValue(this.VM.getValue(this.watchPath));
      };
      VMCustom.prototype.onValueController = function(newValue, oldValue) {
        this.VM.setValue(this.watchPath, newValue);
      };
      VMCustom.prototype.onValueChanged = function(n, o, pathArr) {
        this.setComponentValue(n);
      };
      VMCustom.prototype.update = function(dt) {
        false;
        if (!this.controller) return;
        if (!this._canWatchComponent || false === this._watchComponent["enabled"]) return;
        this._timer += dt;
        if (this._timer < this.refreshRate) return;
        this._timer = 0;
        var oldValue = this._oldValue;
        var newValue = this.getComponentValue();
        if (this._oldValue === newValue) return;
        this._oldValue = this.getComponentValue();
        this.onValueController(newValue, oldValue);
      };
      __decorate([ property({
        tooltip: "\u6fc0\u6d3bcontroller,\u4ee5\u5f00\u542f\u53cc\u5411\u7ed1\u5b9a\uff0c\u5426\u5219\u53ea\u80fd\u63a5\u6536\u6d88\u606f"
      }) ], VMCustom.prototype, "controller", void 0);
      __decorate([ property ], VMCustom.prototype, "watchPath", void 0);
      __decorate([ property({
        tooltip: "\u7ed1\u5b9a\u7ec4\u4ef6\u7684\u540d\u5b57"
      }) ], VMCustom.prototype, "componentName", void 0);
      __decorate([ property({
        tooltip: "\u7ec4\u4ef6\u4e0a\u9700\u8981\u76d1\u542c\u7684\u5c5e\u6027"
      }) ], VMCustom.prototype, "componentProperty", void 0);
      __decorate([ property({
        tooltip: "\u5237\u65b0\u95f4\u9694\u9891\u7387(\u53ea\u5f71\u54cd\u810f\u68c0\u67e5\u7684\u9891\u7387)",
        step: .01,
        range: [ 0, 1 ],
        visible: function() {
          return true === this.controller;
        }
      }) ], VMCustom.prototype, "refreshRate", void 0);
      VMCustom = __decorate([ ccclass, executeInEditMode, menu("ModelViewer/VM-Custom (\u81ea\u5b9a\u4e49VM)"), help("https://github.com/wsssheep/cocos_creator_mvvm_tools/blob/master/docs/VMCustom.md") ], VMCustom);
      return VMCustom;
    }(VMBase_1.default);
    exports.default = VMCustom;
    cc._RF.pop();
  }, {
    "./VMBase": "VMBase"
  } ],
  VMEvent: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a9ce7kf8XZJeLPlT2iWn2zD", "VMEvent");
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
    var VMBase_1 = require("./VMBase");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode, menu = _a.menu, help = _a.help;
    var FILTER_MODE;
    (function(FILTER_MODE) {
      FILTER_MODE[FILTER_MODE["none"] = 0] = "none";
      FILTER_MODE[FILTER_MODE["=="] = 1] = "==";
      FILTER_MODE[FILTER_MODE["!="] = 2] = "!=";
      FILTER_MODE[FILTER_MODE[">"] = 3] = ">";
      FILTER_MODE[FILTER_MODE[">="] = 4] = ">=";
      FILTER_MODE[FILTER_MODE["<"] = 5] = "<";
      FILTER_MODE[FILTER_MODE["<="] = 6] = "<=";
    })(FILTER_MODE || (FILTER_MODE = {}));
    var VMEvent = function(_super) {
      __extends(VMEvent, _super);
      function VMEvent() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.templateMode = false;
        _this.watchPath = "";
        _this.triggerOnce = false;
        _this.watchPathArr = [];
        _this.filterMode = FILTER_MODE.none;
        _this.compareValue = "";
        _this.changeEvents = [];
        return _this;
      }
      VMEvent.prototype.onValueInit = function() {};
      VMEvent.prototype.onValueChanged = function(newVar, oldVar, pathArr) {
        var res = this.conditionCheck(newVar, this.compareValue);
        if (!res) return;
        Array.isArray(this.changeEvents) && this.changeEvents.forEach(function(v) {
          v.emit([ newVar, oldVar, pathArr ]);
        });
        true === this.triggerOnce && (this.enabled = false);
      };
      VMEvent.prototype.conditionCheck = function(a, b) {
        var cod = FILTER_MODE;
        switch (this.filterMode) {
         case cod.none:
          return true;

         case cod["=="]:
          if (a == b) return true;
          break;

         case cod["!="]:
          if (a != b) return true;
          break;

         case cod["<"]:
          if (a < b) return true;
          break;

         case cod[">"]:
          if (a > b) return true;
          break;

         case cod[">="]:
          if (a >= b) return true;
          break;

         case cod["<"]:
          if (a < b) return true;
          break;

         case cod["<="]:
          if (a <= b) return true;
        }
        return false;
      };
      __decorate([ property({
        tooltip: "\u4f7f\u7528\u6a21\u677f\u6a21\u5f0f\uff0c\u53ef\u4ee5\u4f7f\u7528\u591a\u8def\u5f84\u76d1\u542c"
      }) ], VMEvent.prototype, "templateMode", void 0);
      __decorate([ property({
        tooltip: "\u76d1\u542c\u83b7\u53d6\u503c\u7684\u8def\u5f84",
        visible: function() {
          return false === this.templateMode;
        }
      }) ], VMEvent.prototype, "watchPath", void 0);
      __decorate([ property({
        tooltip: "\u89e6\u53d1\u4e00\u6b21\u540e\u4f1a\u81ea\u52a8\u5173\u95ed\u8be5\u4e8b\u4ef6"
      }) ], VMEvent.prototype, "triggerOnce", void 0);
      __decorate([ property({
        tooltip: "\u76d1\u542c\u83b7\u53d6\u503c\u7684\u591a\u6761\u8def\u5f84,\u8fd9\u4e9b\u503c\u7684\u6539\u53d8\u90fd\u4f1a\u901a\u8fc7\u8fd9\u4e2a\u51fd\u6570\u56de\u8c03,\u8bf7\u4f7f\u7528 pathArr \u533a\u5206\u83b7\u53d6\u7684\u503c ",
        type: [ cc.String ],
        visible: function() {
          return true === this.templateMode;
        }
      }) ], VMEvent.prototype, "watchPathArr", void 0);
      __decorate([ property({
        tooltip: "\u8fc7\u6ee4\u6a21\u5f0f\uff0c\u4f1a\u6839\u636e\u6761\u4ef6\u8fc7\u6ee4\u6389\u65f6\u95f4\u7684\u89e6\u53d1",
        type: cc.Enum(FILTER_MODE)
      }) ], VMEvent.prototype, "filterMode", void 0);
      __decorate([ property({
        visible: function() {
          return this.filterMode !== FILTER_MODE.none;
        }
      }) ], VMEvent.prototype, "compareValue", void 0);
      __decorate([ property([ cc.Component.EventHandler ]) ], VMEvent.prototype, "changeEvents", void 0);
      VMEvent = __decorate([ ccclass, executeInEditMode, menu("ModelViewer/VM-EventCall(\u8c03\u7528\u51fd\u6570)"), help("https://github.com/wsssheep/cocos_creator_mvvm_tools/blob/master/docs/VMEvent.md") ], VMEvent);
      return VMEvent;
    }(VMBase_1.default);
    exports.default = VMEvent;
    cc._RF.pop();
  }, {
    "./VMBase": "VMBase"
  } ],
  VMLabel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "545c05XsG9GDJispEGWKvYv", "VMLabel");
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
    var VMBase_1 = require("./VMBase");
    var StringFormat_1 = require("./StringFormat");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu, executeInEditMode = _a.executeInEditMode, help = _a.help;
    var LABEL_TYPE = {
      CC_LABEL: "cc.Label",
      CC_RICH_TEXT: "cc.RichText",
      CC_EDIT_BOX: "cc.EditBox"
    };
    var VMLabel = function(_super) {
      __extends(VMLabel, _super);
      function VMLabel() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.watchPath = "";
        _this.labelType = LABEL_TYPE.CC_LABEL;
        _this.templateMode = false;
        _this.watchPathArr = [];
        _this.templateValueArr = [];
        _this.templateFormatArr = [];
        _this.originText = null;
        return _this;
      }
      VMLabel.prototype.onRestore = function() {
        this.checkLabel();
      };
      VMLabel.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        this.checkLabel();
        true;
        if (this.templateMode) {
          this.originText = this.getLabelValue();
          this.parseTemplate();
        }
      };
      VMLabel.prototype.start = function() {
        false;
        this.onValueInit();
      };
      VMLabel.prototype.parseTemplate = function() {
        var regexAll = /\{\{(.+?)\}\}/g;
        var regex = /\{\{(.+?)\}\}/;
        var res = this.originText.match(regexAll);
        if (null == res) return;
        for (var i = 0; i < res.length; i++) {
          var e = res[i];
          var arr = e.match(regex);
          var matchName = arr[1];
          var matchInfo = matchName.split(":")[1] || "";
          this.templateFormatArr[i] = matchInfo;
        }
      };
      VMLabel.prototype.getReplaceText = function() {
        if (!this.originText) return "";
        var regexAll = /\{\{(.+?)\}\}/g;
        var regex = /\{\{(.+?)\}\}/;
        var res = this.originText.match(regexAll);
        if (null == res) return "";
        var str = this.originText;
        for (var i = 0; i < res.length; i++) {
          var e = res[i];
          var getValue = void 0;
          var arr = e.match(regex);
          var indexNum = parseInt(arr[1] || "0") || 0;
          var format = this.templateFormatArr[i];
          getValue = this.templateValueArr[indexNum];
          str = str.replace(e, this.getValueFromFormat(getValue, format));
        }
        return str;
      };
      VMLabel.prototype.getValueFromFormat = function(value, format) {
        return StringFormat_1.StringFormatFunction.deal(value, format);
      };
      VMLabel.prototype.onValueInit = function() {
        if (false === this.templateMode) this.setLabelValue(this.VM.getValue(this.watchPath)); else {
          var max = this.watchPathArr.length;
          for (var i = 0; i < max; i++) this.templateValueArr[i] = this.VM.getValue(this.watchPathArr[i], "?");
          this.setLabelValue(this.getReplaceText());
        }
      };
      VMLabel.prototype.onValueChanged = function(n, o, pathArr) {
        if (false === this.templateMode) this.setLabelValue(n); else {
          var path_1 = pathArr.join(".");
          var index = this.watchPathArr.findIndex(function(v) {
            return v === path_1;
          });
          if (index >= 0) {
            this.templateValueArr[index] = n;
            this.setLabelValue(this.getReplaceText());
          }
        }
      };
      VMLabel.prototype.setLabelValue = function(value) {
        this.getComponent(this.labelType).string = value + "";
      };
      VMLabel.prototype.getLabelValue = function() {
        return this.getComponent(this.labelType).string;
      };
      VMLabel.prototype.checkLabel = function() {
        var checkArray = [ "cc.Label", "cc.RichText", "cc.EditBox" ];
        for (var i = 0; i < checkArray.length; i++) {
          var e = checkArray[i];
          var comp = this.node.getComponent(e);
          if (comp) {
            this.labelType = e;
            return true;
          }
        }
        cc.error("\u6ca1\u6709\u6302\u8f7d\u4efb\u4f55label\u7ec4\u4ef6");
        return false;
      };
      __decorate([ property({
        visible: function() {
          return false === this.templateMode;
        }
      }) ], VMLabel.prototype, "watchPath", void 0);
      __decorate([ property({
        readonly: true
      }) ], VMLabel.prototype, "labelType", void 0);
      __decorate([ property({
        tooltip: "\u662f\u5426\u542f\u7528\u6a21\u677f\u4ee3\u7801,\u53ea\u80fd\u5728\u8fd0\u884c\u65f6\u4e4b\u524d\u8bbe\u7f6e,\n\u5c06\u4f1a\u52a8\u6001\u89e3\u6790\u6a21\u677f\u8bed\u6cd5 {{0}},\u5e76\u4e14\u81ea\u52a8\u8bbe\u7f6e\u76d1\u542c\u7684\u8def\u5f84"
      }) ], VMLabel.prototype, "templateMode", void 0);
      __decorate([ property({
        type: [ cc.String ],
        visible: function() {
          return true === this.templateMode;
        }
      }) ], VMLabel.prototype, "watchPathArr", void 0);
      VMLabel = __decorate([ ccclass, executeInEditMode, menu("ModelViewer/VM-Label(\u6587\u672cVM)"), help("https://github.com/wsssheep/cocos_creator_mvvm_tools/blob/master/docs/VMLabel.md") ], VMLabel);
      return VMLabel;
    }(VMBase_1.default);
    exports.default = VMLabel;
    cc._RF.pop();
  }, {
    "./StringFormat": "StringFormat",
    "./VMBase": "VMBase"
  } ],
  VMModify: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7d2a4voaOJJGJZRWFPG6Bk7", "VMModify");
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
    var VMBase_1 = require("./VMBase");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu, help = _a.help;
    var CLAMP_MODE;
    (function(CLAMP_MODE) {
      CLAMP_MODE[CLAMP_MODE["MIN"] = 0] = "MIN";
      CLAMP_MODE[CLAMP_MODE["MAX"] = 1] = "MAX";
      CLAMP_MODE[CLAMP_MODE["MIN_MAX"] = 2] = "MIN_MAX";
    })(CLAMP_MODE || (CLAMP_MODE = {}));
    var VMModify = function(_super) {
      __extends(VMModify, _super);
      function VMModify() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.watchPath = "";
        _this.valueClamp = false;
        _this.valueClampMode = CLAMP_MODE.MIN_MAX;
        _this.valueMin = 0;
        _this.valueMax = 1;
        return _this;
      }
      VMModify.prototype.start = function() {};
      VMModify.prototype.clampValue = function(res) {
        var min = this.valueMin;
        var max = this.valueMax;
        if (false == this.valueClamp) return res;
        switch (this.valueClampMode) {
         case CLAMP_MODE.MIN_MAX:
          res > max && (res = max);
          res < min && (res = min);
          break;

         case CLAMP_MODE.MIN:
          res < min && (res = min);
          break;

         case CLAMP_MODE.MAX:
          res > max && (res = max);
        }
        return res;
      };
      VMModify.prototype.vAddInt = function(e, data) {
        this.vAdd(e, data, true);
      };
      VMModify.prototype.vSubInt = function(e, data) {
        this.vSub(e, data, true);
      };
      VMModify.prototype.vMulInt = function(e, data) {
        this.vMul(e, data, true);
      };
      VMModify.prototype.vDivInt = function(e, data) {
        this.vDiv(e, data, true);
      };
      VMModify.prototype.vAdd = function(e, data, int) {
        void 0 === int && (int = false);
        var a = parseFloat(data);
        var res = this.VM.getValue(this.watchPath, 0) + a;
        int && (res = Math.round(res));
        this.VM.setValue(this.watchPath, this.clampValue(res));
      };
      VMModify.prototype.vSub = function(e, data, int) {
        void 0 === int && (int = false);
        var a = parseFloat(data);
        var res = this.VM.getValue(this.watchPath, 0) - a;
        int && (res = Math.round(res));
        this.VM.setValue(this.watchPath, this.clampValue(res));
      };
      VMModify.prototype.vMul = function(e, data, int) {
        void 0 === int && (int = false);
        var a = parseFloat(data);
        var res = this.VM.getValue(this.watchPath, 0) * a;
        int && (res = Math.round(res));
        this.VM.setValue(this.watchPath, this.clampValue(res));
      };
      VMModify.prototype.vDiv = function(e, data, int) {
        void 0 === int && (int = false);
        var a = parseFloat(data);
        var res = this.VM.getValue(this.watchPath, 0) / a;
        int && (res = Math.round(res));
        this.VM.setValue(this.watchPath, this.clampValue(res));
      };
      VMModify.prototype.vString = function(e, data) {
        var a = data;
        this.VM.setValue(this.watchPath, a);
      };
      VMModify.prototype.vNumberInt = function(e, data) {
        this.vNumber(e, data, true);
      };
      VMModify.prototype.vNumber = function(e, data, int) {
        void 0 === int && (int = false);
        var a = parseFloat(data);
        int && (a = Math.round(a));
        this.VM.setValue(this.watchPath, this.clampValue(a));
      };
      __decorate([ property ], VMModify.prototype, "watchPath", void 0);
      __decorate([ property() ], VMModify.prototype, "valueClamp", void 0);
      __decorate([ property({
        type: cc.Enum(CLAMP_MODE),
        visible: function() {
          return true === this.valueClamp;
        }
      }) ], VMModify.prototype, "valueClampMode", void 0);
      __decorate([ property({
        visible: function() {
          return true === this.valueClamp && this.valueClampMode !== CLAMP_MODE.MAX;
        }
      }) ], VMModify.prototype, "valueMin", void 0);
      __decorate([ property({
        visible: function() {
          return true === this.valueClamp && this.valueClampMode !== CLAMP_MODE.MIN;
        }
      }) ], VMModify.prototype, "valueMax", void 0);
      VMModify = __decorate([ ccclass, menu("ModelViewer/VM-Modify(\u4fee\u6539Model)"), help("https://github.com/wsssheep/cocos_creator_mvvm_tools/blob/master/docs/VMModify.md") ], VMModify);
      return VMModify;
    }(VMBase_1.default);
    exports.default = VMModify;
    cc._RF.pop();
  }, {
    "./VMBase": "VMBase"
  } ],
  VMParent: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "15ccciO+ZRH476sPKD/LvB7", "VMParent");
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
    var ViewModel_1 = require("./ViewModel");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, help = _a.help, executionOrder = _a.executionOrder;
    var VMParent = function(_super) {
      __extends(VMParent, _super);
      function VMParent() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.tag = "_temp";
        _this.data = {};
        _this.VM = ViewModel_1.VM;
        return _this;
      }
      VMParent.prototype.onLoad = function() {
        if (null == this.data) return;
        this.tag = "_temp<" + this.node.uuid.replace(".", "") + ">";
        ViewModel_1.VM.add(this.data, this.tag);
        var comps = this.getVMComponents();
        for (var i = 0; i < comps.length; i++) {
          var comp = comps[i];
          this.replaceVMPath(comp, this.tag);
        }
        this.onBind();
      };
      VMParent.prototype.onBind = function() {};
      VMParent.prototype.onUnBind = function() {};
      VMParent.prototype.replaceVMPath = function(comp, tag) {
        var path = comp["watchPath"];
        if (true == comp["templateMode"]) {
          var pathArr = comp["watchPathArr"];
          if (pathArr) for (var i = 0; i < pathArr.length; i++) {
            var path_1 = pathArr[i];
            pathArr[i] = path_1.replace("*", tag);
          }
        } else "*" === path.split(".")[0] && (comp["watchPath"] = path.replace("*", tag));
      };
      VMParent.prototype.getVMComponents = function() {
        var _this = this;
        var comps = this.node.getComponentsInChildren("VMBase");
        var parents = this.node.getComponentsInChildren("VMParent").filter(function(v) {
          return v.uuid !== _this.uuid;
        });
        var filters = [];
        parents.forEach(function(node) {
          filters = filters.concat(node.getComponentsInChildren("VMBase"));
        });
        comps = comps.filter(function(v) {
          return filters.indexOf(v) < 0;
        });
        return comps;
      };
      VMParent.prototype.onDestroy = function() {
        this.onUnBind();
        ViewModel_1.VM.remove(this.tag);
        this.data = null;
      };
      VMParent = __decorate([ ccclass, executionOrder(-1), help("https://github.com/wsssheep/cocos_creator_mvvm_tools/blob/master/docs/VMParent.md") ], VMParent);
      return VMParent;
    }(cc.Component);
    exports.default = VMParent;
    cc._RF.pop();
  }, {
    "./ViewModel": "ViewModel"
  } ],
  VMProgress: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2a50eqI7JZNV5Sh0y/Qd9C6", "VMProgress");
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
    var VMCustom_1 = require("./VMCustom");
    var StringFormat_1 = require("./StringFormat");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu, help = _a.help;
    var VMProgress = function(_super) {
      __extends(VMProgress, _super);
      function VMProgress() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.watchPath = "";
        _this.watchPathArr = [ "[min]", "[max]" ];
        _this.templateMode = true;
        _this.stringFormat = "";
        return _this;
      }
      VMProgress.prototype.onLoad = function() {
        (this.watchPathArr.length < 2 || "[min]" == this.watchPathArr[0] || "[max]" == this.watchPathArr[1]) && console.error("VMProgress must have two values!");
        _super.prototype.onLoad.call(this);
      };
      VMProgress.prototype.start = function() {
        true;
        this.onValueInit();
      };
      VMProgress.prototype.onValueInit = function() {
        var max = this.watchPathArr.length;
        for (var i = 0; i < max; i++) this.templateValueArr[i] = this.VM.getValue(this.watchPathArr[i]);
        var value = this.templateValueArr[0] / this.templateValueArr[1];
        this.setComponentValue(value);
      };
      VMProgress.prototype.setComponentValue = function(value) {
        if ("" !== this.stringFormat) {
          var res = StringFormat_1.StringFormatFunction.deal(value, this.stringFormat);
          _super.prototype.setComponentValue.call(this, res);
        } else _super.prototype.setComponentValue.call(this, value);
      };
      VMProgress.prototype.onValueController = function(n, o) {
        var value = Math.round(n * this.templateValueArr[1]);
        Number.isNaN(value) && (value = 0);
        this.VM.setValue(this.watchPathArr[0], value);
      };
      VMProgress.prototype.onValueChanged = function(n, o, pathArr) {
        if (false === this.templateMode) return;
        var path = pathArr.join(".");
        var index = this.watchPathArr.findIndex(function(v) {
          return v === path;
        });
        index >= 0 && (this.templateValueArr[index] = n);
        var value = this.templateValueArr[0] / this.templateValueArr[1];
        value > 1 && (value = 1);
        (value < 0 || Number.isNaN(value)) && (value = 0);
        this.setComponentValue(value);
      };
      __decorate([ property({
        visible: false,
        override: true
      }) ], VMProgress.prototype, "watchPath", void 0);
      __decorate([ property({
        type: [ cc.String ],
        tooltip: "\u7b2c\u4e00\u4e2a\u503c\u662fmin \u503c\uff0c\u7b2c\u4e8c\u4e2a\u503c \u662f max \u503c\uff0c\u4f1a\u8ba1\u7b97\u51fa\u4e24\u8005\u7684\u6bd4\u4f8b"
      }) ], VMProgress.prototype, "watchPathArr", void 0);
      __decorate([ property({
        visible: function() {
          return "string" === this.componentProperty;
        },
        tooltip: "\u5b57\u7b26\u4e32\u683c\u5f0f\u5316\uff0c\u548c VMLabel \u7684\u5b57\u6bb5\u4e00\u6837\uff0c\u9700\u8981\u586b\u5165\u5bf9\u5e94\u7684\u683c\u5f0f\u5316\u5b57\u7b26\u4e32"
      }) ], VMProgress.prototype, "stringFormat", void 0);
      VMProgress = __decorate([ ccclass, menu("ModelViewer/VM-Progress (VM-\u8fdb\u5ea6\u6761)"), help("https://github.com/wsssheep/cocos_creator_mvvm_tools/blob/master/docs/VMProgress.md") ], VMProgress);
      return VMProgress;
    }(VMCustom_1.default);
    exports.default = VMProgress;
    cc._RF.pop();
  }, {
    "./StringFormat": "StringFormat",
    "./VMCustom": "VMCustom"
  } ],
  VMState: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "47052uw/Y5O1LXaLObj4ARx", "VMState");
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
    var ViewModel_1 = require("./ViewModel");
    var VMBase_1 = require("./VMBase");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu, help = _a.help;
    var CONDITION;
    (function(CONDITION) {
      CONDITION[CONDITION["=="] = 0] = "==";
      CONDITION[CONDITION["!="] = 1] = "!=";
      CONDITION[CONDITION[">"] = 2] = ">";
      CONDITION[CONDITION[">="] = 3] = ">=";
      CONDITION[CONDITION["<"] = 4] = "<";
      CONDITION[CONDITION["<="] = 5] = "<=";
      CONDITION[CONDITION["range"] = 6] = "range";
    })(CONDITION || (CONDITION = {}));
    var ACTION;
    (function(ACTION) {
      ACTION[ACTION["NODE_ACTIVE"] = 0] = "NODE_ACTIVE";
      ACTION[ACTION["NODE_VISIBLE"] = 1] = "NODE_VISIBLE";
      ACTION[ACTION["NODE_OPACITY"] = 2] = "NODE_OPACITY";
      ACTION[ACTION["NODE_COLOR"] = 3] = "NODE_COLOR";
      ACTION[ACTION["COMPONENT_CUSTOM"] = 4] = "COMPONENT_CUSTOM";
    })(ACTION || (ACTION = {}));
    var CHILD_MODE_TYPE;
    (function(CHILD_MODE_TYPE) {
      CHILD_MODE_TYPE[CHILD_MODE_TYPE["NODE_INDEX"] = 0] = "NODE_INDEX";
      CHILD_MODE_TYPE[CHILD_MODE_TYPE["NODE_NAME"] = 1] = "NODE_NAME";
    })(CHILD_MODE_TYPE || (CHILD_MODE_TYPE = {}));
    var VMState = function(_super) {
      __extends(VMState, _super);
      function VMState() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.watchPath = "";
        _this.foreachChildMode = false;
        _this.condition = CONDITION["=="];
        _this.foreachChildType = CHILD_MODE_TYPE.NODE_INDEX;
        _this.valueA = 0;
        _this.valueB = 0;
        _this.valueAction = ACTION.NODE_ACTIVE;
        _this.valueActionOpacity = 0;
        _this.valueActionColor = cc.color(155, 155, 155);
        _this.valueComponentName = "";
        _this.valueComponentProperty = "";
        _this.valueComponentDefaultValue = "";
        _this.valueComponentActionValue = "";
        _this.watchNodes = [];
        return _this;
      }
      VMState.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        if (0 == this.watchNodes.length) {
          this.valueAction !== ACTION.NODE_ACTIVE && false === this.foreachChildMode && this.watchNodes.push(this.node);
          this.watchNodes = this.watchNodes.concat(this.node.children);
        }
      };
      VMState.prototype.start = function() {
        this.enabled && this.onValueInit();
      };
      VMState.prototype.onValueInit = function() {
        var value = ViewModel_1.VM.getValue(this.watchPath);
        this.checkNodeFromValue(value);
      };
      VMState.prototype.onValueChanged = function(newVar, oldVar, pathArr) {
        this.checkNodeFromValue(newVar);
      };
      VMState.prototype.checkNodeFromValue = function(value) {
        var _this = this;
        if (this.foreachChildMode) this.watchNodes.forEach(function(node, index) {
          var v = _this.foreachChildType === CHILD_MODE_TYPE.NODE_INDEX ? index : node.name;
          var check = _this.conditionCheck(value, v);
          _this.setNodeState(node, check);
        }); else {
          var check = this.conditionCheck(value, this.valueA, this.valueB);
          this.setNodesStates(check);
        }
      };
      VMState.prototype.setNodesStates = function(checkState) {
        var _this = this;
        var nodes = this.watchNodes;
        var check = checkState;
        nodes.forEach(function(node) {
          _this.setNodeState(node, check);
        });
      };
      VMState.prototype.setNodeState = function(node, checkState) {
        var n = this.valueAction;
        var check = checkState;
        var a = ACTION;
        switch (n) {
         case a.NODE_ACTIVE:
          node.active = !!check;
          break;

         case a.NODE_VISIBLE:
          node.opacity = check ? 255 : 0;
          break;

         case a.NODE_COLOR:
          node.color = check ? this.valueActionColor : cc.color(255, 255, 255);
          break;

         case a.NODE_OPACITY:
          node.opacity = check ? this.valueActionOpacity : 255;
          break;

         case a.COMPONENT_CUSTOM:
          var comp = null;
          comp = "cc.Node" === this.valueComponentName ? node : node.getComponent(this.valueComponentName);
          if (null == comp) return;
          this.valueComponentProperty in comp && (comp[this.valueComponentProperty] = check ? Number(this.valueComponentActionValue) : Number(this.valueComponentDefaultValue));
        }
      };
      VMState.prototype.conditionCheck = function(v, a, b) {
        var cod = CONDITION;
        switch (this.condition) {
         case cod["=="]:
          if (v == a) return true;
          break;

         case cod["!="]:
          if (v != a) return true;
          break;

         case cod["<"]:
          if (v < a) return true;
          break;

         case cod[">"]:
          if (v > a) return true;
          break;

         case cod[">="]:
          if (v >= a) return true;
          break;

         case cod["<"]:
          if (v < a) return true;
          break;

         case cod["<="]:
          if (v <= a) return true;
          break;

         case cod["range"]:
          if (v >= a && v <= b) return true;
        }
        return false;
      };
      __decorate([ property ], VMState.prototype, "watchPath", void 0);
      __decorate([ property({
        tooltip: "\u904d\u5386\u5b50\u8282\u70b9,\u6839\u636e\u5b50\u8282\u70b9\u7684\u540d\u5b57\u6216\u540d\u5b57\u8f6c\u6362\u4e3a\u503c\uff0c\u5224\u65ad\u503c\u6ee1\u8db3\u6761\u4ef6 \u6765\u6fc0\u6d3b"
      }) ], VMState.prototype, "foreachChildMode", void 0);
      __decorate([ property({
        type: cc.Enum(CONDITION)
      }) ], VMState.prototype, "condition", void 0);
      __decorate([ property({
        type: cc.Enum(CHILD_MODE_TYPE),
        tooltip: "\u904d\u5386\u5b50\u8282\u70b9,\u6839\u636e\u5b50\u8282\u70b9\u7684\u540d\u5b57\u8f6c\u6362\u4e3a\u503c\uff0c\u5224\u65ad\u503c\u6ee1\u8db3\u6761\u4ef6 \u6765\u6fc0\u6d3b",
        visible: function() {
          return true === this.foreachChildMode;
        }
      }) ], VMState.prototype, "foreachChildType", void 0);
      __decorate([ property({
        displayName: "Value: a",
        visible: function() {
          return false === this.foreachChildMode;
        }
      }) ], VMState.prototype, "valueA", void 0);
      __decorate([ property({
        displayName: "Value: b",
        visible: function() {
          return false === this.foreachChildMode && this.condition === CONDITION.range;
        }
      }) ], VMState.prototype, "valueB", void 0);
      __decorate([ property({
        type: cc.Enum(ACTION),
        tooltip: "\u4e00\u65e6\u6ee1\u8db3\u6761\u4ef6\u5c31\u5bf9\u8282\u70b9\u6267\u884c\u64cd\u4f5c"
      }) ], VMState.prototype, "valueAction", void 0);
      __decorate([ property({
        visible: function() {
          return this.valueAction === ACTION.NODE_OPACITY;
        },
        range: [ 0, 255 ],
        type: cc.Integer,
        displayName: "Action Opacity"
      }) ], VMState.prototype, "valueActionOpacity", void 0);
      __decorate([ property({
        visible: function() {
          return this.valueAction === ACTION.NODE_COLOR;
        },
        displayName: "Action Color"
      }) ], VMState.prototype, "valueActionColor", void 0);
      __decorate([ property({
        visible: function() {
          return this.valueAction === ACTION.COMPONENT_CUSTOM;
        },
        displayName: "Component Name"
      }) ], VMState.prototype, "valueComponentName", void 0);
      __decorate([ property({
        visible: function() {
          return this.valueAction === ACTION.COMPONENT_CUSTOM;
        },
        displayName: "Component Property"
      }) ], VMState.prototype, "valueComponentProperty", void 0);
      __decorate([ property({
        visible: function() {
          return this.valueAction === ACTION.COMPONENT_CUSTOM;
        },
        displayName: "Default Value"
      }) ], VMState.prototype, "valueComponentDefaultValue", void 0);
      __decorate([ property({
        visible: function() {
          return this.valueAction === ACTION.COMPONENT_CUSTOM;
        },
        displayName: "Action Value"
      }) ], VMState.prototype, "valueComponentActionValue", void 0);
      __decorate([ property({
        type: [ cc.Node ],
        tooltip: "\u9700\u8981\u6267\u884c\u6761\u4ef6\u7684\u8282\u70b9\uff0c\u5982\u679c\u4e0d\u586b\u5199\u5219\u9ed8\u8ba4\u4f1a\u6267\u884c\u672c\u8282\u70b9\u4ee5\u53ca\u672c\u8282\u70b9\u7684\u6240\u6709\u5b50\u8282\u70b9 \u7684\u72b6\u6001"
      }) ], VMState.prototype, "watchNodes", void 0);
      VMState = __decorate([ ccclass, menu("ModelViewer/VM-State (VM\u72b6\u6001\u63a7\u5236)"), help("https://github.com/wsssheep/cocos_creator_mvvm_tools/blob/master/docs/VMState.md") ], VMState);
      return VMState;
    }(VMBase_1.default);
    exports.default = VMState;
    cc._RF.pop();
  }, {
    "./VMBase": "VMBase",
    "./ViewModel": "ViewModel"
  } ],
  ViewModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "54f75k4X+RP0qaXOzrfZysL", "ViewModel");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.VM = void 0;
    var JsonOb_1 = require("./JsonOb");
    var VM_EMIT_HEAD = "VC:";
    var DEBUG_SHOW_PATH = false;
    function setValueFromPath(obj, path, value, tag) {
      void 0 === tag && (tag = "");
      var props = path.split(".");
      for (var i = 0; i < props.length; i++) {
        var propName = props[i];
        if (propName in obj === false) {
          console.error("[" + propName + "] not find in " + tag + "." + path);
          break;
        }
        i == props.length - 1 ? obj[propName] = value : obj = obj[propName];
      }
    }
    function getValueFromPath(obj, path, def, tag) {
      void 0 === tag && (tag = "");
      var props = path.split(".");
      for (var i = 0; i < props.length; i++) {
        var propName = props[i];
        if (propName in obj === false) {
          console.error("[" + propName + "] not find in " + tag + "." + path);
          return def;
        }
        obj = obj[propName];
      }
      null !== obj && "undefined" !== typeof obj || (obj = def);
      return obj;
    }
    var ViewModel = function() {
      function ViewModel(data, tag) {
        this._tag = null;
        this.active = true;
        this.emitToRootPath = false;
        new JsonOb_1.JsonOb(data, this._callback.bind(this));
        this.$data = data;
        this._tag = tag;
      }
      ViewModel.prototype._callback = function(n, o, path) {
        if (true == this.active) {
          var name = VM_EMIT_HEAD + this._tag + "." + path.join(".");
          DEBUG_SHOW_PATH && cc.log(">>", n, o, path);
          cc.director.emit(name, n, o, [ this._tag ].concat(path));
          this.emitToRootPath && cc.director.emit(VM_EMIT_HEAD + this._tag, n, o, path);
          if (path.length >= 2) for (var i = 0; i < path.length - 1; i++) var e = path[i];
        }
      };
      ViewModel.prototype.setValue = function(path, value) {
        setValueFromPath(this.$data, path, value, this._tag);
      };
      ViewModel.prototype.getValue = function(path, def) {
        return getValueFromPath(this.$data, path, def, this._tag);
      };
      return ViewModel;
    }();
    var VMManager = function() {
      function VMManager() {
        this._mvs = [];
        this.EMIT_HEAD = VM_EMIT_HEAD;
        this.setObjValue = setValueFromPath;
        this.getObjValue = getValueFromPath;
      }
      VMManager.prototype.add = function(data, tag, activeRootObject) {
        void 0 === tag && (tag = "global");
        void 0 === activeRootObject && (activeRootObject = false);
        var vm = new ViewModel(data, tag);
        var has = this._mvs.find(function(v) {
          return v.tag === tag;
        });
        if (tag.includes(".")) {
          console.error("cant write . in tag:", tag);
          return;
        }
        if (has) {
          console.error("already set VM tag:" + tag);
          return;
        }
        vm.emitToRootPath = activeRootObject;
        this._mvs.push({
          tag: tag,
          vm: vm
        });
      };
      VMManager.prototype.remove = function(tag) {
        var index = this._mvs.findIndex(function(v) {
          return v.tag === tag;
        });
        index >= 0 && this._mvs.splice(index, 1);
      };
      VMManager.prototype.get = function(tag) {
        var res = this._mvs.find(function(v) {
          return v.tag === tag;
        });
        if (null != res) return res.vm;
        console.error("cant find VM from:", tag);
      };
      VMManager.prototype.addValue = function(path, value) {
        path = path.trim();
        var rs = path.split(".");
        rs.length < 2 && console.error("Cant find path:" + path);
        var vm = this.get(rs[0]);
        if (!vm) {
          console.error("Cant Set VM:" + rs[0]);
          return;
        }
        var resPath = rs.slice(1).join(".");
        vm.setValue(resPath, vm.getValue(resPath) + value);
      };
      VMManager.prototype.getValue = function(path, def) {
        path = path.trim();
        var rs = path.split(".");
        if (rs.length < 2) {
          console.error("Get Value Cant find path:" + path);
          return;
        }
        var vm = this.get(rs[0]);
        if (!vm) {
          console.error("Cant Get VM:" + rs[0]);
          return;
        }
        return vm.getValue(rs.slice(1).join("."), def);
      };
      VMManager.prototype.setValue = function(path, value) {
        path = path.trim();
        var rs = path.split(".");
        if (rs.length < 2) {
          console.error("Set Value Cant find path:" + path);
          return;
        }
        var vm = this.get(rs[0]);
        if (!vm) {
          console.error("Cant Set VM:" + rs[0]);
          return;
        }
        vm.setValue(rs.slice(1).join("."), value);
      };
      VMManager.prototype.bindPath = function(path, callback, target, useCapture) {
        path = path.trim();
        if ("" == path) {
          console.error(target.node.name, "\u8282\u70b9\u7ed1\u5b9a\u7684\u8def\u5f84\u4e3a\u7a7a");
          return;
        }
        if ("*" === path.split(".")[0]) {
          console.error(path, "\u8def\u5f84\u4e0d\u5408\u6cd5,\u53ef\u80fd\u9519\u8bef\u8986\u76d6\u4e86 VMParent \u7684onLoad \u65b9\u6cd5, \u6216\u8005\u7236\u8282\u70b9\u5e76\u672a\u6302\u8f7d VMParent \u76f8\u5173\u7684\u7ec4\u4ef6\u811a\u672c");
          return;
        }
        cc.director.on(VM_EMIT_HEAD + path, callback, target, useCapture);
      };
      VMManager.prototype.unbindPath = function(path, callback, target) {
        path = path.trim();
        if ("*" === path.split(".")[0]) {
          console.error(path, "\u8def\u5f84\u4e0d\u5408\u6cd5,\u53ef\u80fd\u9519\u8bef\u8986\u76d6\u4e86 VMParent \u7684onLoad \u65b9\u6cd5, \u6216\u8005\u7236\u8282\u70b9\u5e76\u672a\u6302\u8f7d VMParent \u76f8\u5173\u7684\u7ec4\u4ef6\u811a\u672c");
          return;
        }
        cc.director.off(VM_EMIT_HEAD + path, callback, target);
      };
      VMManager.prototype.inactive = function() {
        this._mvs.forEach(function(mv) {
          mv.vm.active = false;
        });
      };
      VMManager.prototype.active = function() {
        this._mvs.forEach(function(mv) {
          mv.vm.active = true;
        });
      };
      return VMManager;
    }();
    exports.VM = new VMManager();
    cc._RF.pop();
  }, {
    "./JsonOb": "JsonOb"
  } ],
  WallC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1acceGPEpZDNrWXrw0wpOS8", "WallC");
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
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var WallC = function(_super) {
      __extends(WallC, _super);
      function WallC() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      WallC.prototype.onLoad = function() {};
      WallC = __decorate([ ccclass ], WallC);
      return WallC;
    }(cc.Component);
    exports.default = WallC;
    cc._RF.pop();
  }, {} ],
  WaterAtkC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "738d4uUfjlHwKAZW1hJvZqQ", "WaterAtkC");
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
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Bullet = function() {
      function Bullet() {}
      return Bullet;
    }();
    var WaterAtkC = function(_super) {
      __extends(WaterAtkC, _super);
      function WaterAtkC() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.mvSpeed = 10;
        _this.role = null;
        _this.pannel = null;
        _this.inputCode = new Set();
        _this._atk = 0;
        _this._mvDrVec = cc.v2(0, 0);
        _this._atkDrVec = cc.v2(0, 0);
        _this.atkBulletSpeedCount = 0;
        _this.atkBulletSpeed = 30;
        _this.atkBulletUnitWidth = 20;
        _this.atkBulletWidth = 800;
        _this.bulletArray = [];
        return _this;
      }
      Object.defineProperty(WaterAtkC.prototype, "atk", {
        get: function() {
          return this._atk;
        },
        set: function(value) {
          this._atk = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(WaterAtkC.prototype, "mvDrVec", {
        get: function() {
          return this._mvDrVec;
        },
        set: function(value) {
          this._mvDrVec = value;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(WaterAtkC.prototype, "atkDrVec", {
        get: function() {
          return this._atkDrVec;
        },
        set: function(value) {
          this._atkDrVec = value;
        },
        enumerable: false,
        configurable: true
      });
      WaterAtkC.prototype.onLoad = function() {
        this.openListen();
      };
      WaterAtkC.prototype.start = function() {};
      WaterAtkC.prototype.update = function(dt) {
        this.rolePositionSystem(dt);
        this.inputSystem(dt);
        this.waterAtk(dt);
      };
      WaterAtkC.prototype.onDisable = function() {};
      WaterAtkC.prototype.openListen = function() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.keyDownCallFunc, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.keyUpCallFunc, this);
      };
      WaterAtkC.prototype.keyDownCallFunc = function(event) {
        var keyCode = event.keyCode;
        switch (keyCode) {
         case 87:
          this.mvDrVec.y = 1;
          break;

         case 65:
          this.mvDrVec.x = -1;
          break;

         case 83:
          this.mvDrVec.y = -1;
          break;

         case 68:
          this.mvDrVec.x = 1;
          break;

         case 38:
          this.atkDrVec.y = 1;
          break;

         case 40:
          this.atkDrVec.y = -1;
          break;

         case 37:
          this.atkDrVec.x = -1;
          break;

         case 39:
          this.atkDrVec.x = 1;
          break;

         case 32:
          this.inputCode.add(keyCode);
        }
      };
      WaterAtkC.prototype.keyUpCallFunc = function(event) {
        var keyCode = event.keyCode;
        switch (keyCode) {
         case 87:
          1 === this.mvDrVec.y && (this.mvDrVec.y = 0);
          break;

         case 65:
          -1 === this.mvDrVec.x && (this.mvDrVec.x = 0);
          break;

         case 83:
          -1 === this.mvDrVec.y && (this.mvDrVec.y = 0);
          break;

         case 68:
          1 === this.mvDrVec.x && (this.mvDrVec.x = 0);
          break;

         case 38:
          1 === this.mvDrVec.y && (this.atkDrVec.y = 0);
          break;

         case 40:
          -1 === this.mvDrVec.y && (this.atkDrVec.y = 0);
          break;

         case 37:
          -1 === this.mvDrVec.x && (this.atkDrVec.x = 0);
          break;

         case 39:
          1 === this.mvDrVec.x && (this.atkDrVec.x = 0);
          break;

         case 32:
          this.inputCode.delete(keyCode);
        }
      };
      WaterAtkC.prototype.rolePositionSystem = function(dt) {
        if (0 === this.mvDrVec.x && 0 === this.mvDrVec.y) return;
        var normalizeMvDrVec = this.mvDrVec.clone();
        normalizeMvDrVec = normalizeMvDrVec.normalizeSelf().mulSelf(this.mvSpeed);
        this.role.position = this.role.position.addSelf(normalizeMvDrVec);
      };
      WaterAtkC.prototype.roleAtkSystem = function(dt) {
        var _this = this;
        if (this.atk) return;
        this.atk = 1;
        if (this.bulletArray.length <= 0) {
          var bulletNum = Math.ceil(this.atkBulletWidth / this.atkBulletUnitWidth);
          var initPos = this.role.position;
          var atkDrVec = this.atkDrVec.clone();
          cc.log(this.atkDrVec);
          for (var i = 0; i < bulletNum; i++) {
            var bullet = new Bullet();
            bullet.priority = i;
            bullet.mvDrVec = atkDrVec.normalizeSelf();
            bullet.pos = initPos.addSelf(atkDrVec.normalizeSelf().mulSelf(this.atkBulletUnitWidth)).clone();
            bullet.rolePos = this.role.position.clone();
            this.bulletArray.push(bullet);
          }
        }
        this.scheduleOnce(function() {
          _this.atk = 0;
          _this.bulletArray = [];
          _this.drawByBullet(_this.bulletArray);
        }, 3);
      };
      WaterAtkC.prototype.waterAtk = function(dt) {
        if (this.bulletArray.length > 0) {
          this.drawByBullet(this.bulletArray);
          var updateNum = 2;
          var preArr = [];
          var initPos = this.role.position.clone();
          for (var i = 0; i < updateNum; i++) preArr.push(this.bulletArray.pop());
          for (var _i = 0, preArr_1 = preArr; _i < preArr_1.length; _i++) {
            var bullet = preArr_1[_i];
            bullet.pos = initPos.addSelf(bullet.mvDrVec.normalizeSelf().mulSelf(this.atkBulletUnitWidth)).clone();
            bullet.rolePos = this.role.position.clone();
          }
          for (var _a = 0, _b = this.bulletArray; _a < _b.length; _a++) {
            var bullet = _b[_a];
            var offsetRolePos = this.role.position.sub(bullet.rolePos);
            bullet.pos.addSelf(bullet.mvDrVec.normalizeSelf().mulSelf(updateNum * this.atkBulletUnitWidth));
          }
          this.bulletArray = preArr.concat(this.bulletArray);
          for (var i = 1; i < this.bulletArray.length; i++) {
            var pre = this.bulletArray[i - 1];
            var cur = this.bulletArray[i];
            void 0 == pre && cc.log(pre);
            void 0 == cur && cc.log(cur);
            var subVec = pre.pos.sub(cur.pos);
            var difDis = subVec.mag() - this.atkBulletUnitWidth;
            cur.pos.addSelf(subVec.normalizeSelf().mulSelf(difDis));
          }
        }
      };
      WaterAtkC.prototype.inputSystem = function(dt) {
        var v = this.inputCode.values();
        while (true) {
          var value = v.next();
          if (void 0 == value.value) break;
          32 === value.value && this.roleAtkSystem(dt);
        }
      };
      WaterAtkC.prototype.drawByBullet = function(arr) {
        this.pannel.clear();
        if (arr.length <= 0) return;
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
          var bullet = arr_1[_i];
          this.pannel.lineWidth = 1;
          this.pannel.fillColor = cc.Color.YELLOW;
          var p = bullet.pos.clone();
          this.pannel.circle(p.x, p.y, 10);
          this.pannel.fill();
          this.pannel.stroke();
        }
      };
      WaterAtkC.prototype.drawByBulletLine = function(arr) {
        this.pannel.clear();
        if (arr.length <= 0) return;
        this.pannel.lineWidth = 20;
        this.pannel.strokeColor = cc.Color.RED;
        this.pannel.fillColor = cc.Color.YELLOW;
        for (var i = 0; i < arr.length; i++) {
          var bullet = arr[i];
          var p = bullet.pos.clone();
          if (0 === i) {
            this.pannel.moveTo(p.x, p.y);
            continue;
          }
          this.pannel.lineTo(p.x, p.y);
        }
        this.pannel.stroke();
      };
      WaterAtkC.prototype.drawByBulletByQuadraticCurve = function(arr) {
        this.pannel.clear();
        if (arr.length <= 0) return;
        this.pannel.lineWidth = 50;
        this.pannel.strokeColor = cc.Color.RED;
        this.pannel.fillColor = cc.Color.YELLOW;
        var key1 = arr[0];
        var key2 = arr[Math.floor(.9 * (arr.length - 1))];
        var key3 = arr[arr.length - 1];
        this.pannel.moveTo(key1.pos.x, key1.pos.y);
        this.pannel.quadraticCurveTo(key2.pos.x, key1.pos.y, key3.pos.x, key3.pos.y);
        this.pannel.stroke();
      };
      WaterAtkC.prototype.drawByBulletByBezier = function(arr) {
        this.pannel.clear();
        if (arr.length <= 0) return;
        this.pannel.lineWidth = 50;
        this.pannel.strokeColor = cc.Color.RED;
        this.pannel.fillColor = cc.Color.YELLOW;
        var key1 = arr[0];
        var key2 = arr[Math.floor(.7 * (arr.length - 1))];
        var key3 = arr[Math.floor(.9 * (arr.length - 1))];
        var key4 = arr[arr.length - 1];
        this.pannel.moveTo(key1.pos.x, key1.pos.y);
        this.pannel.bezierCurveTo(key2.pos.x, key2.pos.y, key3.pos.x, key3.pos.y, key4.pos.x, key4.pos.y);
        this.pannel.stroke();
      };
      WaterAtkC.prototype.drawBezier = function() {
        this.pannel.clear();
        this.pannel.lineWidth = 10;
        this.pannel.strokeColor = cc.Color.RED;
        this.pannel.moveTo(0, 0);
        this.pannel.quadraticCurveTo(50, 100, 100, 0);
        this.pannel.stroke();
      };
      __decorate([ property({
        displayName: "\u79fb\u52a8\u901f\u5ea6"
      }) ], WaterAtkC.prototype, "mvSpeed", void 0);
      __decorate([ property({
        displayName: "role",
        type: cc.Node
      }) ], WaterAtkC.prototype, "role", void 0);
      __decorate([ property({
        type: cc.Graphics,
        displayName: "\u753b\u677f"
      }) ], WaterAtkC.prototype, "pannel", void 0);
      WaterAtkC = __decorate([ ccclass ], WaterAtkC);
      return WaterAtkC;
    }(cc.Component);
    exports.default = WaterAtkC;
    cc._RF.pop();
  }, {} ],
  ZipC: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "25f42pEkctK97P/NhaSIpPw", "ZipC");
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
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var NewClass = function(_super) {
      __extends(NewClass, _super);
      function NewClass() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.btn = null;
        _this.fileUrl = "../../resources/json/Bullet";
        return _this;
      }
      NewClass.prototype.onLoad = function() {};
      NewClass.prototype.start = function() {};
      NewClass.prototype.btnCallFunc = function() {
        var _this = this;
        var url = cc.url.raw("resources/zip/config.zip");
        cc.loader.load({
          url: url,
          type: "binary"
        }, function(err, zipData) {
          if (err) {
            var httpUrl = "\u8d44\u6e90\u670d\u52a1\u5730\u5740" + url;
            console.log("loadConfigZip httpUrl: ", httpUrl);
            var oReq_1 = new XMLHttpRequest();
            oReq_1.open("GET", httpUrl, true);
            oReq_1.responseType = "arraybuffer";
            oReq_1.onload = function(oEvent) {
              var arrayBuffer = oReq_1.response;
              if (arrayBuffer) {
                console.log("LoadConfig::unzip 0");
                this.unzip(arrayBuffer);
              }
            };
            oReq_1.send(null);
          } else _this.unzip(zipData);
        });
      };
      NewClass.prototype.unzip = function(zipData) {
        var _this = this;
        var newZip = new JSZip();
        cc.log(zipData);
        newZip.loadAsync(zipData).then(function(zip) {
          zip.file("test.txt").async("uint8array").then(function(data) {
            cc.log("data---\x3e", data);
            _this.createFile(data);
          });
        });
      };
      NewClass.prototype.saveForBrowser = function(textToWrite, fileNameToSaveAs) {
        if (cc.sys.isBrowser) {
          console.log("\u6d4f\u89c8\u5668");
          var textFileAsBlob = new Blob([ textToWrite ], {
            type: "application/json"
          });
          var downloadLink = document.createElement("a");
          downloadLink.download = fileNameToSaveAs;
          downloadLink.innerHTML = "Download File";
          if (null != window.webkitURL) downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob); else {
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
          }
          downloadLink.click();
        }
      };
      NewClass.prototype.createFile = function(binArray) {
        var writeable_path = jsb.fileUtils.getWritablePath();
        console.log(writeable_path);
        writeable_path = "d:/";
        var new_dir = writeable_path + "new_dir";
        jsb.fileUtils.isDirectoryExist(new_dir) ? console.log("dir is exist!!!") : jsb.fileUtils.createDirectory(new_dir);
        jsb.fileUtils.writeDataToFile(binArray, new_dir + "/test.txt");
      };
      __decorate([ property({
        type: cc.Button
      }) ], NewClass.prototype, "btn", void 0);
      NewClass = __decorate([ ccclass ], NewClass);
      return NewClass;
    }(cc.Component);
    exports.default = NewClass;
    cc._RF.pop();
  }, {} ]
}, {}, [ "ObjectC", "PrefabC", "SceneC", "SliderBtnComp", "LotteryItemC", "WallC", "AssetManagerC", "BattleC", "EnclosureGameC", "FirstLoadC", "FlipCardC", "HallC", "LoadC", "LotteryC", "MainC", "RayCollisionComp", "ShadowViewC", "StateFuncC", "WaterAtkC", "ZipC", "ActionController", "AnimationController", "AttackController", "BattleController", "BulletController", "CollisionController", "Controller", "DataController", "FormulaController", "GameController", "NodeController", "RoleController", "SceneController", "SpineController", "StateController", "AlgorithmUtiles", "DataUtiles", "MathUtiles", "PolygonUtils", "Utiles", "JsonOb", "StringFormat", "VMBase", "VMCompsEdit", "VMCustom", "VMEvent", "VMLabel", "VMModify", "VMParent", "VMProgress", "VMState", "ViewModel", "BhvButtonGroup", "BhvFrameIndex", "BhvRollNumber", "BhvSwitchPage", "ObjectBase", "Bullet", "Enemy", "Hero", "Role", "StateBase", "ADState", "ActivationState", "LotteryState", "NormalState" ]);