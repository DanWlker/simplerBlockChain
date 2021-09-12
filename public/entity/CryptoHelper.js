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
exports.CryptoHelper = void 0;
const crypto = __importStar(require("crypto"));
class CryptoHelper {
    static hash(object) {
        const str = JSON.stringify(object);
        const hash = crypto.createHash('MD5');
        hash.update(str).end();
        return hash.digest('hex');
    }
    static verifyAuthenticity(object, publicKey, signature) {
        let verifier = crypto.createVerify('SHA256');
        verifier.update(object.toString());
        return verifier.verify(publicKey, signature);
    }
}
exports.CryptoHelper = CryptoHelper;
