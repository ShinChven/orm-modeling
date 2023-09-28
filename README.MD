# orm-modeling 

orm-modeling is a robust Node.js ORM tool designed with TypeScript. It enables you to define your database schemas using JavaScript objects, with the added benefit of IDE autocompletion and type-checking for model definitions. Built on the Knex query builder, it offers compatibility with a variety of database engines.

[![npm version](http://img.shields.io/npm/v/orm-modeling.svg)](https://npmjs.org/package/orm-modeling) [![npm downloads](https://img.shields.io/npm/dy/orm-modeling.svg)](https://npmjs.org/package/orm-modeling) [![Documentation](https://img.shields.io/badge/documentation-%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3-blue)](/README.zh-CN.MD)

Key Features:
- Define Knex schemas from models with TypeScript's autocompletion and type-checking capabilities.
- Generate Markdown documentation from models.
- Generate TypeScript interfaces for data entities from models.
- Future updates will add support for other Node.js ORM modules.

## Installation

```bash
# To install orm-modeling
npm install orm-modeling
# You will also need to install Knex and your chosen database engine, for example MySQL
npm install knex mysql
```

## Model Definition

- Models should be defined according to the TypeScript [types](/src/model.ts) provided. Thanks to TypeScript, your IDE will be able to provide useful prompts and indications as you define your models.
- Refer to this TypeScript [example](/test/users.model.ts) for a model definition.

In orm-modeling, a model is a representation of a database table and its associated attributes. Models are defined as JavaScript objects, taking advantage of TypeScript's autocompletion and type-checking capabilities to ensure correct model definitions.

Here's an example of how you can define a model for a 'files' table:

```ts
import {DataTypes, Model} from 'orm-modeling';

/**
 * File model
 */
const model: Model = {
  tableName: 'files',
  autoId: true,
  timestamps: {
    makeDefaultNow: true
  },
  comment: 'File archives',
  indexes: [],
  columns: {
    name: {
      type: DataTypes.VARCHAR,
      length: 500,
      unique: true,
      nullable: false,
      comment: 'File name',
    },
    original_filename: {
      type: DataTypes.VARCHAR,
      length: 2000,
      nullable: false,
      comment: 'Original name'
    },
    mimetype: {
      type: DataTypes.VARCHAR,
      length: 256,
      nullable: false,
      comment: 'File type',
    },
    size: {
      type: DataTypes.BIG_INTEGER,
      nullable: false,
      comment: 'File size',
    },
    data: {
      type: DataTypes.LONG_BLOB,
      comment: 'File data',
    },
    creator_id: {
      type: DataTypes.INTEGER,
      unsigned: true,
      nullable: false,
      comment: 'Creator id, admin user.'
    },
    // ... columns go here
  }
};

export default model;
```

In this example, the `Model` object has several properties:

- `tableName`: The name of the table in the database.
- `autoId`: If set to true, an 'id' column of type 'integer' will be automatically added to the model.
- `timestamps`: If set to true, 'created_at' and 'updated_at' columns will be automatically added to the model. You can also pass an object with more specific configuration options.
- `comment`: A comment for the table.
- `indexes`: An array defining the indexes for the table.
- `columns`: An object defining the columns of the table. Each key in this object represents a column in the table, and the value is an object that defines the properties of the column.

The `columns` property is an object where each key-value pair represents a column in the table. The key is the column name, and the value is an object that defines the column properties. 

Let's delve into the `Column` interface. Each property in the `Column` interface represents a configuration option for a column in a database table.

- `type`: This property defines the data type of the column. It can be one of the values from the `DataTypes` enum, or a string representing a valid data type. The `DataTypes` enum includes common data types such as 'string', 'integer', 'date', 'boolean', etc.

- `autoIncrement`: If set to `true` or 'bigIncrements', the column will automatically increment its value for each new row. This is typically used for primary key columns.

- `length`: This property specifies the maximum length of the column. It's applicable for string data types.

- `unsigned`: If set to `true`, the column will be set as an unsigned integer. This means it can only hold non-negative numbers. This property only applies to integer fields.

- `nullable`: If set to `true`, the column will allow null values. If not specified or set to `false`, the column will not accept null values.

- `primaryKey`: If set to `true` or a string, the column will be set as the primary key of the table. If the value is a string, it will be used as the name of the primary key constraint.

- `unique`: If set to `true` or a string, a unique constraint will be added to this column. If the value is a string, it will be used as the name of the unique constraint.

- `comment`: This property allows you to add a comment to the column.

- `defaultValue`: This property allows you to set a default value for the column.

- `datetimeOptions`: This property allows you to set options for 'datetime' and 'timestamp' column types. It should be an object of type `DatetimeOptions`, which can have properties like `precision` and `useTz` (for timezone).

- `floatOptions`: This property allows you to set options for 'float' and 'decimal' column types. It should be an object of type `FloatOptions`, which can have properties like `precision` and `scale`.

- `enumType`: This property allows you to set options for 'enum' or 'enu' column types. It should be an object of type `EnumType`, which includes `enumValues` (an array of possible values for the enum) and `enumOptions` (additional options for the enum).

- `reference`: This property allows you to add a foreign key reference to the column. It should be an object of type `Reference`, which includes properties like `table` (the referenced table), `column` (the referenced column), and `foreignKeyName` (the name of the foreign key constraint).

Each of these properties allows you to fine-tune the behavior and characteristics of your database columns, providing a high degree of flexibility in defining your data models.

By following this guide, you can define complex models that accurately represent your database tables. Remember, the power of orm-modeling lies in its ability to leverage TypeScript's features, providing you with autocompletion and type-checking capabilities as you define your models.

## Creating a Knex Schema

```JavaScript
const {createKnexSchema} = require('orm-modeling');
const Knex = require('knex');

// Create a Knex instance
const db = Knex();
// Define your model
const model = {
  // ... model attributes go here
}; 

createKnexSchema({db, model}).then(db=>{
   //  The function returns the Knex instance
}); 
```

For a complete example, refer to this [Knex schema creation example](/test/create-knex-model.test.ts).

## Generating Markdown Documentation

1. Import the `toMarkdownTable` function from the `orm-modeling` library.

```TypeScript
import { toMarkdownTable } from 'orm-modeling';
```

2. Define your model object as per the `Model` interface.

```TypeScript
const model: Model = {
  // ... model definition goes here
};
```

3. Call the `toMarkdownTable` function with your model object. This will return a string containing a Markdown table.

```TypeScript
const markdown: string = toMarkdownTable(model);
```

4. You can then write this string to a Markdown file, or use it however you like.

```TypeScript
import { writeFileSync } from 'fs';
writeFileSync('model.md', markdown);
```

## Generating TypeScript Interfaces

1. Import the `toTypeScriptInterface` function from the `orm-modeling` library.

```TypeScript
import { toTypeScriptInterface } from 'orm-modeling';
```

2. Define your model object as per the `Model` interface.

```TypeScript
const model: Model = {
  // ... model definition goes here
};
```

3. Call the `toTypeScriptInterface` function with your model object. This will return a string containing a TypeScript interface.

```TypeScript
const interfaceStr: string = toTypeScriptInterface(model);
```

4. You can then write this string to a TypeScript file, or use it however you like.

```TypeScript
import { writeFileSync } from 'fs';
writeFileSync('model.ts', interfaceStr);
```

This will generate a TypeScript interface that describes the structure of a row in the table that your model represents. This can be very useful when you're writing TypeScript code that interacts with this table, as it allows your editor to provide autocompletion and type checking.

## Skipping TypeScript Library Checks

For TypeScript users, if you encounter issues with the type declarations of certain packages, you may need to enable `skipLibCheck` in your tsconfig.json:

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```