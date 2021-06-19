import {createKnexReference, createKnexSchema} from "../src";
import fs from 'fs-extra';

// @ts-ignore
const userTable = require('./users.model').default;
const deptsTable = require('./depts.model').default;


describe('knex', () => {

    it('create model', (done) => {
        const config = fs.readJSONSync('./test/config.json');
        const knex = require('knex')({
            client: 'mysql',
            connection: config.mysql,
        });

        const createTables = async () => {
            await createKnexSchema({
                db: knex, model: userTable, createKnexSchemaOptions: {
                    columnDefaultNullable: true,
                }
            });
            await createKnexSchema({db: knex, model: deptsTable});
            await createKnexReference({db: knex, model: userTable});
            return Promise.resolve();
        }
        createTables().then(() => {
            console.log('done')
            knex.destroy();
            done();
        }).catch(err => {
            console.error(err);
            knex.destroy();
            done();
        });
    }).timeout(60 * 1000);
})
