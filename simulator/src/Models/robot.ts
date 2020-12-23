export class RobotModel {
    private _x: number;
    private _y: number;
    private _rotation: number;
    private _linearVelocity: number;
    private _angularVelocity: number;
    
    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get rotation(): number {
        return this._rotation;
    }

    // Angle supplied in degrees, converted to radians (Using PIXI.js naming convention of angle->degrees, rotation->radians)
    set angle(angle: number) {
        this._angularVelocity = angle * Math.PI / 180;
    }

    set linearVelocity(linear: number) {
        this._linearVelocity = linear;
    }

    set angularVelocity(angular: number) {
        this._angularVelocity = angular;
    }

    constructor(canvasWidth: number, canvasHeight: number) {
        this._x = canvasWidth / 2;
        this._y = canvasHeight / 2;
        this._rotation = this.linearVelocity = this.angularVelocity = 0;
    }

    update(delta: number): void {
        this._x += this._linearVelocity * Math.cos(-this._rotation) * delta;
        this._y -= this._linearVelocity * Math.sin(-this._rotation) * delta;
        this._rotation += this._angularVelocity * delta;
    }
}