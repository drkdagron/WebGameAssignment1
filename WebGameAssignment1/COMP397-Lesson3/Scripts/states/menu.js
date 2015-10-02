// MENU STATE
var states;
(function (states) {
    // This is where all the fun happens
    function buildMenu() {
        scene = new createjs.Container();
        var intro = ["Step into Fairfield manor’s gates;", "house of a very rich business man named Jacob,", "who died very suddenly.", "The family came to the house to discuss the", "inheritance, but for reasons unknown they disappeared.", "Rumour has it that the inheritance is still inside.", "Can you find it."];
        for (var i = 0; i < intro.length; i++) {
            var tmp = new objects.Label(intro[i], "26px Arial", "#000000", 320, (100 + (i * 30)));
            scene.addChild(tmp);
        }
        var start = new objects.Button("Start", 320, 360);
        start.on("click", function (event) { buildLevel(); });
        scene.addChild(start);
        stage.addChild(scene);
    }
    states.buildMenu = buildMenu;
    function buildLevel() {
        stage.removeAllChildren();
        scene = new createjs.Container();
        for (var i = 0; i < getNodeAt(currentNode).story.story.length; i++) {
            var tmp = new objects.Label(getNodeAt(currentNode).story.story[i], "26px Arial", "#000000", 320, (100 + (i * 30)));
            scene.addChild(tmp);
        }
        var leftChoice = new objects.Label(getNodeAt(currentNode).story.leftChoice, "20px Arial", "#000000", 180, 320);
        scene.addChild(leftChoice);
        var rightChoice = new objects.Label(getNodeAt(currentNode).story.rightChoice, "20px Arial", "#000000", 460, 320);
        scene.addChild(rightChoice);
        //320 mid
        if (currentNode != 0) {
            var up = new objects.Button("Back", 320, 50);
            up.on("click", function (event) { moveToParent(); });
            scene.addChild(up);
        }
        var back = new objects.Button("Left", 180, 360);
        back.on("click", function (event) { moveThroughTree(true); });
        scene.addChild(back);
        var next = new objects.Button("Right", 460, 360);
        next.on("click", function (event) {
            moveThroughTree(false);
        });
        scene.addChild(next);
        stage.addChild(scene);
    }
    states.buildLevel = buildLevel;
    function buildChoice() {
        stage.removeAllChildren();
        scene = new createjs.Container();
        for (var i = 0; i < getNodeAt(currentNode).story.story.length; i++) {
            var tmp = new objects.Label(getNodeAt(currentNode).story.story[i], "24px Arial", "#000000", 320, (100 + (i * 30)));
            scene.addChild(tmp);
        }
        if (getNodeAt(currentNode).correctPath == true) {
            var tmp = new objects.Label("You found the treasure!", "24px Arial", "#000000", 320, 320);
            scene.addChild(tmp);
        }
        else {
            var tmp = new objects.Label("You died!", "24px Arial", "#000000", 320, 320);
            scene.addChild(tmp);
        }
        var returnToMenu = new objects.Button("Back", 320, 380);
        returnToMenu.on("click", function (event) { resetGame(); });
        scene.addChild(returnToMenu);
        stage.addChild(scene);
    }
    states.buildChoice = buildChoice;
})(states || (states = {}));
