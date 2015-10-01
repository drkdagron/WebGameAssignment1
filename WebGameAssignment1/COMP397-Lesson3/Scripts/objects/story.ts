module objects {
    export class Story {
        constructor(story:string[], c1: string, c2: string)
        {
            this.story = story;
            this.leftChoice = c1;
            this.rightChoice = c2;
        }

        story: string[];

        leftChoice: string;
        rightChoice: string;
    }
}