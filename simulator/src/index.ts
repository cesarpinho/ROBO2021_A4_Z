import { Application, utils } from 'pixi.js'
import { RobotModel } from 'Models/robot';
import { RobotView } from 'Views/robot';
import { RobotController } from 'Controllers/robot';

utils.sayHello(utils.isWebGLSupported() ? "WebGL" : "canvas");

const app = new Application();
app.renderer.backgroundColor = 0xffffff;
document.body.appendChild(app.view);

const robotModel = new RobotModel(app.renderer.width, app.renderer.height);
const robotView = new RobotView(app, robotModel);
const _robotController = new RobotController(robotModel);

app.loader.load((loader, resources) => {
    robotView.load(loader, resources);
});
