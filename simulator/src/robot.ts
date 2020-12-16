import { TactodeLinkWebSocket } from './tactode-link-websocket'

export class Robot {
    static PIXELS_TO_METER = 500;

    private position: [number, number]

    constructor(position: [number, number]) {
        const tactodeLinkWebSocket = new TactodeLinkWebSocket();
        tactodeLinkWebSocket.setHandleMessage(this.handleMessage);
        tactodeLinkWebSocket.open();

        this.position = position;
    }

    update(delta: Number): void {

    }
    
    getPosition(): [number, number] {
        return this.position;
    }

    handleMessage(): void {

    }
}