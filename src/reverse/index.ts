import {Knex} from 'knex';
import {MySQLInformationSchemaColumnModel, MySQLInformationSchemaTableModel} from './types';
import {Column, Model} from '../model';
import fs from 'fs';


export const tableColumnSchemaToModel = (tableColumn: MySQLInformationSchemaColumnModel) => {

  const column: Column = {
    type: tableColumn.DATA_TYPE,
  }

  tableColumn.CHARACTER_MAXIMUM_LENGTH && (column.length = tableColumn.CHARACTER_MAXIMUM_LENGTH);
  tableColumn.COLUMN_TYPE.includes('unsigned') && (column.unsigned = true);
  tableColumn.EXTRA.includes('auto_increment') && (column.autoIncrement = true);
  tableColumn.COLUMN_KEY === 'PRI' && (column.primaryKey = true);
  tableColumn.COLUMN_KEY === 'UNI' && (column.unique = true);
  tableColumn.IS_NULLABLE === 'YES' && (column.nullable = true);

  // noinspection PointlessBooleanExpressionJS
  if (tableColumn.COLUMN_DEFAULT && tableColumn.COLUMN_DEFAULT !== null) {
    switch (tableColumn.DATA_TYPE) {
      case 'int':
      case 'tinyint':
      case 'bit':
        column.defaultValue = parseInt(tableColumn.COLUMN_DEFAULT);
        break;
      case 'float':
      case 'double':
      case 'decimal':
        column.defaultValue = parseFloat(tableColumn.COLUMN_DEFAULT);
        break;
      case 'boolean':
        column.defaultValue = tableColumn.COLUMN_DEFAULT === '1';
        break;
      default:
        column.defaultValue = tableColumn.COLUMN_DEFAULT;
        break;
    }
  }


  if (tableColumn.NUMERIC_PRECISION && tableColumn.NUMERIC_SCALE) {
    column.floatOptions = {
      precision: tableColumn.NUMERIC_PRECISION,
      scale: tableColumn.NUMERIC_SCALE
    }
  }

  tableColumn.COLUMN_COMMENT && (column.comment = tableColumn.COLUMN_COMMENT);

  return column;
}


export const tableSchemaToModel = async (table: MySQLInformationSchemaTableModel, knex: Knex): Promise<any> => {

  const model: Model = {
    tableName: table.TABLE_NAME,
    comment: table.TABLE_COMMENT,
    columns: {},
  };

  const columns = await knex<MySQLInformationSchemaColumnModel>('information_schema.columns')
    .select('*')
    .where('TABLE_SCHEMA', table.TABLE_SCHEMA)
    .where('TABLE_NAME', table.TABLE_NAME)
    .orderBy('ORDINAL_POSITION', 'asc');

  for (const _column of columns) {
    const column = tableColumnSchemaToModel(_column);
    if (_column.COLUMN_NAME === 'id' && column.primaryKey === true) {
      model.autoId = true;
    } else if (
      ['created_at', 'updated_at'].includes(_column.COLUMN_NAME)
      && column.type === 'timestamp'
      && _column.EXTRA.includes('DEFAULT_GENERATED')
    ) {
      model.timestamps = true;
    } else if (['createdAt', 'updatedAt'].includes(_column.COLUMN_NAME)
      && column.type === 'timestamp'
      && _column.EXTRA.includes('DEFAULT_GENERATED')) {
      model.timestamps = {
        useTimestampType: true,
        makeDefaultNow: true,
        camelCase: true,
      }
    } else {
      model.columns[_column.COLUMN_NAME] = column;
    }
  }
  model.engine = table.ENGINE;
  return model;
}

export type ReverseProps = {
  knex: Knex;
  schema: string;
  outputDir: string;
  ts?: boolean;
}

export const generateModels = async ({knex, schema, outputDir, ts}: ReverseProps): Promise<void> => {
  const tables = await knex<MySQLInformationSchemaTableModel>('information_schema.tables')
    .select('*')
    .where({TABLE_SCHEMA: schema});
  fs.existsSync(outputDir) || fs.mkdirSync(outputDir, {recursive: true});
  for (const table of tables) {
    const model = await tableSchemaToModel(table, knex);
    const fileName = `${outputDir}/${table.TABLE_NAME}.model.${ts ? 'ts' : 'js'}`;
    fs.writeFileSync(fileName, ts ? `const model = ${JSON.stringify(model, null, 2)};\nexport default model;` : `module.exports = ${JSON.stringify(model, null, 2)};`);
  }
}
