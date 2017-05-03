var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var angel;
(function (angel) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    angel.Point = Point;
    var Rectangle = (function () {
        function Rectangle() {
            this.x = 0;
            this.y = 0;
            this.width = 1;
            this.height = 1;
        }
        Rectangle.prototype.isPointInRectangle = function (point) {
            var rect = this;
            if (point.x < rect.width + rect.x &&
                point.y < rect.height + rect.y &&
                point.x > rect.x &&
                point.y > rect.y) {
                return true;
            }
            else {
                return false;
            }
        };
        return Rectangle;
    }());
    angel.Rectangle = Rectangle;
    function pointAppendMatrix(point, m) {
        var x = m.a * point.x + m.c * point.y + m.tx;
        var y = m.b * point.x + m.d * point.y + m.ty;
        return new Point(x, y);
    }
    angel.pointAppendMatrix = pointAppendMatrix;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m) {
        var a = m.a;
        var b = m.b;
        var c = m.c;
        var d = m.d;
        var tx = m.tx;
        var ty = m.ty;
        var determinant = a * d - b * c;
        var result = new Matrix(1, 0, 0, 1, 0, 0);
        if (determinant == 0) {
            throw new Error("no invert");
        }
        determinant = 1 / determinant;
        var k = result.a = d * determinant;
        b = result.b = -b * determinant;
        c = result.c = -c * determinant;
        d = result.d = a * determinant;
        result.tx = -(k * tx + c * ty);
        result.ty = -(b * tx + d * ty);
        return result;
    }
    angel.invertMatrix = invertMatrix;
    function matrixAppendMatrix(m1, m2) {
        var result = new Matrix();
        result.a = m1.a * m2.a + m1.b * m2.c;
        result.b = m1.a * m2.b + m1.b * m2.d;
        result.c = m2.a * m1.c + m2.c * m1.d;
        result.d = m2.b * m1.c + m1.d * m2.d;
        result.tx = m2.a * m1.tx + m2.c * m1.ty + m2.tx;
        result.ty = m2.b * m1.tx + m2.d * m1.ty + m2.ty;
        return result;
    }
    angel.matrixAppendMatrix = matrixAppendMatrix;
    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD = Math.PI / 180;
    var Matrix = (function () {
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        Matrix.prototype.toString = function () {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        };
        Matrix.prototype.updateFromDisplayObject = function (x, y, scaleX, scaleY, rotation) {
            this.tx = x;
            this.ty = y;
            var skewX, skewY;
            skewX = skewY = rotation / 180 * Math.PI;
            var u = Math.cos(skewX);
            var v = Math.sin(skewX);
            this.a = Math.cos(skewY) * scaleX;
            this.b = Math.sin(skewY) * scaleX;
            this.c = -v * scaleY;
            this.d = u * scaleY;
        };
        return Matrix;
    }());
    angel.Matrix = Matrix;
})(angel || (angel = {}));
var angel;
(function (angel) {
    var TheEvent = (function () {
        function TheEvent(type, func, targetDisplayObject, ifCapture) {
            this.type = "";
            this.ifCapture = false;
            this.type = type;
            this.ifCapture = ifCapture;
            this.func = func;
            this.targetDisplayObject = targetDisplayObject;
        }
        return TheEvent;
    }());
    angel.TheEvent = TheEvent;
    var EventManager = (function () {
        function EventManager() {
        }
        EventManager.getInstance = function () {
            if (EventManager.eventManager == null) {
                EventManager.eventManager = new EventManager();
                EventManager.eventManager.targetDisplayObjcetArray = new Array();
                return EventManager.eventManager;
            }
            else {
                return EventManager.eventManager;
            }
        };
        return EventManager;
    }());
    angel.EventManager = EventManager;
})(angel || (angel = {}));
var angel;
(function (angel) {
    var Ticker = (function () {
        function Ticker() {
            this.listeners = [];
        }
        Ticker.getInstance = function () {
            if (!Ticker.instance) {
                Ticker.instance = new Ticker();
            }
            return Ticker.instance;
        };
        Ticker.prototype.register = function (listener) {
            this.listeners.push(listener);
        };
        Ticker.prototype.unregister = function (listener) {
        };
        Ticker.prototype.notify = function (deltaTime) {
            for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(deltaTime);
            }
        };
        return Ticker;
    }());
    angel.Ticker = Ticker;
})(angel || (angel = {}));
var angel;
(function (angel) {
    var Tween = (function () {
        function Tween(object, moveData, idleData) {
            this.object = object;
            this.moveData = moveData;
            this.idleData = idleData;
        }
        Tween.prototype.moveTo = function (targetX, targetY) {
            var object = this.object;
            var idleData = this.idleData;
            var moveData = this.moveData;
            object.isMove = true;
            object.setMovieClipData(moveData);
            //开启移动线程
            var moveTimer = setInterval(function () {
                if (Math.abs(object.x - targetX) <= object.moveSpeed && Math.abs(object.y - targetY) <= object.moveSpeed) {
                    console.log("OK");
                    object.x = targetX;
                    object.y = targetY;
                    object.setMovieClipData(idleData);
                    object.isMove = false;
                    clearInterval(moveTimer);
                }
                if (object.x > targetX) {
                    object.x = object.x - object.moveSpeed;
                }
                else if (object.x < targetX) {
                    object.x = object.x + object.moveSpeed;
                }
                if (object.y > targetY) {
                    object.y = object.y - object.moveSpeed;
                }
                else if (object.y < targetY) {
                    object.y = object.y + object.moveSpeed;
                }
            }, 40);
        };
        Tween.prototype.moveToStepByStep = function (point) {
            var _this = this;
            var object = this.object;
            var i = 1;
            var stepMoveInterval = setInterval(function () {
                if (!object.isMove) {
                    _this.moveTo(point[i].x, point[i].y);
                }
                if (object.x == point[point.length - 1].x && object.y == point[point.length - 1].y) {
                    clearInterval(stepMoveInterval);
                }
                //console.log("playerX: " + object.x);
                //console.log("playerY: " + object.y);
                //console.log("targetX: " + point[i].x);
                //console.log("targetY: " + point[i].y);
                //console.log("destinationX: " + point[point.length - 1].x);
                //console.log("destinantionY: " + point[point.length - 1].y);
                if (i < point.length - 1 && object.x == point[i].x && object.y == point[i].y) {
                    i++;
                }
                console.log("i:" + i);
            }, 80);
        };
        Tween.prototype.removeTween = function () {
            var object = this.object;
            object.isMove = false;
            var point = [new angel.Point(object.x, object.y)];
            this.moveToStepByStep(point);
        };
        return Tween;
    }());
    angel.Tween = Tween;
})(angel || (angel = {}));
var angel;
(function (angel) {
    var DisplayObject = (function () {
        function DisplayObject(type) {
            this.x = 0;
            this.y = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.rotation = 0;
            this.matrix = null;
            this.globalMatrix = null;
            this.alpha = 1; //相对
            this.globalAlpha = 1; //全局                             
            this.parent = null;
            this.moveSpeed = 0;
            this.touchEnable = false;
            this.eventArray = [];
            this.type = "displayObject";
            this.type = type;
            this.matrix = new angel.Matrix();
            this.globalMatrix = new angel.Matrix();
        }
        //final，所有子类都要执行且不能修改
        DisplayObject.prototype.update = function () {
            this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation); //初始化矩阵
            //console.log(this.matrix.toString());
            //Alpha值
            if (this.parent) {
                this.globalAlpha = this.parent.globalAlpha * this.alpha;
                this.globalMatrix = angel.matrixAppendMatrix(this.matrix, this.parent.globalMatrix);
            }
            else {
                this.globalAlpha = this.alpha;
                this.globalMatrix = this.matrix;
            }
            //模板方法模式
        };
        //添加到本控件的EVent数组中
        DisplayObject.prototype.addEventListener = function (type, func, targetDisplayObject, ifCapture) {
            var e = new angel.TheEvent(type, func, targetDisplayObject, ifCapture);
            this.eventArray.push(e);
        };
        return DisplayObject;
    }());
    angel.DisplayObject = DisplayObject;
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap() {
            var _this = _super.call(this, "Bitmap") || this;
            _this.image = document.createElement("img");
            return _this;
        }
        Bitmap.prototype.hitTest = function (x, y) {
            var rect = new angel.Rectangle();
            rect.x = 0;
            rect.y = 0;
            rect.width = this.image.width;
            rect.height = this.image.height;
            if (rect.isPointInRectangle(new angel.Point(x, y))) {
                if (this.eventArray.length != 0) {
                    angel.EventManager.getInstance().targetDisplayObjcetArray.push(this);
                }
                return this;
            }
            else {
                return null;
            }
        };
        return Bitmap;
    }(DisplayObject));
    angel.Bitmap = Bitmap;
    var TextField = (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            var _this = _super.call(this, "TextField") || this;
            _this.text = "";
            _this.color = "";
            _this.size = 0;
            return _this;
        }
        TextField.prototype.hitTest = function (x, y) {
            var rect = new angel.Rectangle();
            rect.x = 0;
            rect.y = -this.size; //????????
            rect.width = this.size * this.text.length;
            rect.height = this.size;
            if (rect.isPointInRectangle(new angel.Point(x, y))) {
                if (this.eventArray.length != 0) {
                    angel.EventManager.getInstance().targetDisplayObjcetArray.push(this);
                }
                return this;
            }
            else {
                return null;
            }
        };
        return TextField;
    }(DisplayObject));
    angel.TextField = TextField;
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button() {
            var _this = _super.call(this, "Button") || this;
            _this.text = "";
            _this.color = "";
            _this.size = 0;
            _this.enable = false;
            return _this;
        }
        Button.prototype.hitTest = function (x, y) {
            var rect = new angel.Rectangle();
            rect.x = 0;
            rect.y = -this.size; //????????
            rect.width = this.size * this.text.length;
            rect.height = this.size;
            if (rect.isPointInRectangle(new angel.Point(x, y)) && this.enable) {
                if (this.eventArray.length != 0) {
                    angel.EventManager.getInstance().targetDisplayObjcetArray.push(this);
                }
                return this;
            }
            else {
                return null;
            }
        };
        return Button;
    }(DisplayObject));
    angel.Button = Button;
    var DisplayObjectContainer = (function (_super) {
        __extends(DisplayObjectContainer, _super);
        function DisplayObjectContainer() {
            var _this = _super.call(this, "DisplayObjectContainer") || this;
            _this.children = [];
            return _this;
        }
        DisplayObjectContainer.prototype.update = function () {
            for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
                var displayObject = _a[_i];
                displayObject.update();
            }
        };
        DisplayObjectContainer.prototype.addChild = function (child) {
            this.children.push(child);
            child.parent = this;
        };
        DisplayObjectContainer.prototype.removeChild = function (displayObject) {
            var tempArray = this.children.concat();
            for (var _i = 0, tempArray_1 = tempArray; _i < tempArray_1.length; _i++) {
                var each = tempArray_1[_i];
                if (each == displayObject) {
                    var index = this.children.indexOf(each);
                    tempArray.splice(index, 1);
                    this.children = tempArray;
                    return;
                }
            }
        };
        DisplayObjectContainer.prototype.hitTest = function (x, y) {
            if (this.eventArray.length != 0) {
                angel.EventManager.getInstance().targetDisplayObjcetArray.push(this);
            }
            for (var i = this.children.length - 1; i >= 0; i--) {
                var child = this.children[i];
                var pointBaseOnChild = angel.pointAppendMatrix(new angel.Point(x, y), angel.invertMatrix(child.matrix)); //通过与逆矩阵相乘得出点的相对坐标---点向量
                var hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y); //树的遍历
                if (hitTestResult) {
                    return hitTestResult;
                }
            }
            return null;
        };
        return DisplayObjectContainer;
    }(DisplayObject));
    angel.DisplayObjectContainer = DisplayObjectContainer;
    var MovieClip = (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip(data) {
            var _this = _super.call(this) || this;
            _this.advancedTime = 0;
            _this.isMove = false;
            _this.ticker = function (deltaTime) {
                _this.advancedTime += deltaTime;
                if (_this.advancedTime >= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME) {
                    _this.advancedTime -= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME;
                }
                _this.currentFrameIndex = Math.floor(_this.advancedTime / MovieClip.FRAME_TIME);
                var data = _this.data;
                //console.log(this.currentFrameIndex);
                _this.image.src = data.frames[_this.currentFrameIndex].image;
            };
            _this.moveSpeed = 4;
            _this.setMovieClipData(data); //先执行一次更新
            _this.play();
            return _this;
        }
        MovieClip.prototype.play = function () {
            angel.Ticker.getInstance().register(this.ticker);
        };
        MovieClip.prototype.stop = function () {
            angel.Ticker.getInstance().unregister(this.ticker);
        };
        MovieClip.prototype.setMovieClipData = function (data) {
            this.data = data;
            this.currentFrameIndex = 0;
        };
        return MovieClip;
    }(Bitmap));
    MovieClip.FRAME_TIME = 20;
    MovieClip.TOTAL_FRAME = 12;
    angel.MovieClip = MovieClip;
})(angel || (angel = {}));
var angel;
(function (angel) {
    angel.run = function (canvas) {
        var stage = new angel.DisplayObjectContainer();
        var context2D = canvas.getContext("2d");
        var lastNow = Date.now();
        var renderer = new CanvasRenderer(stage, context2D);
        var frameHandler = function () {
            var now = Date.now();
            var deltaTime = now - lastNow;
            angel.Ticker.getInstance().notify(deltaTime);
            context2D.clearRect(0, 0, 400, 400);
            context2D.save();
            stage.update(); //计算
            renderer.render(); //渲染
            context2D.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        };
        window.requestAnimationFrame(frameHandler);
        var isMouseDown = false; //检测鼠标是否按下
        var hitResult; //检测是否点到控件
        window.onmousedown = function (e) {
            isMouseDown = true;
            var targetDisplayObjectArray = angel.EventManager.getInstance().targetDisplayObjcetArray;
            targetDisplayObjectArray.splice(0, targetDisplayObjectArray.length);
            hitResult = stage.hitTest(e.offsetX, e.offsetY);
            angel.currentX = e.offsetX;
            angel.currentY = e.offsetY;
        };
        window.onmousemove = function (e) {
            var targetDisplayObjcetArray = angel.EventManager.getInstance().targetDisplayObjcetArray;
            angel.lastX = angel.currentX;
            angel.lastY = angel.currentY;
            angel.currentX = e.offsetX;
            angel.currentY = e.offsetY;
            if (isMouseDown) {
                for (var i = 0; i < targetDisplayObjcetArray.length; i++) {
                    for (var _i = 0, _a = targetDisplayObjcetArray[i].eventArray; _i < _a.length; _i++) {
                        var event_1 = _a[_i];
                        if (event_1.type.match("onmousemove") && event_1.ifCapture) {
                            event_1.func(e);
                        }
                    }
                }
                for (var i = targetDisplayObjcetArray.length - 1; i >= 0; i--) {
                    for (var _b = 0, _c = targetDisplayObjcetArray[i].eventArray; _b < _c.length; _b++) {
                        var event_2 = _c[_b];
                        if (event_2.type.match("onmousemove") && !event_2.ifCapture) {
                            event_2.func(e);
                        }
                    }
                }
            }
        };
        window.onmouseup = function (e) {
            isMouseDown = false;
            var targetDisplayObjcetArray = angel.EventManager.getInstance().targetDisplayObjcetArray;
            targetDisplayObjcetArray.splice(0, targetDisplayObjcetArray.length);
            var newHitRusult = stage.hitTest(e.offsetX, e.offsetY);
            for (var i = targetDisplayObjcetArray.length - 1; i >= 0; i--) {
                for (var _i = 0, _a = targetDisplayObjcetArray[i].eventArray; _i < _a.length; _i++) {
                    var event_3 = _a[_i];
                    if (event_3.type.match("onclick") && newHitRusult == hitResult) {
                        event_3.func(e);
                    }
                }
            }
        };
        return stage;
    };
    var CanvasRenderer = (function () {
        function CanvasRenderer(stage, context2D) {
            this.stage = stage;
            this.context2D = context2D;
        }
        CanvasRenderer.prototype.render = function () {
            var stage = this.stage;
            var context2D = this.context2D;
            this.renderContainer(stage);
        };
        CanvasRenderer.prototype.renderContainer = function (container) {
            for (var _i = 0, _a = container.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var context2D = this.context2D;
                context2D.globalAlpha = child.globalAlpha;
                var m = child.globalMatrix;
                context2D.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                if (child.type == "Bitmap") {
                    this.renderBitmap(child);
                }
                else if (child.type == "TextField") {
                    this.renderTextField(child);
                }
                else if (child.type == "Button") {
                    this.renderButton(child);
                }
                else if (child.type == "DisplayObjectContainer") {
                    this.renderContainer(child);
                }
            }
        };
        CanvasRenderer.prototype.renderBitmap = function (bitmap) {
            this.context2D.drawImage(bitmap.image, 0, 0, bitmap.image.width, bitmap.image.height);
        };
        CanvasRenderer.prototype.renderTextField = function (textField) {
            this.context2D.font = "normal lighter " + textField.size + "px" + " cursive";
            this.context2D.fillStyle = textField.color;
            this.context2D.fillText(textField.text, 0, 0);
        };
        CanvasRenderer.prototype.renderButton = function (button) {
            this.context2D.font = "normal lighter " + button.size + "px" + " cursive";
            this.context2D.fillStyle = button.color;
            this.context2D.fillText(button.text, 0, 0);
        };
        return CanvasRenderer;
    }());
})(angel || (angel = {}));
