import {createSequelizeSchema} from "../src";
import fs from 'fs-extra';
import {Sequelize} from "sequelize";

// @ts-ignore
const userTable = require('./users.model').default;
const deptsTable = require('./depts.model').default;
const myNumbers = require('./my_numbers.model').default;


describe('sequelize', () => {

    it('create model', async () => {
        const config = fs.readJSONSync('./test/config.json');
        const sequelize = new Sequelize(config.mysql, {
            dialect: 'mysql',
            logging: false,
            define: {
                freezeTableName: true
            }
        });

        await createSequelizeSchema({sequelize: sequelize, model: userTable});
        await createSequelizeSchema({sequelize: sequelize, model: deptsTable});
        await createSequelizeSchema({sequelize: sequelize, model: myNumbers});
        await sequelize.sync();

        console.log(sequelize.models);

    }).timeout(60 * 1000);
})
