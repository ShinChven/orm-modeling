// noinspection JSUnusedGlobalSymbols
import {Value} from "knex";

// noinspection JSUnusedGlobalSymbols
export enum DataTypes {
  STRING = 'string',
  VARCHAR = 'varchar',
  INTEGER = 'integer',
  INT = 'int',
  BIG_INTEGER = 'bigInteger',
  BIG_INT = 'bigInt',
  TEXT = 'text',
  MEDIUM_TEXT = 'mediumtext',
  LONG_TEXT = 'longtext',
  FLOAT = 'float',
  DECIMAL = 'decimal',
  BOOLEAN = 'boolean',
  DATE = 'date',
  DATETIME = 'datetime',
  TIME = 'time',
  TIMESTAMP = 'timestamp',
  BINARY = 'binary',
  ENUM = 'enum',
  ENU = 'enu',
  JSON = 'json',
  JSONB = 'jsonb',
  UUID = 'uuid',
}

// noinspection JSUnusedGlobalSymbols
export enum ReferenceOption {
  RESTRICT = 'RESTRICT',
  CASCADE = 'CASCADE',
  SET_NULL = 'SET NULL',
  NO_ACTION = 'NO ACTION',
}

/**
 * Create foreign reference for the column
 */
export interface Reference {
  /**
   * Reference table name
   */
  table: string;

  /**
   * Reference column name,
   * use id by default if not given.
   */
  column?: string;

  /**
   * A default key name using the columns is used unless foreignKeyName is specified.
   */
  foreignKeyName?: string;

  /**
   * If true, will not create foreign key constraint. Document only.
   */
  softReference?: boolean;

  onUpdate?: ReferenceOption;

  onDelete?: ReferenceOption;

}

/**
 * Type for column
 */
export interface Column {
  /**
   * type supported
   */
  type: DataTypes
      | 'string' | 'varchar'
      | 'integer' | 'int'
      | 'bigInteger' | 'bigInt'
      | 'text' | 'mediumtext' | 'longtext'
      | 'float' | 'decimal'
      | 'boolean'
      | 'date' | 'datetime' | 'timestamp' | 'time'
      | 'binary'
      | 'enum' | 'enu'
      | 'json'
      | 'jsonb'
      | 'uuid'
      | string;
  /**
   * enable autoIncrement
   */
  autoIncrement?: boolean | 'bigIncrements';
  /**
   * column length
   */
  length?: number;

  /**
   * Specifies an integer as unsigned. No-op if this is chained off of a non-integer field.
   */
  unsigned?: boolean;

  /**
   * column is nullable
   */
  nullable?: boolean;
  /**
   * column is primaryKey
   */
  primaryKey?: boolean | string;
  /**
   * add UNIQUE index to column
   */
  unique?: boolean | string;
  /**
   * column's comment
   */
  comment?: string;
  /**
   * default value
   */
  defaultValue?: Value;
  /**
   * datetime and timestamp options.
   * used only when type is datetime or timestamp.
   */
  datetimeOptions?: DatetimeOptions;
  /**
   * float options.
   * used only when type is float or decimal
   */
  floatOptions?: FloatOptions;

  enumType?: EnumType;

  reference?: Reference;
}

interface EnumType {
  /**
   * enum values for the column.
   * used only when type is enu or enum
   */
  enumValues: readonly Value[];
  /**
   *
   */
  enumOptions?: EnumOptions;
}

interface EnumOptions {
  useNative: boolean;
  existingType?: boolean;
  schemaName?: string;
  enumName: string;
}

/**
 * Type for model columns, it's a map,
 * and each member should be typeof Column,
 * the map's keys shall be column name in table.
 */
export interface Columns {
  [columnName: string]: Column;
}

/**
 * Model auto timestamps options
 */
export interface ModelTimestamps {
  useTimestampType?: boolean;
  makeDefaultNow?: boolean;
  camelCase?: boolean;
}


/**
 * datetime options, also work for type timestamp
 */
export interface DatetimeOptions {
  precision?: number;
  useTz?: boolean;
}

/**
 * options for type float,
 * also work for type decimal
 */
export interface FloatOptions {
  precision?: number;
  scale?: number;
}

/**
 * Index type
 */
export interface NamedIndex {
  /**
   * Columns to create index with, if index is to be created with one single element, then pass one element to the array.
   */
  columns: Array<string>;
  /**
   * Specify name of index
   *
   * If not given, index will be created with default name.
   */
  indexName?: string;
  /**
   * If not given, a normal index will be created.
   */
  indexType?: 'unique' | 'fulltext' | string;
}

/**
 * An ORM model for knex
 * http://knexjs.org/#Schema-Building
 */
export interface Model {
  tableName: string;
  columns: Columns;
  autoId?: boolean;
  comment?: string;
  engine?: string;
  charset?: string;
  collate?: string;
  inherits?: string;
  timestamps?: boolean | ModelTimestamps;
  indexes?: Array<Array<string> | NamedIndex>;
}


export interface CodeGenerationOptions {
  indent?: number;
  lineBreaker?: string;
}


/**
 * Code generation tool function to convert model to TypeScript's type
 * @param model The model to be converted
 * @param indent
 * @param lineBreaker
 * return {string} TypeScript code in string
 */
export function toTypeScriptInterface(model: Model, {
  indent = 4,
  lineBreaker = '\n'
}: CodeGenerationOptions = {}): string {
  const {tableName, columns} = model;
  let codes = new Array<string>();
  const indentSpace = ((indents) => {
    let indentStr = '';
    for (let i = 0; i < indents; i++) {
      indentStr += ' ';
    }
    return indentStr;
  })(indent);
  codes.push(`export interface ${tableName}{`);
  if (typeof columns === "object") {
    Object.keys(columns).forEach(fieldName => {
      const field = columns[fieldName];
      const nullable = field.nullable === true ? '?' : '';
      const type = ((t: DataTypes | string) => {
        switch (t.toString().toLocaleLowerCase()) {
          case DataTypes.STRING:
          case DataTypes.VARCHAR:
          case DataTypes.TEXT:
          case DataTypes.MEDIUM_TEXT:
          case DataTypes.LONG_TEXT:
          case DataTypes.UUID:
          case 'char':
            return 'string';
          case DataTypes.INTEGER:
          case DataTypes.INT:
          case DataTypes.BIG_INTEGER:
          case DataTypes.BIG_INT:
          case DataTypes.FLOAT:
          case DataTypes.DECIMAL:
            return 'number';
          case DataTypes.BOOLEAN:
            return 'boolean';
          case DataTypes.DATE:
          case DataTypes.DATETIME:
          case DataTypes.TIME:
          case DataTypes.TIMESTAMP:
            return 'Date';
          default:
            return 'any';
        }
      })(field.type);

      codes.push(`${indentSpace}${fieldName}${nullable}: ${type};`)
    });
  }
  codes.push(`}`);
  return codes.join(lineBreaker);
}


export interface MarkdownTableOptions {
  tableColumnNames?: MarkdownTableColumnNames;
  lineBreaker?: string;
}

export interface MarkdownTableColumnNames {
  name?: string;
  type?: string;
  pk?: string;
  autoIncrement?: string;
  nullable?: string;
  unique?: string;
  default?: string;
  index?: string;
  reference?: string;
  comment?: string;
}

export function toMarkdownTable(
    model: Model,
    options: MarkdownTableOptions = {}) {
  const {
    tableColumnNames = {
      name: 'name',
      type: 'type',
      pk: 'PK',
      autoIncrement: 'auto inc',
      nullable: 'nullable',
      unique: 'unique',
      default: 'default',
      index: 'index',
      reference: 'reference',
      comment: 'comment',
    },
    lineBreaker = '\n',
  } = options;


  const lines = new Array<string>();

  lines.push(`| ${tableColumnNames.name} | ${tableColumnNames.type} | ${tableColumnNames.pk} | ${tableColumnNames.autoIncrement} | ${tableColumnNames.nullable} | ${tableColumnNames.unique} | ${tableColumnNames.default} | ${tableColumnNames.index} | ${tableColumnNames.reference} | ${tableColumnNames.comment} |`);
  lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');

  if (model.autoId === true) {
    lines.push(`| id | int unsigned | pk | auto inc |  |  |  |  |  |  |`)
  }

  if (typeof model.columns === 'object') {
    Object.keys(model.columns).forEach(columnName => {
      const column = model.columns[columnName];
      const cells = new Array<string>();

      cells.push(columnName);
      cells.push(((c) => {
        const typeParts = new Array<string>();
        typeParts.push(c.type.toString())
        if (c.length) {
          typeParts.push(`(${c.length})`);
        } else if (c.datetimeOptions) {
          typeParts.push(`(${c.datetimeOptions.precision})`)
        } else if (c.floatOptions) {
          typeParts.push(`(${c.floatOptions.precision},${c.floatOptions.scale})`)
        }
        return typeParts.join('');
      })(column))
      cells.push(column.primaryKey ? 'PK' : '');
      cells.push(column.autoIncrement === true ? 'auto inc' : '');
      cells.push(column.nullable === true ? 'null' : 'not null');
      cells.push(column.unique === true ? 'unique' : '');
      cells.push(column.defaultValue ? `${column.defaultValue}` : '');
      cells.push((({indexes = []}: Model, c) => {
        let indexType = '';
        for (let i = 0; i < indexes.length; i++) {
          const index = indexes[i];
          if (Array.isArray(index)) {
            if (index.indexOf(c) >= 0) {
              indexType = 'index';
              break;
            }
          } else {
            if (index.columns.indexOf(c) >= 0) {
              indexType = index.indexType || 'index';
              break;
            }
          }
        }
        return indexType;
      })(model, columnName)); // index
      cells.push(column.reference ? `${column.reference.table}.${column.reference.column || 'id'}` : '');
      cells.push(column.comment ? column.comment : '');

      lines.push(`| ${cells.join(' | ')} |`);
    });
  }

  return lines.join(lineBreaker);
}
