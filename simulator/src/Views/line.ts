import { Application, Graphics, Point, InteractionEvent, RenderTexture, Matrix, Sprite } from 'pixi.js'

export class LineView {
    static readonly SENSOR_PIXEL_SIZE = 50; // How many pixels are sensed in a line

    static readonly THICKNESS = 10;

    private _app: Application;
    private _drawingPosition: Point;

    private _linePath: Graphics;
    private _lineRenderTexture: RenderTexture;

    constructor(app: Application) {
        this._app = app;
        this._drawingPosition = new Point();

        this._lineRenderTexture = RenderTexture.create({ width: 1, height: LineView.SENSOR_PIXEL_SIZE });
        this._linePath = new Graphics().lineStyle(LineView.THICKNESS, 0x0);

        this._app.stage.addChild(this._linePath);

        this._app.renderer.plugins.interaction.on('pointerup', (event: InteractionEvent) => {
            if (this._drawingPosition.x !== 0) {
                this._linePath.moveTo(this._drawingPosition.x, this._drawingPosition.y);
                this._linePath.lineTo(event.data.global.x, event.data.global.y);
            }

            this._drawingPosition.copyFrom(event.data.global);
        });
    }

    public getSensorPixels(transformMatrix: Matrix): Uint8Array {
        this._app.renderer.render(this._linePath, this._lineRenderTexture, undefined, transformMatrix);
        return this._app.renderer.extract.pixels(this._lineRenderTexture).filter((_v, i) => i % 4 == 3);
    }
}
