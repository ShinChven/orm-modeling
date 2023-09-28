# orm-modeling

`orm-modeling`是一个强大的Node.js ORM工具，专为TypeScript设计。它允许您使用JavaScript对象定义数据库模式，并提供了IDE自动完成和模型定义的类型检查功能。它基于Knex查询构建器构建，与各种数据库引擎兼容。

[![npm版本](http://img.shields.io/npm/v/orm-modeling.svg)](https://npmjs.org/package/orm-modeling) [![npm下载量](https://img.shields.io/npm/dy/orm-modeling.svg)](https://npmjs.org/package/orm-modeling) [![文档](https://img.shields.io/badge/documentation-%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3-blue)](/README.MD)

主要特点：
- 使用TypeScript的自动完成和类型检查功能从模型定义中定义Knex模式。
- 从模型生成Markdown文档。
- 从模型生成数据实体的TypeScript接口。
- 未来的更新将支持其他Node.js ORM模块。

## 安装

```bash
# 安装orm-modeling
npm install orm-modeling
# 您还需要安装Knex和您选择的数据库引擎，例如MySQL
npm install knex mysql
```

## 简单上手：创建 Knex Schema

```JavaScript
const {createKnexSchema} = require('orm-modeling');
const Knex = require('knex');

// 创建Knex实例
const db = Knex();
// 定义您的模型
const model = {
  // ... 模型属性在此定义
}; 

createKnexSchema({db, model}).then(db=>{
   // 该函数返回Knex实例
}); 
```

要获取完整示例，请参阅此 [Knex模式创建示例](/test/create-knex-model.test.ts)。

## 模型定义

- 模型应根据提供的TypeScript [类型](/src/model.ts) 进行定义。借助于TypeScript，您的IDE将能够为您提供有用的提示和指示，以便您定义模型。

- 参考这个TypeScript [示例](/test/users.model.ts) 以获取模型定义的示例。

在orm-modeling中，模型是数据库表及其关联属性的表示。模型被定义为JavaScript对象，利用TypeScript的自动完成和类型检查功能来确保正确的模型定义。

以下是如何定义“文件”表的模型的示例：

```ts
import {DataTypes, Model} from 'orm-modeling';

/**
 * 文件模型
 */
const model: Model = {
  tableName: 'files',
  autoId: true,
  timestamps: {
    makeDefaultNow: true
  },
  comment: '文件存档',
  indexes: [],
  columns: {
    name: {
      type: DataTypes.VARCHAR,
      length: 500,
      unique: true,
      nullable: false,
      comment: '文件名',
    },
    original_filename: {
      type: DataTypes.VARCHAR,
      length: 2000,
      nullable: false,
      comment: '原始名称'
    },
    mimetype: {
      type: DataTypes.VARCHAR,
      length: 256,
      nullable: false,
      comment: '文件类型',
    },
    size: {
      type: DataTypes.BIG_INTEGER,
      nullable: false,
      comment: '文件大小',
    },
    data: {
      type: DataTypes.LONG_BLOB,
      comment: '文件数据',
    },
    creator_id: {
      type: DataTypes.INTEGER,
      unsigned: true,
      nullable: false,
      comment: '创建者ID，管理员用户。'
    },
    // ... 其他列在此定义
  }
};

export default model;
```

在此示例中，`Model` 对象具有几个属性：

- `tableName`：数据库中表的名称。
- `autoId`：如果设置为true，将自动添加一个类型为“整数”的“id”列到模型中。
- `timestamps`：如果设置为true，则会自动添加“created_at”和“updated_at”列到模型中。您还可以传递一个包含更具体配置选项的对象。
- `comment`：表的注释。
- `indexes`：定义表的索引的数组。
- `columns`：定义表的列的对象。此对象中的每个键代表表中的一列，值是一个定义列属性的对象。

`columns` 属性是一个对象，其中每个键值对表示表中的一列。键是列名，值是一个定义列属性的对象。

让我们深入研究 `Column` 接口。 `Column` 接口中的每个属性都表示数据库表中列的配置选项。

- `type`：此属性定义列的数据类型。它可以是 `DataTypes` 枚举中的值之一，也可以是表示有效数据类型的字符串。 `DataTypes` 枚举包括常见数据类型，如 'string'、'integer'、'date'、'boolean' 等。

- `autoIncrement`：如果设置为`true` 或 'bigIncrements'，则该列将自动递增其值以用于每行新记录。通常用于主键列。

- `length`：此属性指定列的最大长度。适用于字符串数据类型。

- `unsigned`：如果设置为 `true`，则列将设置为无符号整数。这意味着它只能保存非负数。此属性仅适用于整数字段。

- `nullable`：如果设置为 `true`，则列将允许为空值。如果未指定或设置为 `false`，则列将不允许为空值。

- `primaryKey`：如果设置为 `true` 或字符串，则该列将设置为表的主键。如果值是字符串，则将其用作主键约束的名称。

- `unique`：如果设置为 `true` 或字符串，则将为此列添加唯一约束。如果值是字符串，则将其用作唯一约束的名称。

- `comment`：此属性允许您为列添加注释。

- `defaultValue`：此属性允许您为列设置默认值。

- `datetimeOptions`：此属性允许您为 'datetime' 和 'timestamp' 列类型设置选项。它应该是一个 `DatetimeOptions` 类型的对象，可以具有属性如 `precision` 和 `useTz`（用于时区）。

- `floatOptions`：此属性允许您为 'float' 和 'decimal' 列类型设置选项。它应该是一个 `FloatOptions` 类型的对象，可以具有属性如 `precision` 和 `scale`。

- `enumType`：此属性允许您为 'enum' 或 'enu' 列类型设置选项。它应该是一个 `EnumType` 类型的对象，其中包括 `enumValues`（枚举的可能值

数组）和 `enumOptions`（枚举的其他选项）。

- `reference`：此属性允许您向列添加外键引用。它应该是一个 `Reference` 类型的对象，其中包括属性如 `table`（引用的表）、`column`（引用的列）和 `foreignKeyName`（外键约束的名称）。

这些属性中的每一个都允许您微调数据库列的行为和特性，提供了在定义数据模型时的高度灵活性。

通过遵循此指南，您可以定义准确表示数据库表的复杂模型。请记住，orm-modeling 的强大之处在于它能够利用TypeScript的特性，在您定义模型时提供自动完成和类型检查的功能。

## 生成Markdown文档

1. 从 `orm-modeling` 库导入 `toMarkdownTable` 函数。

```TypeScript
import { toMarkdownTable } from 'orm-modeling';
```

2. 根据 `Model` 接口定义您的模型对象。

```TypeScript
const model: Model = {
  // ... 模型定义在此处
};
```

3. 使用您的模型对象调用 `toMarkdownTable` 函数。这将返回一个包含Markdown表格的字符串。

```TypeScript
const markdown: string = toMarkdownTable(model);
```

4. 您可以将此字符串写入Markdown文件，或以任何您喜欢的方式使用它。

```TypeScript
import { writeFileSync } from 'fs';
writeFileSync('model.md', markdown);
```

## 生成TypeScript接口

1. 从 `orm-modeling` 库导入 `toTypeScriptInterface` 函数。

```TypeScript
import { toTypeScriptInterface } from 'orm-modeling';
```

2. 根据 `Model` 接口定义您的模型对象。

```TypeScript
const model: Model = {
  // ... 模型定义在此处
};
```

3. 使用您的模型对象调用 `toTypeScriptInterface` 函数。这将返回一个包含TypeScript接口的字符串。

```TypeScript
const interfaceStr: string = toTypeScriptInterface(model);
```

4. 您可以将此字符串写入TypeScript文件，或以任何您喜欢的方式使用它。

```TypeScript
import { writeFileSync } from 'fs';
writeFileSync('model.ts', interfaceStr);
```

这将生成一个描述您的模型代表的表中行的结构的TypeScript接口。当您编写与此表交互的TypeScript代码时，这可以非常有用，因为它允许您的编辑器提供自动完成和类型检查。

## 跳过TypeScript库检查

对于TypeScript用户，如果您遇到某些包的类型声明问题，您可能需要在tsconfig.json中启用 `skipLibCheck`：

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```