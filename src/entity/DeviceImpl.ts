import * as crypto from 'crypto';
import { Chain } from './Chain';


export class DeviceImpl implements Device {
    public publicKey: string;
    public privateKey: string;
    public ledger: Case;

    constructor() {
        const keypair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {type: 'spki', format: 'pem'},
            privateKeyEncoding: {type: 'pkcs8', format: 'pem'},
        });

        this.privateKey = keypair.privateKey;
        this.publicKey = keypair.publicKey;

        this.ledger = {
            uploadedDeviceIdentifier:this.publicKey,
            recordedCases: [],
            signee: ''
        } as Case;
    }

    sendCases(signeeVerification?: string) {
        if(signeeVerification) {
            this.signCases(signeeVerification);
        }

        const signature = this.returnSignature();

        Chain.instance.addCase(this.ledger, this.publicKey, signature);
    }

    returnSignature(){
        const sign = crypto.createSign('SHA256');
        sign.update(this.ledger.toString());

        return sign.sign(this.privateKey);
    }

    signCases(signeeVerification: string) {
        this.ledger.signee = signeeVerification; //signature by doctor or what not
    }
    
    generateFakeCases() {
        for(let i = 0; i < 5; ++i) {
            this.ledger.recordedCases.push(
                {
                    closeContactIdentifier: (Math.round(Math.random()*100000000)).toString(),
                    dateOfContact: Date.now().toString(),
                    distanceOfContactMetres: (Math.random()*10).toString(),
                    mediumOfDetection: ['Bluetooth', 'Wifi'],
                    estimatedDurationOfContact: (Math.random()*10).toString(),
                } as IndvCloseContact
            );
        }
    }
}