export class CaseImpl implements Case{
    constructor(
        public uploadedDeviceIdentifier: string,
        public recordedCases: IndvCloseContact[],
        public signee: string
    ) {

    }

    toString() {
        return JSON.stringify(this);
    }
}