import * as crypto from 'crypto';

export class BlockImpl implements Block {
    constructor(
        public prevHash: string,
        public ledger: Case[],
        public ts = Date.now()
    ) {
        
    }

    get hash() {
        const str = JSON.stringify(this);
        const hash = crypto.createHash('SHA256');
        hash.update(str).end();
        return hash.digest('hex');
    }
}