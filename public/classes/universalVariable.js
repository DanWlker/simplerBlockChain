"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversalVariable = void 0;
class UniversalVariable {
    constructor() {
        this.currentLongestChain = 0;
    }
}
exports.UniversalVariable = UniversalVariable;
UniversalVariable.instance = new UniversalVariable();
