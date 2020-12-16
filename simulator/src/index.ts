import { Application, Sprite, utils } from 'pixi.js'
import { Robot } from './robot'

utils.sayHello(utils.isWebGLSupported() ? "WebGL" : "canvas");

const app = new Application();
app.renderer.backgroundColor = 0xffffff;

document.body.appendChild(app.view);

app.loader.add('robot', '../assets/robot.png').load((_loader, resources) => {
    const robotView = new Sprite(resources.robot.texture);

    // Set origin to center
    robotView.anchor.x = 0.5;
    robotView.anchor.y = 0.5;

    const robotModel = new Robot([app.renderer.width / 2, app.renderer.height / 2]);

    // Add the robot to the scene
    app.stage.addChild(robotView);

    app.ticker.add((delta: Number) => {
        robotModel.update(delta)
        robotView.position.set(...robotModel.getPosition());
    })
});
