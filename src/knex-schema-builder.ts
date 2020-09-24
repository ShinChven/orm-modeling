import knex, {Value} from 'knex';

/**
 * Type for column
 */
export interface Column {
    /**
     * type supported
     */
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
    /**
     * enable autoIncrement
     */
    autoIncrement?: boolean | 'bigIncrements';
    /**
     * column length
     */
    length?: number;
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


/**
 * create knex schema from model
 * @param db knex client
 * @param model model
 * @returns knex client
 */
export const createKnexModel = async ({db, model}: {
    db: knex,
    model: Model
}): Promise<knex<any, unknown[]>> => {
    const {tableName, columns, indexes} = model;
    const exists = await db.schema.hasTable(tableName);
    if (!exists) {
        await db.schema.createTable(tableName, table => {

            // enable autoId
            if (!columns.id && model.autoId === true) {
                table.increments('id');
            }

            // define each columns according to model.columns
            Object.keys(columns).forEach(columnName => {
                const column = columns[columnName];
                const {type, length, datetimeOptions, floatOptions, enumType} = column;
                if (column.autoIncrement) {
                    if (column.autoIncrement === true) {
                        table.increments();
                    } else if (column.autoIncrement === 'bigIncrements') {
                        table.bigIncrements(columnName);
                    }
                } else {

                    // create column according to type
                    let builder

                    if (['string', 'varchar'].indexOf(type) >= 0) {
                        builder = table.string(columnName, length);
                    } else if (['integer', 'int'].indexOf(type) >= 0) {
                        builder = table.integer(columnName, length);
                    } else if (['bigInteger', 'bigInt'].indexOf(type) >= 0) {
                        builder = table.bigInteger(columnName);
                    } else if (type === 'text') {
                        builder = table.text(columnName);
                    } else if (type === 'mediumtext') {
                        builder = table.text(columnName, 'mediumtext');
                    } else if (type === 'longtext') {
                        builder = table.text(columnName, 'longtext');
                    } else if (type === 'float') {
                        builder = table.float(columnName, floatOptions?.precision, floatOptions?.scale);
                    } else if (type === 'decimal') {
                        builder = table.decimal(columnName, floatOptions?.precision, floatOptions?.scale);
                    } else if (type === 'boolean') {
                        builder = table.boolean(columnName);
                    } else if (type === 'date') {
                        builder = table.date(columnName);
                    } else if (type === 'datetime') {
                        if (datetimeOptions) {
                            builder = table.dateTime(columnName, datetimeOptions);
                        } else {
                            builder = table.dateTime(columnName);
                        }
                    } else if (type === 'time') {
                        builder = table.time(columnName);
                    } else if (type === 'timestamp') {
                        if (datetimeOptions) {
                            builder = table.timestamp(columnName, datetimeOptions)
                        } else {
                            builder = table.timestamp(columnName);
                        }
                    } else if (type === 'binary') {
                        builder = table.binary(columnName, length);
                    } else if (type === 'enu') {
                        builder = table.enu(columnName, enumType?.enumValues!, enumType?.enumOptions)
                    } else if (type === 'enum') {
                        builder = table.enum(columnName, enumType?.enumValues!, enumType?.enumOptions)
                    } else if (type === 'json') {
                        builder = table.json(columnName);
                    } else if (type === 'jsonb') {
                        builder = table.jsonb(columnName);
                    } else if (type === 'uuid') {
                        builder = table.uuid(columnName);
                    } else {
                        builder = table.specificType(columnName, type);
                    }

                    if (column.nullable === true) {
                        builder.nullable()
                    } else {
                        builder.notNullable()
                    }

                    if (column.defaultValue) {
                        if (['timestamp'].indexOf(type) >= 0 && column.defaultValue === 'now') {
                            if (datetimeOptions && typeof datetimeOptions.precision === 'number') {
                                builder.defaultTo(db.fn.now(datetimeOptions?.precision));
                            } else {
                                builder.defaultTo(db.fn.now());
                            }
                        } else {
                            builder.defaultTo(column.defaultValue);
                        }
                    }

                    if (column.primaryKey) {
                        if (typeof column.primaryKey === 'string') {
                            builder.primary(column.primaryKey)
                        } else {
                            builder.primary();
                        }
                    }

                    if (column.unique) {
                        if (typeof column.unique === 'string') {
                            builder.unique(column.unique)
                        } else {
                            builder.unique();
                        }
                    }

                    if (typeof column.comment === 'string') {
                        builder.comment(column.comment);
                    }
                }
            });


            if (typeof model.comment === 'string') {
                table.comment(model.comment);
            }

            if (typeof model.engine === 'string') {
                table.engine(model.engine);
            }

            if (typeof model.charset === 'string') {
                table.charset(model.charset);
            }

            if (typeof model.collate === 'string') {
                table.collate(model.collate);
            }

            if (typeof model.inherits === 'string') {
                table.inherits(model.inherits);
            }

            if (model.timestamps) {
                if (model.timestamps === true) {
                    table.timestamps();
                } else {
                    const {
                        useTimestampType,
                        makeDefaultNow,
                        camelCase,
                    } = model.timestamps;
                    if (camelCase === true) {
                        let createdAtBuilder, updatedAtBuilder;
                        if (useTimestampType === true) {
                            createdAtBuilder = table.timestamp('createdAt');
                            updatedAtBuilder = table.timestamp('updatedAt');
                        } else {
                            createdAtBuilder = table.dateTime('createdAt');
                            updatedAtBuilder = table.dateTime('updatedAt');
                        }
                        if (makeDefaultNow === true) {
                            createdAtBuilder.defaultTo(db.fn.now());
                            updatedAtBuilder.defaultTo(db.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
                        }
                    } else {
                        table.timestamps(useTimestampType, makeDefaultNow);
                    }
                }
            }
            if (Array.isArray(indexes)) {
                indexes.forEach(index => {
                    if (Array.isArray(index)) {
                        table.index(index, `index_${index.join('_')}`)
                    } else if (index.columns.length > 0) {
                        table.index(index.columns,
                            index.indexName || `index_${index.columns.join('_')}`,
                            index.indexType);
                    }
                });
            }
        });
    }
    return Promise.resolve(db);
}
