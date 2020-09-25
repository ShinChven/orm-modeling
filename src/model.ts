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
