import { BlockImpl } from "./BlockImpl";
import * as crypto from 'crypto';

export class ChainImpl {
    public static instance = new ChainImpl();

    blockSize = 3;
    chain: BlockImpl[];
    pool: BlockImpl;

    constructor() {
        this.chain = [new BlockImpl('genesis', [])];
        this.pool = new BlockImpl(this.lastBlock.hash, []);
    }

    get lastBlock(): BlockImpl {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block: BlockImpl) {
       this.mine(block);
       this.chain.push(block);
    }

    mine(block: BlockImpl) {
        console.log('Mining....');

        while(true) {
            block.nonce += 1;

            const attempt = block.hash;

            if(attempt.substr(0,4) === '0000') {
                console.log(`Nonce val: ${block.nonce}`);
                return;
            }
        }
    }

    addCase(senderCase: Case, senderPublicKey: string, signature: Buffer) {
        console.log('Verifying authenticity');
        const verifier = crypto.createVerify('SHA256');
        verifier.update(senderCase.toString());

        const isValid = verifier.verify(senderPublicKey, signature);

        if(isValid) {
            console.log('Authenticity verified, adding case..')
            this.pool.ledger.push(senderCase);
            console.log('Case added successfully to pool');
            console.log(`Current pool size: ${this.pool.ledger.length}`) 

            if(this.pool.ledger.length >= this.blockSize) {
                console.log('Block size limit reached, creating new block');
                this.addBlock(this.pool);
                console.log('Clearing pool...')
                this.pool = new BlockImpl(this.lastBlock.hash, []);
                console.log(this);
            }
            
        } else {
            console.log('Case is not valid');
        }

    

    }

    getBlockAfter(hashToGet: string) {
        for(let i: number = 0; i < this.chain.length; ++i) {
            if(this.chain[i].hash === hashToGet) {
                return this.chain.slice(i);
            } 
        }

        return [];
    }

}