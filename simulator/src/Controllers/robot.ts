import { TactodeLinkWebSocket } from 'tactode-link-websocket'
import { RobotModel } from 'Models/robot';

interface Message {
    message: String, 
    angle?: number,
}

export class RobotController {
    private _robotModel: RobotModel;

    constructor(robotModel: RobotModel) {
        this._robotModel = robotModel;

        const tactodeLinkWebSocket = new TactodeLinkWebSocket();
        tactodeLinkWebSocket.setHandleMessage(this.handleMessage.bind(this));
        tactodeLinkWebSocket.open();
    }

    
    handleMessage(data: Message): void {
        switch (data.message) {
            case 'Go forward':
                this._robotModel.linearVelocity = 1;
                break;
            case 'Turn':
                this._robotModel.angle = data.angle;
                break;
            case 'Stop':
                this._robotModel.linearVelocity = 0;
                this._robotModel.angle = 0;
                break;
        }
    }
}