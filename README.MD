# orm-modeling 

A node orm modeling tool that generates types and docs.

[![npm version](http://img.shields.io/npm/v/orm-modeling.svg)](https://npmjs.org/package/orm-modeling)
[![npm downloads](https://img.shields.io/npm/dy/orm-modeling.svg)](https://npmjs.org/package/orm-modeling)

[中文文档](/README.zh-CN.MD)

- Create knex schema from model.
- Generate markdown document from model.
- Generate TypeScript interface for data entity from model.
- Other node ORM modules will be supported in the future. 

## Install

```bash
# install module
npm install orm-modeling
# you will also need
npm install mysql knex
```

## Define model

- Define your model according to [types](/src/model.ts)
- See [example](/test/users.model.ts)

## Create knex schema

```JavaScript
const {createKnexSchema} = require('orm-modeling');
const Knex = require('knex');

// knex instance
const db = Knex();
// your model
const model = {
  // ... your model attributes
}; 

createKnexSchema({db, model}).then(db=>{
   //  returns the knex instance
}); 
```

See [example](/test/create-knex-model.test.ts).

## Generate markdown document

```JavaScript
const {toMarkdownTable} = require('orm-modeling');

const markdown = toMarkdownTable(model); // returns a markdown table code in string
```

## Generate TypeScript interface

```JavaScript
const {toTypeScriptInterface} = require('orm-modeling');

const interfaceStr = toTypeScriptInterface(model); // returns a TypeScript Interface code in string
```

## Skip TypeScript Lib Check

If you use TypeScript and some packages' type declaration went wrong, you may need to `skipLibCheck`.

edit your tsconfig.json:

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```
