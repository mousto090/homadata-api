var Mocha = require('mocha');

const { utils: { lookupFiles } } = Mocha;
var testDir = 'test/**/*';
const files = lookupFiles(testDir + '.test.js', ['js'], true);

var mocha = new Mocha();
//mocha configuration
mocha.files = files;
// Run the tests.
mocha.run(function (failures) {
    // exit with non-zero status if there were failures
    process.exitCode = failures ? 1 : 0;
});