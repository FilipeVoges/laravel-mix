const { assertSupportedNodeVersion } = require('../src/Engine');

module.exports = async () => {
    assertSupportedNodeVersion();

    const mix = require('../src/Mix').primary;

    // Would like to use dynamic imports here to support mjs files but we can't because of v8-compile-cache
    // We'll have to switch away from webpack-cli so we can have more control
    require(mix.paths.mix());

    await mix.installDependencies();
    await mix.init();

    return await mix.build();
};
