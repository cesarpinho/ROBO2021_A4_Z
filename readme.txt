# Scratch 3.0 on Web-Based Simulator

## Robotics Course - MIEIC FEUP - 2020/21

### Authors

 - up201604039@fe.up.pt - César Pinho
 - up201604156@fe.up.pt - João Barbosa
 - up201603854@fe.up.pt - Rui Guedes

### Requirements

 * Node.js and npm

### File Structure

The repository contains five npm packages (the first two are modified versions of Scratch packages, with the Tactode extension):
- **[scratch-gui](https://github.com/LLK/scratch-gui)** - Set of React components that comprise the interface for creating and running Scratch 3.0 projects. Modified to add the Tactode extension to the list of selectable extensions.
- **[scratch-vm](https://github.com/LLK/scratch-vm)** - Library for representing, running, and maintaining the state of computer programs written using [Scratch Blocks](https://github.com/LLK/scratch-blocks). Modified to add the Tactode extension implementation.
- **simulator** - Frontend web-based simulator emulating a physical device. Written in TypeScript and using PixiJS.
- **tactode-link** - Node web server establishing WebSocket connections with the Scratch extension and the simulator.

```
ROBO2021_A4_Z
│   README.md
│   Line Follower.sb3    
│   Line Follower + Trace.sb3
│
├── scratch-gui
│   │   package.json
|   |   ...
|   |
|   ├── src / lib / extensions
|   |   |   index.jsx (modified)
│   │   |
│   │   ├── tactode (added)
|   |   |   |   tactode-small.png (added)
|   |   |   |   tactode.png (added)
|   |   |
|   |   └── ...
|   |
|   └── ...
│
├── scratch-vm
│   │   package.json
|   |   ...
|   |
|   ├── src
|   |   |
|   |   ├── extension-support
|   |   |   |   extension-manager.js (modified)
|   |   |   |   ...
|   |   |
|   |   ├── extensions / scratch3_tactode (added)
|   |   |   |   index.js (added)
|   |   |   |   simulatedRobot.js (added)
|   |   |   |   tactode-link-websocket.js (added)
|   |   |
|   |   └── ... 
|   |
|   └── ...
│
├── simulator
│   │   package.json
│   │   ...
|   |
|   └── ...
│
└── tactode-link
    │   package.json
    │   ...
    | 
    └── ...
```

### Install and Link Dependencies

Install the dependencies of each package. Make sure to link the `scratch-vm` dependency in `scratch-gui` to the local package:

```
cd scratch-vm

npm install

npm link

cd ../scratch-gui

npm install

npm link scratch-vm

cd ../simulator

npm install

cd ../tactode-link

npm install

```

### Run the project

To run the tactode extension, you need to have the `scratch-gui`, `tactode-link` and `simulator` running.

- **scratch-gui** - `npm start`, running at `localhost:8601`
- **tactode-link** - `npm start`
- **simulator** - `npm start`, running at `localhost:8081`

> **IMPORTANT:** The simulator must be in focus in order to work correctly. Therefore, ensure that scratch-gui is in a seperate windows and the simulator tab is visible when starting the scratch program