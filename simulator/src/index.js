import * as PIXI from 'pixi.js'

PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? "WebGL" : "canvas");

const app = new PIXI.Application();
app.renderer.backgroundColor = 0xffffff;

document.body.appendChild(app.view);

app.loader.add('robot', 'assets/robot.png').load((_loader, resources) => {
    const robot = new PIXI.Sprite(resources.robot.texture);

    // Set position to center
    robot.x = app.renderer.width / 2;
    robot.y = app.renderer.height / 2;

    // Set origin to center
    robot.anchor.x = 0.5;
    robot.anchor.y = 0.5;

    // Add the robot to the scene
    app.stage.addChild(robot);
});
