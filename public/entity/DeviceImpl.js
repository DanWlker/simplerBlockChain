"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceImpl = void 0;
const crypto = __importStar(require("crypto"));
const ChainImpl_1 = require("./ChainImpl");
const IndvCloseContactImpl_1 = require("./IndvCloseContactImpl");
class DeviceImpl {
    constructor() {
        const keypair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });
        this.privateKey = keypair.privateKey;
        this.publicKey = keypair.publicKey;
        this.ledger = {
            uploadedDeviceIdentifier: this.publicKey,
            recordedCases: [],
            signee: ''
        };
    }
    sendCases(signeeVerification) {
        if (signeeVerification) {
            this.signCases(signeeVerification);
        }
        const signature = this.returnSignature();
        ChainImpl_1.ChainImpl.instance.addCase(this.ledger, this.publicKey, signature);
    }
    returnSignature() {
        const sign = crypto.createSign('SHA256');
        sign.update(this.ledger.toString());
        return sign.sign(this.privateKey);
    }
    signCases(signeeVerification) {
        this.ledger.signee = signeeVerification; //signature by doctor or what not
    }
    generateFakeCases() {
        for (let i = 0; i < 5; ++i) {
            this.ledger.recordedCases.push(new IndvCloseContactImpl_1.IndvCloseContactImpl((Math.round(Math.random() * 100000000)).toString(), Date.now().toString(), (Math.random() * 10).toString(), ['Bluetooth', 'Wifi'], (Math.random() * 10).toString()));
        }
    }
}
exports.DeviceImpl = DeviceImpl;
