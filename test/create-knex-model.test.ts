import {createKnexReference, createKnexSchema} from "../src";
import fs from 'fs-extra';
import chai from "chai";
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

// @ts-ignore
const userTable = require('./users.model').default;
const deptsTable = require('./depts.model').default;

//Enable chai to use promises for assertions
chai.use(chaiAsPromised);

describe("Test Suite", function() {
    it("Tests Knex Schema & Reference Creation", async function() {
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

        //If the code reaches this point without throwing any error then the test has passed.
        expect(true).to.equal(true);
    });
});
