/**
 * Type for column
 */
export interface Column {
    type: 'string' | 'varchar'
        | 'integer' | 'int'
        | 'bigInteger' | 'bigInt'
        | 'text' | 'mediumtext' | 'longtexxt'
        | 'float' | 'decimal'
        | 'boolean'
        | 'date' | 'datetime' | 'timestamp'
        | 'binary'
        | 'enum' | 'enu'
        | 'json'
        | 'jsonb'
        | 'uuid'
        | string;
    autoIncrement?: boolean | 'bigIncrements';
    length?: number;
    nullable?: boolean;
    primaryKey?: boolean | string;
    unique?: boolean | string;
    comment?: string;
    defaultValue?: any;
    datetimeOptions?: DatetimeOptions;
    floatOptions?: FloatOptions;
    enumValues?: any;
    enumOptions?: any;
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

export interface NamedIndex {
    columns: Array<string>;
    indexName?: string;
    indexType?: 'unique' | 'fulltext' | string;
}

/**
 * An ORM model for knex
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
