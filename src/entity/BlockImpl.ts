import * as crypto from 'crypto';

export class BlockImpl implements Block {

    public nonce = Math.round(Math.random() * 999999999);

    constructor(
        public prevHash: string,
        public ledger: Case[],
        public ts = Date.now().toString()
    ) {
        
    }

    get hash() {
        const str = JSON.stringify(this);
        const hash = crypto.createHash('MD5');
        hash.update(str).end();
        return hash.digest('hex');
    }
}