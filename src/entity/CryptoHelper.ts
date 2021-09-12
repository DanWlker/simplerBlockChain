import * as crypto from 'crypto';

export class CryptoHelper {
    static hash(object: Object) {
        const str = JSON.stringify(object);
        const hash = crypto.createHash('MD5');
        hash.update(str).end();
        return hash.digest('hex');
    }

    static verifyAuthenticity(object: Object, publicKey: string, signature: Buffer) {
        let verifier = crypto.createVerify('SHA256');
        verifier.update(object.toString());

        return verifier.verify(publicKey, signature);
    }
}