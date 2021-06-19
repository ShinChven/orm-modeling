import {Knex} from 'knex';
import {Model} from "./model";

export interface CreateKnexSchemaOptions {
    /**
     * if the column is nullable by default
     */
    columnDefaultNullable?: boolean,
}

/**
 * create knex schema from model
 * @param db knex client
 * @param model model
 * @param createKnexSchemaOptions
 * @returns knex client
 */
export const createKnexSchema = async ({db, model, createKnexSchemaOptions}: {
    db: Knex,
    model: Model
    createKnexSchemaOptions?: CreateKnexSchemaOptions,
}): Promise<Knex<any, unknown[]>> => {
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
                const {
                    type,
                    length,
                    datetimeOptions,
                    floatOptions,
                    enumType,
                    nullable = createKnexSchemaOptions?.columnDefaultNullable
                } = column;
                if (column.autoIncrement !== undefined) {
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
                        if (column.unsigned) {
                            builder.unsigned()
                        }
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

                    if (nullable) {
                        builder.nullable()
                    } else {
                        builder.notNullable()
                    }

                    if (column.defaultValue !== undefined) {
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

                    if (column.primaryKey !== undefined) {
                        if (typeof column.primaryKey === 'string') {
                            builder.primary(column.primaryKey)
                        } else {
                            builder.primary();
                        }
                    }

                    if (column.unique !== undefined) {
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
                            updatedAtBuilder.defaultTo(db.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
                        }
                    } else {
                        table.timestamps(useTimestampType, makeDefaultNow);
                    }
                }
            }
            if (Array.isArray(indexes)) {
                indexes.forEach(index => {
                    if (Array.isArray(index)) {
                        table.index(index, `${tableName}_index_${index.join('_')}`)
                    } else if (index.columns.length > 0) {
                        const type = index.indexType ? `_${index.indexType}` : '';
                        table.index(index.columns,
                            index.indexName || `${tableName}_index_${index.columns.join('_')}${type}`,
                            index.indexType);
                    }
                });
            }
        });
    }
    return Promise.resolve(db);
}

export const createKnexReference = async ({db, model}: {
    db: Knex,
    model: Model
}): Promise<Knex<any, unknown[]>> => {
    const {tableName, columns} = model;
    if (typeof columns === "object") {
        await db.schema.alterTable(tableName, t => {
            // define each columns according to model.columns
            Object.keys(columns).forEach(columnName => {
                const column = columns[columnName];
                const {reference} = column;
                if (reference) {
                    const {table, column = 'id', softReference, onUpdate, onDelete} = reference;
                    if (softReference !== true) {
                        const {foreignKeyName} = reference;
                        const _reference = `${table}.${column}`;
                        const builder = t.foreign(columnName, foreignKeyName).references(_reference);
                        if (onUpdate) {
                            builder.onUpdate(onUpdate)
                        }
                        if (onDelete) {
                            builder.onDelete(onDelete);
                        }
                    }
                }
            });
        });
    }
    return Promise.resolve(db);
}
