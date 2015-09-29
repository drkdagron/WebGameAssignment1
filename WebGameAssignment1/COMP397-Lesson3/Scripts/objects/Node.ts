module objects {
    export class Node {
        protected parent: Node;
        id: number;

        constructor(p:Node, i:number) {
            this.parent = p;
            this.id = i;
        }

        getParent(): Node {
            return this.parent;
        }
        getParentString(): string {
            if (this.parent != null)
                return "ID: " + this.id.toString() + ", Parent: " + this.parent.id.toString();
            else
                return "ID: " + this.id.toString() + ", No Parent!";
        }
    }
}