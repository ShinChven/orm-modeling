# orm-modeling 

[![npm version](http://img.shields.io/npm/v/orm-modeling.svg)](https://npmjs.org/package/orm-modeling)

这是一个面向数据模型定义（model）的 Nodejs ORM 工具，它可以：
- 使用`knex`加载 model 来创建数据库 schema 。
- 根据 model 生成 Markdown 文档。

未来可能兼容其他的 node orm 库。

## 安装

```bash
# 安装 orm-modeling 库 
npm install orm-modeling
# 你可能还需要安装相应的数据库连接库
npm install mysql knex
```

## 定义数据库模型

- 请参考 [types](/src/model.ts) 定义你的数据库模型
- 这是一个定义模型的示例：[example](/test/users.model.ts)

## 创建 knex 的 schema 

```JavaScript
const {createKnexSchema} = require('orm-modeling');
const Knex = require('knex');

// 创建knex实例
const db = Knex();
// 定义你的数据库模型
const model = {
  // ... 请参照 Model 的 interface 定义数据库模型
}; 

// 使用 createKnexSchema 函数向 knex 实例中加载 model
createKnexSchema({db, model}).then(db=>{
   // db 是传入的 knex 实例 
}); 
```

请查看调用`createKnexSchema`函数的示例：[example](/test/create-knex-model.test.ts).

## 根据 model 生成 Markdown 文档

```JavaScript
const {toMarkdownTable} = require('orm-modeling');

const markdown = toMarkdownTable(model); // 调用 toMarkdownTable 函数根据 model 生成 Markdown 文档的字符串
```

## 根据 model 生成 TypeScript 的 Interface

```JavaScript
const {toTypeScriptInterface} = require('orm-modeling');

const interfaceStr = toTypeScriptInterface(model); // 返回 TypeScript interface 代码的字符串
```
