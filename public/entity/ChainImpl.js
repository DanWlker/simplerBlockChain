"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BlockImpl_1 = require("./BlockImpl");
class ChainImpl {
    constructor() {
        this.chain = [new BlockImpl_1.BlockImpl('genesis', [])];
    }
    get lastBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(block) {
    }
}
ChainImpl.instance = new ChainImpl();
