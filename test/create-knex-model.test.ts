import {createKnexModel} from "../src";
import fs from 'fs-extra';

// @ts-ignore
import testTable from './test-table.model';


describe('knex', () => {
    const config = fs.readJSONSync('./test/config.json');
    const knex = require('knex')({
        client: 'mysql2',
        connection: config.mysql,
    });
    it('create model', (done) => {
        createKnexModel({db: knex, model: testTable}).then(() => {
            console.log('done')
            done();
        });
    }).timeout(60 * 1000);
})
