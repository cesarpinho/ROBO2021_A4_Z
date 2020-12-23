import { Application, Sprite } from 'pixi.js'
import { RobotModel } from 'Models/robot'

export class RobotView {
    private _app: Application;
    private _robotModel: RobotModel;

    constructor(app: Application, robotModel: RobotModel) {
        this._app = app;
        this._robotModel = robotModel;

        document.body.appendChild(app.view);

        app.loader.add('robot', '../assets/robot.png')
    }

    load(_loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) {
        const sprite = new Sprite(resources.robot.texture);

        // Set origin to center
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;

        // Add the robot to the scene
        this._app.stage.addChild(sprite);

        this._app.ticker.add((delta: number) => {
            this._robotModel.update(delta);

            sprite.position.set(this._robotModel.x, this._robotModel.y);
            sprite.rotation = this._robotModel.rotation;
        });
    }
}