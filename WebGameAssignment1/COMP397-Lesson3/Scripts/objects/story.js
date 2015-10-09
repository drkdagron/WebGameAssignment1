var objects;
(function (objects) {
    var Story = (function () {
        function Story(story, c1, c2) {
            this.story = story;
            this.leftChoice = c1;
            this.rightChoice = c2;
        }
        return Story;
    })();
    objects.Story = Story;
})(objects || (objects = {}));
