import {DataTypes, Model, ReferenceOption} from "../src/";

const model: Model = {
    tableName: 'Depts',
    autoId: true,
    columns: {
        name: {
            type: 'varchar',
            length: 20,
        },
    },
    timestamps: {
        makeDefaultNow: true,
        camelCase: true,
    },
}

export default model;
