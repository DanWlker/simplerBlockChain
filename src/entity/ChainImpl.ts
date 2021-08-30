import { BlockImpl } from "./BlockImpl";

class ChainImpl {
    public static instance = new ChainImpl();

    chain: Block[];

    constructor() {
        this.chain = [new BlockImpl('genesis', [])];
    }

    get lastBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block: Block) {
        
    }
}