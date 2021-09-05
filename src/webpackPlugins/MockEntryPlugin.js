let File = require('../File');
let path = require('path');

class MockEntryPlugin {
    /**
     * @param {import('../Mix')} mix
     */
    constructor(mix) {
        // TODO: Remove in Mix 7 -- Here for backwards compat if a plugin requires this file
        this.mix = mix || global.Mix;
    }

    /**
     * Handle the deletion of the temporary mix.js
     * output file that was generated by webpack.
     *
     * This file is created when the user hasn't
     * requested any JavaScript compilation, but
     * webpack still requires an entry.
     *
     * @param {import("webpack").Compiler} compiler
     */
    apply(compiler) {
        compiler.hooks.done.tap('MockEntryPlugin', stats => {
            const assets = stats.toJson().assets || [];
            const temporaryOutputFile = assets.find(asset => asset.name === 'mix.js');

            if (!temporaryOutputFile) {
                return;
            }

            delete stats.compilation.assets[temporaryOutputFile.name];

            File.find(
                path.resolve(this.mix.config.publicPath, temporaryOutputFile.name)
            ).delete();
        });
    }
}

module.exports = MockEntryPlugin;
