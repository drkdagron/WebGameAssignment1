/// <reference path="../config/config.ts" />

/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/stats/stats.d.ts" />
/// <reference path="../typings/createjs-lib/createjs-lib.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/soundjs/soundjs.d.ts" />
/// <reference path="../typings/preloadjs/preloadjs.d.ts" />

/// <reference path="../objects/node.ts" />
/// <reference path="../objects/label.ts" />
/// <reference path="../objects/button.ts" />

/// <reference path="../states/menu.ts" />


// GLOBAL GAME FRAMEWORK VARIABLES
var canvas: HTMLElement;
var stage: createjs.Stage;
var stats: Stats;
var state: number;
var scene: createjs.Container;
var stateFunction: any; // alias for our current state

// Game Variables
var nodeCount: number = 0;  //this will give all the nodes a unique id
var nodeArray: objects.Node[];  //container for all the nodes

var levels: number = 4; //this will determine how deep a tree will be created

function init():void {
    canvas = document.getElementById("canvas"); // reference to canvas element
    stage = new createjs.Stage(canvas); // passing canvas to stage
    stage.enableMouseOver(20); // enable mouse events
    createjs.Ticker.setFPS(60); // set frame rate to 60 fps
    createjs.Ticker.on("tick", gameLoop); // update gameLoop every frame
    setupStats(); // sets up our stats counting

    nodeArray = new Array();
    nodeArray.push(new objects.Node(null, nodeCount++));
    for (var i = 0; i < levels; i++) {
        for (var j = 0; j < nodeArray.length; j++) {
            if (getLevelatNode(nodeArray[j].id) == i)
                addChildrenTo(nodeArray[j].id);
        }
    }
    var tmp = getNodesatLevel(levels);
    setScorableNode(tmp);
    console.log("Scorable tile is at: " + findScoreableNode().id);
    
    listTotalNodes();

    state = config.MENU_STATE;
    changeState();
}

function findScoreableNode(): objects.Node {
    for (var i = 0; i < nodeArray.length; i++) {
        if (nodeArray[i].correctPath == true)
            return nodeArray[i];
    }
    return null;
}
function setScorableNode(nodes: objects.Node[]): void{
    var num = Math.floor(Math.random() * nodes.length) + 1;
    console.log("Node " + num + " is the scorable node");
    nodes[num].correctPath = true;
}
function getNodesatLevel(lvl: number): objects.Node[] {
    var tmpArray: Array<objects.Node>;
    tmpArray = new Array();
    for (var i = 0; i < nodeArray.length; i++) {
        if (getLevelatNode(nodeArray[i].id) == lvl)
            tmpArray.push(nodeArray[i]);
    }

    return tmpArray;
}

function getLevelatNode(id: number): number {
    var lvl: number = 0;
    var node = getNodeAt(id);

    while (node.getParent() != null) {
        lvl++;
        node = node.getParent();
    }

    console.log("Returning getLevelof: " + id + " as " + lvl);
    return lvl;
}

function listTotalNodes(): void {
    console.log(nodeArray.length);
}

function printChildrenFor(id: number): void {
    console.log("Beginning Search");
    for (var i: number = 0; i < nodeArray.length; i++) {
        if (nodeArray[i].id != id) {
            if (nodeArray[i].getParent().id == id)
                console.log("Child: " + nodeArray[i].id);
        }
    }
}

function getNodeAt(id: number): objects.Node {
    for (var i: number = 0; i < nodeArray.length; i++) {
        if (nodeArray[i].id == id)
            return nodeArray[i];
    }

    return null;
}

function addChildrenTo(id: number): void {
    if (getChildCountAt(id) > 1)
        return;
    var currentNode: objects.Node = getNodeAt(id);
    for (var i: number = 0; i < 2; i++) {
        console.log("Adding node " + nodeCount + " to parent " + currentNode.id);
        nodeArray.push(new objects.Node(currentNode, nodeCount++));
    }
}

function getChildCountAt(id: number): number {
    var children: number = 0;
    for (var i: number = 0; i < nodeArray.length; i++) {
        if (nodeArray[i].id == id)
            children++;
    }

    return children;
}

// Main Game Loop
function gameLoop(event: createjs.Event): void {
    stats.begin(); // start counting

    stage.update(); // redraw/refresh stage every frame

    stats.end(); // stop counting
}

// Setup Game Stats
function setupStats():void {
    stats = new Stats();
    stats.setMode(0); // shows fps
    stats.domElement.style.position = "absolute";
    stats.domElement.style.left = "0px";
    stats.domElement.style.top = "0px";
    document.body.appendChild(stats.domElement);
}

// state machine prep
function changeState(): void {
    // Launch various scenes

    switch (state) {
        case config.MENU_STATE:
            // show the menu scene
            stateFunction = states.menu;

            break;
        case config.PLAY_STATE:
            // show the play scene
            break;
        case config.OVER_STATE:
            // show the game over scene
            break;
    }

    stateFunction();
}
 