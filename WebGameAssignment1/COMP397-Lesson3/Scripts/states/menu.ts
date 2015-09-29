// MENU STATE
module states {
    // This is where all the fun happens
    export function menu(): void {
        scene = new createjs.Container();

        stage.addChild(scene);
    }
}