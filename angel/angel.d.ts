declare namespace angel {
    class Point {
        x: number;
        y: number;
        constructor(x: number, y: number);
    }
    class Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
        isPointInRectangle(point: Point): boolean;
    }
    function pointAppendMatrix(point: Point, m: Matrix): Point;
    /**
     * 使用伴随矩阵法求逆矩阵
     * http://wenku.baidu.com/view/b0a9fed8ce2f0066f53322a9
     */
    function invertMatrix(m: Matrix): Matrix;
    function matrixAppendMatrix(m1: Matrix, m2: Matrix): Matrix;
    class Matrix {
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        toString(): string;
        updateFromDisplayObject(x: number, y: number, scaleX: number, scaleY: number, rotation: number): void;
    }
}
declare namespace angel {
    class TheEvent {
        type: string;
        ifCapture: boolean;
        targetDisplayObject: DisplayObject;
        func: Function;
        constructor(type: string, func: Function, targetDisplayObject: DisplayObject, ifCapture: boolean);
    }
    class EventManager {
        targetDisplayObjcetArray: DisplayObject[];
        static eventManager: EventManager;
        static getInstance(): EventManager;
    }
}
declare namespace angel {
    type Ticker_Listener_Type = (deltaTime: number) => void;
    class Ticker {
        private static instance;
        static getInstance(): Ticker;
        listeners: Ticker_Listener_Type[];
        register(listener: Ticker_Listener_Type): void;
        unregister(listener: Ticker_Listener_Type): void;
        notify(deltaTime: number): void;
    }
}
declare namespace angel {
    class Tween {
        private moveData;
        private idleData;
        private object;
        constructor(object: MovieClip, moveData: MovieClipData, idleData: MovieClipData);
        moveTo(targetX: number, targetY: number): void;
        moveToStepByStep(point: Point[]): void;
        removeTween(): void;
    }
}
declare namespace angel {
    type MovieClipData = {
        name: string;
        frames: MovieClipFrameData[];
    };
    type MovieClipFrameData = {
        "image": string;
    };
    interface Drawable {
        update(): any;
    }
    abstract class DisplayObject implements Drawable {
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        matrix: Matrix;
        globalMatrix: Matrix;
        alpha: number;
        globalAlpha: number;
        parent: DisplayObject;
        moveSpeed: number;
        touchEnable: boolean;
        eventArray: TheEvent[];
        type: string;
        constructor(type: string);
        update(): void;
        addEventListener(type: string, func: Function, targetDisplayObject: DisplayObject, ifCapture: boolean): void;
        abstract hitTest(x: number, y: number): DisplayObject;
    }
    class Bitmap extends DisplayObject {
        image: HTMLImageElement;
        constructor();
        hitTest(x: number, y: number): this;
    }
    class TextField extends DisplayObject {
        text: string;
        color: string;
        size: number;
        constructor();
        hitTest(x: number, y: number): this;
    }
    class Button extends DisplayObject {
        text: string;
        color: string;
        size: number;
        enable: boolean;
        constructor();
        hitTest(x: number, y: number): this;
    }
    class DisplayObjectContainer extends DisplayObject {
        children: DisplayObject[];
        constructor();
        update(): void;
        addChild(child: DisplayObject): void;
        removeChild(displayObject: DisplayObject): void;
        hitTest(x: number, y: number): DisplayObject;
    }
    class MovieClip extends Bitmap {
        private advancedTime;
        private static FRAME_TIME;
        private static TOTAL_FRAME;
        private currentFrameIndex;
        private data;
        isMove: boolean;
        constructor(data: MovieClipData);
        ticker: (deltaTime: any) => void;
        play(): void;
        stop(): void;
        setMovieClipData(data: MovieClipData): void;
    }
}
declare namespace angel {
    var currentX: number;
    var currentY: number;
    var lastX: number;
    var lastY: number;
    let run: (canvas: HTMLCanvasElement) => DisplayObjectContainer;
}
