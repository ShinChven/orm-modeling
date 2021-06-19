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
        launch_date: {
            type: DataTypes.DATETIME,
            defaultValue: 'now',
            nullable: true,
        }
    },
    timestamps: {
        makeDefaultNow: true,
        camelCase: true,
    },
}

export default model;
