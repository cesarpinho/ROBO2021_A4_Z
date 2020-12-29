import { TactodeLinkWebSocket } from 'tactode-link-websocket'
import { RobotModel } from 'Models/robot';
import { LineView } from 'Views/line';
import { Matrix } from 'pixi.js';

interface Message {
    message: String, 
    angle?: number,
    direction?: number,
}

export class RobotController {
    static readonly LINE_OFFSET_RANGE = 100;

    private _robotModel: RobotModel;
    private _lineView: LineView;

    constructor(robotModel: RobotModel, lineView: LineView) {
        this._robotModel = robotModel;
        this._lineView = lineView;

        const tactodeLinkWebSocket = new TactodeLinkWebSocket();
        tactodeLinkWebSocket.setHandleMessage(this.handleMessage.bind(this));
        tactodeLinkWebSocket.open();

        setInterval(() => {
            tactodeLinkWebSocket.sendMessage({
                x: this._robotModel.x,
                y: this._robotModel.y,
                angle: this._robotModel.angle,
                lineOffset: this.getLineOffset(),
            });
        }, 100);
    }

    private handleMessage(data: Message): void {
        switch (data.message) {
            case 'Go forward':
                this._robotModel.linearVelocity = 0.2;
                this._robotModel.angularVelocity = 0;
                break;
            case 'Turn':
                this._robotModel.angularVelocity = !!data.direction ? 1 * Math.PI : -1 * Math.PI;
                break;
            case 'Stop':
                this._robotModel.linearVelocity = 0;
                this._robotModel.angularVelocity = 0;
                break;
        }
    }

    private getLineOffset() {
        const renderTransform = new Matrix()
            .translate(- this._robotModel.x, -this._robotModel.y)
            .rotate(-this._robotModel.rotation)
            .translate(-RobotModel.PIXELS_RADIUS, LineView.SENSOR_PIXEL_SIZE / 2);
        
        const sensorPixels = this._lineView.getSensorPixels(renderTransform);
        const pixelHalfLength = Math.ceil(sensorPixels.length / 2);

        const linePoints = sensorPixels.reduce((filteredIndexes, value, index) => {
            if (value !== 0) {
                filteredIndexes.push(index - pixelHalfLength);
            }
            return filteredIndexes;
        }, []);

        return linePoints.length == 0 
            ? RobotController.LINE_OFFSET_RANGE 
            : Math.round(RobotController.LINE_OFFSET_RANGE / pixelHalfLength * linePoints.reduce((mean, x) => {
                return mean + x / linePoints.length;
            }, 0));
    }
}