import * as crypto from 'crypto';
import { CryptoHelper } from './CryptoHelper';

export class Chain {
    public static instance = new Chain();

    blockSize = 3;
    chain: Block[];
    pool: Block;

    constructor() {
        let genesisBlock = 
            {
                prevHash: 'genesis',
                time: Date.now().toString(),
                nonce: 0,
                ledger: [],
            } as Block
        
        this.mine(genesisBlock);

        this.chain = [
            genesisBlock
        ]
        this.pool = 
            {
                prevHash: CryptoHelper.hash(genesisBlock),
                time: '0',
                nonce: 0,
                ledger:[]
            } as Block
    }

    lastBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    mine(block: Block) {
        console.log('Mining....');

        while(true) {
            block.nonce += 1;

            const attempt = CryptoHelper.hash(block);

            if(attempt.substr(0,4) === '0000') {
                console.log(`Nonce val: ${block.nonce}`);
                return;
            }
        }
    }

    addCase(senderCase: Case, senderPublicKey: string, signature: Buffer) {
        console.log('Verifying authenticity');
        const isValid = CryptoHelper.verifyAuthenticity(senderCase, senderPublicKey, signature);

        if(isValid) {
            console.log('Authenticity verified, adding case..')
            this.pool.ledger.push(senderCase);
            console.log('Case added successfully to pool');
            console.log(`Current pool size: ${this.pool.ledger.length}`) 

            if(this.pool.ledger.length >= this.blockSize) {
                console.log('Block size limit reached, creating new block');
                this.addPoolToChain();
            }
            
        } else {
            console.log('Case is not valid');
        }
    }
    addPoolToChain() {
        this.pool.time = Date.now().toString();
        this.mine(this.pool);
        this.chain.push(this.pool);
        this.pool = {
            prevHash: CryptoHelper.hash(this.lastBlock()),
            time: '0',
            nonce: 0,
            ledger:[]
        } as Block;
        console.log(this);
    }

    getBlockAfter(hashToGet: string) {
        for(let i: number = 0; i < this.chain.length; ++i) {
            if(CryptoHelper.hash(this.chain[i]) === hashToGet) {
                return this.chain.slice(i);
            } 
        }

        return [];
    }

}