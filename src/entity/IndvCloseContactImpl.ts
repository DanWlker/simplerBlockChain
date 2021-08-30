export class IndvCloseContactImpl implements IndvCloseContact{
    constructor(
        public closeContactIdentifier: string,
        public dateOfContact: string,
        public distanceOfContactMetres: string,
        public mediumOfDetection: string[],
        public estimatedDurationOfContact: string,
    ) {

    }

    toString() {
        return JSON.stringify(this);
    }
}