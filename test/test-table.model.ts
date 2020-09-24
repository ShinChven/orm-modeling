import {Model} from "../src";

const model: Model = {
    tableName: 'test_table_1',
    columns: {
        code: {
            type: 'varchar',
            length: 20,
        },
        username: {
            type: 'varchar',
            length: 15,
            comment: 'user use username to login',
        },
        password: {
            type: 'string',
            length: 100,
            comment: ` password`,
        },
        description: {
            type: 'string',
            comment: 'your description'
        },
        enabled: {
            type: 'boolean',
        },
        profile: {
            type: 'json',
        },
        height: {
            type: 'integer',
        },
        weight: {
            type: 'integer',
        }
    },
    timestamps: {
        makeDefaultNow: true,
        camelCase: true,
    },
    indexes: [
        ['weight', 'height'],
        {
            columns: ['code'],
            indexType: 'unique',
            indexName: 'index_user_code_u'
        },
        {
            columns: ['description'],
            indexType: 'fulltext'
        }
    ]
}

export default model;
