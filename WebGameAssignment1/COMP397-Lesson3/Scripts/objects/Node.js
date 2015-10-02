var objects;
(function (objects) {
    var Node = (function () {
        function Node(p, i) {
            this.correctPath = false;
            this.parent = p;
            this.id = i;
        }
        Node.prototype.getParent = function () {
            return this.parent;
        };
        Node.prototype.getParentString = function () {
            if (this.parent != null)
                return "ID: " + this.id.toString() + ", Parent: " + this.parent.id.toString();
            else
                return "ID: " + this.id.toString() + ", No Parent!";
        };
        return Node;
    })();
    objects.Node = Node;
})(objects || (objects = {}));
//# sourceMappingURL=node.js.map