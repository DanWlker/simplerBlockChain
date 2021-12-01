import { ChainHelper } from "./ChainHelper";
import { CryptoHelper } from "./CryptoHelper";
import { UniversalVariable } from "./universalVariable";

export class DecentralizedChainHelper {
    public static instance = new DecentralizedChainHelper();
    chains: Chain[] = [];

    constructor() {
        this.chains.push(ChainHelper.instance.createChain())
    }

    removeSmallerChain() {
        if(this.chains.length <= 1) {
            return;
        }

        console.log("chain length " + this.chains.length);

        let maxChainNum = 0;
        for (let i = 1; i < this.chains.length; i++) {
            if(this.chains[i].chain.length > this.chains[maxChainNum].chain.length) {
                console.log("Found larger chain [decentralized]");
                maxChainNum = i;
            } else if(this.chains[i].chain.length === this.chains[maxChainNum].chain.length) {
                console.log("There are two similar sized chains. Keeping the oldest temporarily")
            }
        }
        let tempStorage = this.chains[maxChainNum];
        this.chains = [];
        this.chains.push(tempStorage);
        UniversalVariable.instance.currentLongestChain = tempStorage.chain.length;
    }

    verifyAllBlocksInChain(chainInstance:Chain):boolean {
        let previousHashHolder = 'genesis';

        for(var blockInstance of chainInstance.chain) {
            let currentBlockHash = CryptoHelper.hash(blockInstance);
            if(currentBlockHash.substr(0,4) !== '0000' ||
                blockInstance.prevHash !== previousHashHolder
            ) {
                return false;
            }
            previousHashHolder = currentBlockHash;
        }

        return true;
    }

    addToChain(chainInstance:Chain) {
       this.chains.push(chainInstance);

       this.removeSmallerChain();

    }

    getLongestChain(){
        if(this.chains.length > 1) {
            console.log("There are multiple possible longest chains currently");
        }
        return this.chains[0];
    }
}