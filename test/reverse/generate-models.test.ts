import fs from 'fs-extra';
import knex from 'knex';
import {generateModels} from '../../src/reverse';
import path from 'path';

const {reverse} = fs.readJSONSync('./test/config.json');

(async () => {
  const db = knex({
    client: 'mysql2',
    connection: reverse.connection,
  });
  await generateModels({knex: db, schema: 'ngs-dev', outputDir: path.join(__dirname, 'models'), ts: true});
})().then(() => {
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
