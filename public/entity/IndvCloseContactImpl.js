"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndvCloseContactImpl = void 0;
class IndvCloseContactImpl {
    constructor(closeContactIdentifier, dateOfContact, distanceOfContactMetres, mediumOfDetection, estimatedDurationOfContact) {
        this.closeContactIdentifier = closeContactIdentifier;
        this.dateOfContact = dateOfContact;
        this.distanceOfContactMetres = distanceOfContactMetres;
        this.mediumOfDetection = mediumOfDetection;
        this.estimatedDurationOfContact = estimatedDurationOfContact;
    }
    toString() {
        return JSON.stringify(this);
    }
}
exports.IndvCloseContactImpl = IndvCloseContactImpl;
