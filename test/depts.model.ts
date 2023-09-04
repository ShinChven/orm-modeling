import {DataTypes, Model} from "../src/";

const model: Model = {
    tableName: 'Depts',
    autoId: true,
    columns: {
        name: {
            type: 'varchar',
            length: 20,
        },
        age: {
            type: DataTypes.INT,
            defaultValue: 0,
            nullable: true,
        },
        data:{
            type: DataTypes.BLOB
        },
        medium_data:{
            type: DataTypes.MEDIUM_BLOB
        },
        long_data:{
            type: DataTypes.LONG_BLOB
        }

    },
    timestamps: {
        makeDefaultNow: true,
    },
}

export default model;
