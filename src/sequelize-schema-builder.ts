import {
    col,
    DataTypes,
    DateDataTypeOptions,
    EnumDataTypeOptions,
    IntegerDataTypeOptions,
    ModelAttributeColumnOptions,
    ModelAttributes,
    NumberDataTypeOptions,
    Sequelize,
    TextDataTypeOptions
} from "sequelize";
import {Column, DataTypes as ORMDataTypes, Model as ORMModel} from "./model";


export interface CreateSequelizeSchemaOptions {
    /**
     * if the column is nullable by default
     */
    columnDefaultNullable?: boolean,
}

type CreateSequelizeSchemaParams = {
    sequelize: Sequelize;
    model: ORMModel;
    options?: CreateSequelizeSchemaOptions;
}

const mapDataTypes = (column: Column) => {
    switch (column.type) {
        case ORMDataTypes.STRING:
        case ORMDataTypes.VARCHAR:
            return DataTypes.STRING(column.length);
        case ORMDataTypes.TEXT:
            return DataTypes.TEXT({length: 'tiny'} as TextDataTypeOptions);
        case ORMDataTypes.MEDIUM_TEXT:
            return DataTypes.TEXT({length: 'medium'} as TextDataTypeOptions);
        case ORMDataTypes.LONG_TEXT:
            return DataTypes.TEXT({length: 'long'} as TextDataTypeOptions);
        case ORMDataTypes.INTEGER:
        case ORMDataTypes.INT:
            return DataTypes.INTEGER({
                length: column.length,
                unsigned: column.unsigned,
            } as NumberDataTypeOptions);
        case ORMDataTypes.BIG_INTEGER:
        case ORMDataTypes.BIG_INT:
            return DataTypes.BIGINT({
                length: column.length,
                unsigned: column.unsigned,
            } as IntegerDataTypeOptions);
        case ORMDataTypes.FLOAT:
            return DataTypes.FLOAT(column.floatOptions);
        case ORMDataTypes.DECIMAL:
            return DataTypes.DECIMAL(column.floatOptions);
        case ORMDataTypes.BOOLEAN:
            return DataTypes.BOOLEAN;
        case ORMDataTypes.DATE:
            return DataTypes.DATEONLY;
        case ORMDataTypes.DATETIME:
            return DataTypes.DATE({
                length: column.datetimeOptions?.precision,
            } as DateDataTypeOptions);
        case ORMDataTypes.TIME:
            return DataTypes.TIME
        case ORMDataTypes.TIMESTAMP:
            return 'TIMESTAMP';
        case ORMDataTypes.BINARY:
            return 'BINARY';
        case ORMDataTypes.ENU:
        case ORMDataTypes.ENUM:
            return DataTypes.ENUM({
                values: column.enumType?.enumValues,
            } as EnumDataTypeOptions<any>)
        case ORMDataTypes.JSON:
            return DataTypes.JSON
        case ORMDataTypes.JSONB:
            return DataTypes.JSONB
        case ORMDataTypes.UUID:
            return DataTypes.UUID
        default:
            return column.type;
    }
}

const defaultValue = (column: Column) => {

    if (column.defaultValue === 'now') {
        switch (column.type) {
            case ORMDataTypes.TIMESTAMP:
                return Sequelize.fn('current_timestamp');
            case ORMDataTypes.DATETIME:
                return Sequelize.fn('now');
        }
    }
    return column.defaultValue;
}


export const createSequelizeSchema = async ({sequelize, model, options}: CreateSequelizeSchemaParams) => {
    const schema: ModelAttributes = {}

    Object.keys(model.columns).forEach(columnName => {
        const column = model.columns[columnName];

        let allowNull = options?.columnDefaultNullable || false;

        if (column.nullable !== undefined) {
            allowNull = column.nullable
        }

        schema[columnName] = {
            type: mapDataTypes(column),
            defaultValue: defaultValue(column),
            allowNull,
            unique: column.unique,
        };
    })


    await sequelize.define(model.tableName, schema, {
        hooks: {
            beforeCount(options) {
                // options.raw = true;
            }
        }
    });

    return Promise.resolve();


};
