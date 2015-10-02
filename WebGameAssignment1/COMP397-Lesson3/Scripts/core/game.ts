/// <reference path="../config/config.ts" />
/// <reference path="../typings/createjs-lib/createjs-lib.d.ts" />
/// <reference path="../typings/easeljs/easeljs.d.ts" />
/// <reference path="../objects/story.ts" />
/// <reference path="../objects/node.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/stats/stats.d.ts" />
/// <reference path="../typings/tweenjs/tweenjs.d.ts" />
/// <reference path="../typings/soundjs/soundjs.d.ts" />
/// <reference path="../typings/preloadjs/preloadjs.d.ts" />

/// <reference path="../objects/label.ts" />
/// <reference path="../objects/button.ts" />

/// <reference path="../states/menu.ts" />


// GLOBAL GAME FRAMEWORK VARIABLES
var canvas: HTMLElement;
var stage: createjs.Stage;
var stats: Stats;
var state: number;
var scene: createjs.Container;

// Game Variables
var nodeCount: number = 0;  //this will give all the nodes a unique id
var nodeArray: objects.Node[];  //container for all the nodes
var currentNode: number = 0;

var storyObjects: objects.Story[];  //holder for the story

var levels: number = 4; //this will determine how deep a tree will be created

function init():void {
    canvas = document.getElementById("canvas"); // reference to canvas element
    stage = new createjs.Stage(canvas); // passing canvas to stage
    stage.enableMouseOver(20); // enable mouse events
    createjs.Ticker.setFPS(60); // set frame rate to 60 fps
    createjs.Ticker.on("tick", gameLoop); // update gameLoop every frame
    setupStats(); // sets up our stats counting

    storyObjects = new Array();
    buildStory();
    
    nodeArray = new Array();
    nodeArray.push(new objects.Node(null, nodeCount++));
    for (var i = 0; i < levels; i++) {
        for (var j = 0; j < nodeArray.length; j++) {
            if (getLevelatNode(nodeArray[j].id) == i)
                addChildrenTo(nodeArray[j].id);
        }
    }
    for (var i = 0; i < nodeArray.length; i++) {
        if (i <= storyObjects.length)
            nodeArray[i].story = storyObjects[i];
    }
    var tmp = getNodesatLevel(levels);
    nodeArray[27].correctPath = true;
    console.log("Scorable tile is at: " + findScoreableNode().id);
    
    listTotalNodes();

    storyObjects = null;
    state = config.MENU_STATE;
    states.buildMenu();
}

function buildStory(): void {
    /* 0 */ storyObjects.push(new objects.Story(["You step into the house, it is old and dilapidated,", "covered in dust and cobwebs you have two choices.", "Stay on the main floor to explore or", "head up into the darkness upstairs"], "Stay on the main floor", "Head upstairs"));
    /* 1 */ storyObjects.push(new objects.Story(["You try the light switch and the old lights turn on,", "behind the stairs you see a heavy steel door,", "'but to the right is a pair of grand double doors."], "Go through heavy steel door", "Go through grand double doors"));
    /* 2 */ storyObjects.push(new objects.Story(["You head up the stairs to find a heavy", "black door in front of you, to your left along", "the railing leading deeper into the house is a hallway.", "A ghostly young man is walking down the", "toward the end of the hall."], "Go to the door", "Walk through hallway"));
    /* 3 */ storyObjects.push(new objects.Story(["You are in the dining room; the table is eight", "chairs long with a head chair at the end.", "The lights are already on, but a broken chandelier", "hangs on the right where there is a blue felted door.", "On the opposite wall against the windows", "is a solid white door."], "Go to the blue door", "Go to the white door"));
    /* 4 */ storyObjects.push(new objects.Story(["You are in the kitchen, old dishes", "are left on the counter.The large room", "is mostly untouched except for a path with", "dusty prints towards a darkened entry way.", "To the left is a moonlit entry way."], "Check darkened entry way", "Walk to moonlit entry way"));
    /* 5 */ storyObjects.push(new objects.Story(["At the end of the hall you are stopped", "by the window overlooking the driveway.", "To your left, the door is open ajar and to ", "your right is a red wooden door.You hear", " crying in behind the red door."], "Check the open door", "Open red wooden door"));
    /* 6 */ storyObjects.push(new objects.Story(["You enter the studio, the ghost of", "Lady Fairfield is sitting in front of an", "aisle with a fade painting of Lord Jacob Fairfield.", "When she sees you, she screams and disappears.", "Within the room you see a Dumbwaiter lift at", "the far wall and to your right", "is a screen door leading outside."], "Go outside", "Walk to dumbwaiter"));

    /* 7 */ storyObjects.push(new objects.Story(["You are taken to a hallway, the floor", "collapsed and standing there is", "Aunt Hailey Fairfield. She turns away,", "walking through the wall."],
        "Get back up", "Jump down"));
    /* 8 */ storyObjects.push(new objects.Story(["Leads you out into the Garden lane, ahead", "of you in a broken and dried up fountain;", "sitting on the rim is Young Amy Fairfield.", "She shakes her head and vanishes"],
        "Turn back", "Look in fountain"));
    /* 9 */ storyObjects.push(new objects.Story(["You step through the entryway, falling", "ten meters into a pile of bones.", "The ghostly head of Butler Shamski Jenners", "sits beside you."],
        "Look under head", "Look under bones"));
    /* 10 */ storyObjects.push(new objects.Story(["You step into a bend of a hallway, the wall", "destroyed and blocking your advance. Uncle Wallace", "Fairfield is standing in front of the debris", "with his arms crossed, vanishing in", "moments. The hole looks out into the Garden."],
        "Step into the garden", "Check in the debris"));
    /* 11 */ storyObjects.push(new objects.Story(["You enter the main bathroom, the bath", "tub is full and the words help me is smeared", "on the mirror in blood. As you look in", "the mirror, you see a body in the water of the tub.", "You turn around and see the ghost of young Cynthia", "Fairfield. She vanishes and leaves you in", "the silence of the house."],
        "Check the Tub", "Check behind mirror"));
    /* 12 */ storyObjects.push(new objects.Story(["You enter into the master bedroom. You find Uncle", "Charlie and Aunt June Fairfield embracing", "in the room.The ghost Charlie breaks June’s neck", "and fades away. Uncle Charlie Fairfield was the one", "to murder the rest of the family."],
        "Check under the bed", "Run back into the hallway"));
    /* 13 */ storyObjects.push(new objects.Story(["You step out onto a long balcony, on the", "bench at the end is a skeleton in a business suit.", "In his lap is a briefcase with the initials of", "Jacob Fairfield. Who is this man though?"],
        "Check the briefcase", "Check the suit"));
    /* 14 */ storyObjects.push(new objects.Story(["A supernatural force pushes you into the", "empty dumbwaiter chute, falling from the upstairs", "to the basement onto the broken lift. Standing", "above you in young master Dylan Fairfield who", "points and laughs at you as he fades away."],
        "Check the basement", "Check dumbwaiter chute"));
    //these are the good and bad results
    storyObjects.push(new objects.Story(["You begin pulling yourself back up.", "Aunt Hailey comes back through the wall and scares you.","You fall into the hole to your death."], "", ""));
    storyObjects.push(new objects.Story(["Your legs shatter as you hit the ground.","Aunt Hailey begins laughing histerically."], "", ""));
    storyObjects.push(new objects.Story(["The flowers come to life and begin to suffocate you.","Young Amy appears back on the fountain smiling."], "", ""));
    storyObjects.push(new objects.Story(["As you look into the fountain Young Amy","appears in the water and pulls you under."], "", ""));
    storyObjects.push(new objects.Story(["The head screams as you grab it as frighten","you pull back and impale yourself on bones."], "", ""));
    storyObjects.push(new objects.Story(["The bones of Shamski Jenner come to life and","he begins stabbing you with his knife."], "", ""));
    storyObjects.push(new objects.Story(["As you begin stepping into the garden, Wallace","pushes you extremely hard and you smash your","head against the ground and begin to bleed out."], "", ""));
    storyObjects.push(new objects.Story(["As you begin to checking the debris Wallace howls","and pushes the debris into you knocking you","unconscious."], "", ""));
    storyObjects.push(new objects.Story(["The ghost panics as she sees you look over","jumping out of the tub and starts to","violently attack you."], "", ""));
    storyObjects.push(new objects.Story(["A ghost appears behind you and you watch the","mirror as she puts a knife through","your torso."], "", ""));
    storyObjects.push(new objects.Story(["The ghosts pull you out from under the","bed and throw you out the window."], "", ""));
    storyObjects.push(new objects.Story(["As you turn around to leave you get pulled","onto the bed and smothered. You panic but","fail to free yourself."], "", ""));
    storyObjects.push(new objects.Story(["You open the briefcase and look inside.","You find $3 million dollars in cash."], "", ""));
    storyObjects.push(new objects.Story(["You pull the jacket open to see the mans gun.","As you go to reach for it. You hear someone scream","and you stumble and get shot from behind."], "", ""));
    storyObjects.push(new objects.Story(["As you begin to get out of the dumbwaiter the","young master breaks all the lights and shuts","all the doors leaving you in darkness."], "", ""));
    storyObjects.push(new objects.Story(["You check under the dumbwaiter. You","hear noices above you, you try to get out but","its too late as the pully system comes","crashing down."], "", ""));
}

function resetGame() {
    currentNode = 0;
    stage.removeAllChildren();
    states.buildMenu();
}

function moveToParent() {
    currentNode = getNodeAt(currentNode).getParent().id;
    states.buildLevel();
}

function moveThroughTree(left: boolean) {
    //if left is true then go down the left child (first added child) and false means right (second)
    if (left)
        currentNode = getChildrenAt(currentNode)[0].id;
    else
        currentNode = getChildrenAt(currentNode)[1].id;

    if (getLevelatNode(currentNode) < levels)
        states.buildLevel();
    else
        states.buildChoice();
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
function getChildrenAt(id: number): objects.Node[] {
    var tmp: objects.Node[];
    tmp = new Array();
    for (var i = 1; i < nodeArray.length; i++) { //skip root node as he has no parent
        if (nodeArray[i].getParent().id == id)
            tmp.push(nodeArray[i]);
    }

    return tmp;
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
 