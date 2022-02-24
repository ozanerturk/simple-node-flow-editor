import { Bearing } from "../nodes/Bearing";
import { Engine } from "../nodes/Engine";
import { Node } from "../lib/Node";
import { plainToClass } from 'class-transformer';

export class NodeParser {
    jsonObject: any;

    constructor (json: string) {
        this.jsonObject = JSON.parse(json);
    }

    parse() {
        let nodes: Node[] = []
        for (let node of this.jsonObject.nodes) {
            switch (node.name) {
                case "Bearing":
                    nodes.push(plainToClass(Bearing, node));
                case "Engine":
                    nodes.push(plainToClass(Engine, node));

            }
        }
        console.log(nodes[0])
        return nodes;
    }
}