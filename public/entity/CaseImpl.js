"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseImpl = void 0;
class CaseImpl {
    constructor(uploadedDeviceIdentifier, recordedCases, signee) {
        this.uploadedDeviceIdentifier = uploadedDeviceIdentifier;
        this.recordedCases = recordedCases;
        this.signee = signee;
    }
    toString() {
        return JSON.stringify(this);
    }
}
exports.CaseImpl = CaseImpl;
