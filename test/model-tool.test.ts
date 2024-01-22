import { toMarkdownTable, toTypeScriptInterface } from "../src";

const usersTable = require('./users.model').default;

(async () => {

    console.log(toTypeScriptInterface(usersTable));
    console.log(`### ${usersTable.tableName || ''} ${usersTable.comment || ''}\n\n${toMarkdownTable(usersTable)}`);

})().then(() => {
    console.log('Test passed');
    process.exit(0);
})
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
