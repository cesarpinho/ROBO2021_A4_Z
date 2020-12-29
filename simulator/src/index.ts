import { Application, utils } from 'pixi.js'
import { RobotModel } from 'Models/robot';
import { RobotView } from 'Views/robot';
import { RobotController } from 'Controllers/robot';
import { LineView } from 'Views/line';

utils.sayHello(utils.isWebGLSupported() ? "WebGL" : "canvas");

const app = new Application();
app.renderer.backgroundColor = 0xffffff;
document.body.appendChild(app.view);

const robotModel = new RobotModel(app.renderer.width, app.renderer.height);
const robotView = new RobotView(app, robotModel);

const lineView = new LineView(app);

const robotController = new RobotController(robotModel, lineView);

app.loader.load((loader, resources) => {
    robotView.load(loader, resources);
});
