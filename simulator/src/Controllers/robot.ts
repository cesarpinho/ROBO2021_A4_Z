import { TactodeLinkWebSocket } from 'tactode-link-websocket'
import { RobotModel } from 'Models/robot';

interface Message {
    message: String, 
    angle?: number,
    direction?: number,
}

export class RobotController {
    private _robotModel: RobotModel;

    constructor(robotModel: RobotModel) {
        this._robotModel = robotModel;

        const tactodeLinkWebSocket = new TactodeLinkWebSocket();
        tactodeLinkWebSocket.setHandleMessage(this.handleMessage.bind(this));
        tactodeLinkWebSocket.open();

        setInterval(() => {
            tactodeLinkWebSocket.sendMessage({
                x: this._robotModel.x,
                y: this._robotModel.y,
                angle: this._robotModel.angle,
            });
        }, 100);
    }

    handleMessage(data: Message): void {
        switch (data.message) {
            case 'Go forward':
                this._robotModel.linearVelocity = 0.2;
                this._robotModel.angularVelocity = 0;
                break;
            case 'Turn':
                this._robotModel.angularVelocity = !!data.direction ? 0.5 * Math.PI : -0.5 * Math.PI;
                break;
            case 'Stop':
                this._robotModel.linearVelocity = 0;
                this._robotModel.angularVelocity = 0;
                break;
        }
    }
}