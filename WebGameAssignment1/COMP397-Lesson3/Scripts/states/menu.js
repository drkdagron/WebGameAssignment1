// MENU STATE
var states;
(function (states) {
    // This is where all the fun happens
    function menu() {
        scene = new createjs.Container();
        stage.addChild(scene);
    }
    states.menu = menu;
})(states || (states = {}));
//# sourceMappingURL=menu.js.map