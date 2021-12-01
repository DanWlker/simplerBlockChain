import { CryptoHelper } from './CryptoHelper';

export class ChainHelper {
    public static instance = new ChainHelper();

    createChain() {
        let genesisBlock = 
            {
                prevHash: 'genesis',
                time: Date.now().toString(),
                nonce: 0,
                ledger: [],
            } as Block
        
        CryptoHelper.mine(genesisBlock, 0); //if it doesn't work check if it's passed by reference

        let newChain:Chain = {
            chain: [genesisBlock]
        };

        return newChain
    }

    getBlockAfter(hashToGet: string, chainInstance:Chain) {
        for(let i: number = 0; i < chainInstance.chain.length; ++i) {
            if(CryptoHelper.hash(chainInstance.chain[i]) === hashToGet) {
                return chainInstance.chain.slice(i);
            } 
        }

        return [];
    }

    getLastBlock(chainInstance:Chain): Block {
        return chainInstance.chain[chainInstance.chain.length - 1];
    }
}