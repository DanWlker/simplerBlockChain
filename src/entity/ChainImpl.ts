import { BlockImpl } from "./BlockImpl";
import * as crypto from 'crypto';
import { CaseImpl } from "./CaseImpl";

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

        console.log(`Returned block nonce: ${block.nonce}`)
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

    addCase(senderCase: CaseImpl, senderPublicKey: string, signature: Buffer) {
        const verifier = crypto.createVerify('SHA256');
        verifier.update(senderCase.toString());

        const isValid = verifier.verify(senderPublicKey, signature);

        if(isValid) {
            this.pool.ledger.push(senderCase);
            if(this.pool.ledger.length >= this.blockSize) {
                this.addBlock(this.pool);
                this.pool = new BlockImpl(this.lastBlock.hash, []);
            }
        }

    }

}