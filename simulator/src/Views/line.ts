import { Application, Graphics, Point, InteractionEvent} from 'pixi.js'

export class LineView {
    static readonly THICKNESS = 10;

    private _app: Application;
    private _drawingPosition: Point;

    constructor(app: Application) {
        this._app = app;
        this._drawingPosition = new Point();

        const myGraph = new Graphics().lineStyle(LineView.THICKNESS, 0x0);
        this._app.stage.addChild(myGraph);

        this._app.renderer.plugins.interaction.on('pointerup', (event: InteractionEvent) => {
            if (this._drawingPosition.x !== 0) {
                myGraph.moveTo(this._drawingPosition.x, this._drawingPosition.y);
                myGraph.lineTo(event.data.global.x, event.data.global.y);
            }

            this._drawingPosition.copyFrom(event.data.global);
            console.log(this._drawingPosition)
        })
    }
}
