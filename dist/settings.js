"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Settings {
    static read() {
        return {
            help: this.hasFlag('?') || this.hasFlag('h') || this.hasFlag('help'),
            hideVersion: this.hasFlag('hideVersion'),
            showSystem: this.hasFlag('showSystem'),
            onlyTopLevel: this.hasFlag('onlyTopLevel'),
            flat: this.hasFlag('flat'),
            why: this.hasValue('why'),
            dir: this.hasValue('dir'),
            solution: this.hasValue('solution')
        };
    }
    static hasFlag(name) {
        return !!process.argv.filter(x => x === '--' + name).length;
    }
    static hasValue(name) {
        var index = process.argv.indexOf('--' + name);
        if (index === -1)
            return null;
        return process.argv[index + 1];
    }
}
exports.Settings = Settings;
//# sourceMappingURL=settings.js.map