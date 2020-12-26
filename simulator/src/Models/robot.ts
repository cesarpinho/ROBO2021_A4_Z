export class RobotModel {
    static readonly PIXELS_TO_METER = 500;

    private _x: number;
    private _y: number;
    private _rotation: number;
    private _linearVelocity: number;
    private _angularVelocity: number;
    
    get x(): number {
        return RobotModel.PIXELS_TO_METER * this._x;
    }

    get y(): number {
        return RobotModel.PIXELS_TO_METER * this._y;
    }

    get rotation(): number {
        return this._rotation;
    }

    get angle(): number {
        return this._rotation * 180 / Math.PI;
    }

    set linearVelocity(linear: number) {
        this._linearVelocity = linear;
    }

    set angularVelocity(angular: number) {
        this._angularVelocity = angular;
    }

    constructor(canvasWidth: number, canvasHeight: number) {
        this._x = canvasWidth / (2 * RobotModel.PIXELS_TO_METER);
        this._y = canvasHeight / (2 * RobotModel.PIXELS_TO_METER);
        this._rotation = this.linearVelocity = this.angularVelocity = 0;
    }

    update(delta: number): void {
        this._x += this._linearVelocity * Math.cos(-this._rotation) * delta;
        this._y -= this._linearVelocity * Math.sin(-this._rotation) * delta;
        this._rotation += this._angularVelocity * delta;
    }
}