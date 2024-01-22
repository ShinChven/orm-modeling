import fs from 'fs-extra';
import { createKnexReference, createKnexSchema } from "../src";

// @ts-ignore
const userTable = require('./users.model').default;
const deptsTable = require('./depts.model').default;

(async () => {
    const config = fs.readJSONSync('./test/config.json');
        const knex = require('knex')({
            client: 'mysql2',
            connection: config.mysql.connection,
        });

        await createKnexSchema({
            db: knex,
            model: userTable,
            createKnexSchemaOptions: {
                columnDefaultNullable: true,
            }
        });
    
        await createKnexSchema({db: knex, model: deptsTable});
        await createKnexReference({db: knex, model: userTable});

        knex.destroy();
})().then(() => {
    
    console.log('Test passed');
    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});

