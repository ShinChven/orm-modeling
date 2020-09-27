import {toTypeScriptInterface} from "../src";

const usersTable = require('./users.model').default;


describe('model-tool', () => {

    it('to TypeScript interface', (done) => {
        console.log(toTypeScriptInterface(usersTable,));
        done()
    }).timeout(60 * 1000);
})
