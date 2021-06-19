import {DataTypes, Model, ReferenceOption} from "../src/";

const model: Model = {
    tableName: 'de_apple',
    autoId: true,
    comment: 'My Numbers',
    columns: {
        float_number: {
            type: DataTypes.FLOAT,
            floatOptions: {
                precision: 5,
                scale: 4,
            }
        },
        de_number: {
            type: DataTypes.DECIMAL,
            floatOptions: {
                precision: 5,
                scale: 4,
            }
        }
    },
    timestamps: {
        makeDefaultNow: true,
        camelCase: true,
    },
    engine: 'InnoDB',
}

export default model;
