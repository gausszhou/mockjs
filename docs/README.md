# Mock.js 源码分析

## 概述

Mock.js 是一个用于生成随机数据和拦截 Ajax 请求的 JavaScript 库。它可以在 Node.js 和浏览器环境中运行。

## 目录结构

```
src/
├── mock.js              # 主入口文件
└── mock/
    ├── constant.js      # 常量定义
    ├── util.js          # 工具函数
    ├── parser.js        # 模板解析器
    ├── handler.js       # 模板处理器
    ├── random/          # 随机数据生成器
    │   ├── index.js     # 聚合导出
    │   ├── basic.js     # 基础类型（布尔、整型、浮点、字符、字符串）
    │   ├── date.js      # 日期时间
    │   ├── image.js     # 图片
    │   ├── color.js     # 颜色
    │   ├── text.js      # 文本段落
    │   ├── name.js      # 人名
    │   ├── web.js       # Web 相关
    │   ├── address.js   # 地址
    │   ├── helper.js    # 辅助函数
    │   └── misc.js      # 杂项
    ├── regexp/          # 正则处理
    │   ├── index.js     # 聚合导出
    │   ├── parser.js    # 正则解析
    │   └── handler.js   # 正则处理
    ├── schema/         # JSON Schema
    │   ├── index.js     # 聚合导出
    │   └── schema.js    # 模板转 JSON Schema
    ├── valid/         # 数据验证
    │   ├── index.js     # 聚合导出
    │   └── valid.js     # 数据校验实现
    └── xhr/           # XHR 拦截
        ├── index.js     # 聚合导出
        └── xhr.js      # XMLHttpRequest 拦截器
```

## 核心模块

### mock.js

主入口文件，负责：

- **导出核心模块**：Handler、Util、Random、RE、toJSONSchema、valid
- **Mock.mock()**：根据数据模板生成模拟数据
- **XHR 拦截**：延迟加载 xhr 模块，避免循环依赖

```javascript
// 使用方式
Mock.mock(template)                    // 直接生成数据
Mock.mock(rurl, template)              // 拦截指定 URL
Mock.mock(rurl, rtype, template)       // 拦截指定 URL 和请求方法
```

### parser.js

解析数据模板中的生成规则。

**规则语法**：`name|rule: value`

- `name|min-max`：生成 min 到 max 之间的随机数
- `name|count`：生成 count 个元素
- `name|min-max.decimal`：生成浮点数，小数位数在 min 到 max 之间

### handler.js

处理数据模板，生成最终数据。

**支持的类型**：

- `object`：对象模板
- `array`：数组模板
- `number`：数值模板
- `boolean`：布尔模板
- `string`：字符串模板
- `function`：函数模板
- `regexp`：正则模板

**核心方法**：

- `Handler.gen(template, name, context)`：生成数据的入口方法
- `Handler.getValueByKeyPath(key, options)`：通过路径获取值

### util.js

工具函数模块，提供：

- `Util.extend()`：深拷贝扩展对象
- `Util.each()`：遍历数组或对象
- `Util.type()`：获取数据类型
- `Util.isArray()`、`Util.isObject()` 等类型判断
- `Util.isNumeric()`：判断数值
- `Util.keys()`：获取对象键
- `Util.noop()`：空函数
- `Util.Random`：随机数生成器（支持种子）

### constant.js

定义项目常量和正则表达式：

- `GUID`：全局唯一标识
- `RE_KEY`：匹配生成规则的正则
- `RE_RANGE`：匹配数值范围的正则

## Random 模块

随机数据生成器，支持：

### basic.js

- `boolean()` / `bool()`：随机布尔值
- `natural()`：随机自然数
- `integer()`：随机整数
- `float()`：随机浮点数
- `character()` / `char()`：随机字符
- `string()`：随机字符串

### date.js

- `date()`：随机日期
- `time()`：随机时间
- `datetime()`：随机日期时间
- `now()`：当前时间

### image.js

- `image()`：随机图片
- `dataImage()`：随机 Base64 图片

### color.js

- `hex()`：随机十六进制颜色
- `rgb()`：随机 RGB 颜色
- `rgba()`：随机 RGBA 颜色
- `hsl()`：随机 HSL 颜色

### text.js

- `paragraph()` / `paragraphs()`：随机段落
- `sentence()` / `sentences()`：随机句子
- `word()`：随机单词
- `title()`：随机标题

### name.js

- `first()`：随机名
- `last()`：随机姓
- `name()`：随机姓名
- `cfirst()`：随机中文名
- `clast()`：随机中文姓
- `cname()`：随机中文姓名

### web.js

- `url()`：随机 URL
- `protocol()`：随机协议
- `domain()`：随机域名
- `ip()`：随机 IP 地址
- `email()`：随机邮箱
- `id()`：随机 ID

### address.js

- `region()`：随机地区
- `province()`：随机省份
- `city()`：随机城市
- `county()`：随机县/区

### helper.js

- `capitalize()`：首字母大写
- `upper()`：转大写
- `lower()`：转小写
- `pick()`：随机选取
- `shuffle()`：打乱数组

### misc.js

- `guid()`：全局唯一标识
- `increment()`：自增整数

## Regexp 模块

处理正则表达式相关的占位符。

### regexp/parser.js

解析正则表达式模板。

### regexp/handler.js

处理正则表达式，生成匹配规则的随机字符串。

## Schema 模块

将 Mock.js 数据模板转换为 JSON Schema 格式。

```javascript
const schema = Mock.toJSONSchema(template)
```

## Valid 模块

校验真实数据是否与数据模板匹配。

```javascript
const result = Mock.valid(template, data)
// 返回校验结果
```

## XHR 模块

拦截 XMLHttpRequest 请求，实现本地模拟。

### 功能特性

- 拦截 `XMLHttpRequest` 的所有方法
- 支持同步/异步请求
- 模拟请求进度事件
- 支持超时设置
- 兼容 ActiveXObject（IE）

### 使用方式

```javascript
Mock.setup({
    timeout: '100-500'  // 随机延迟
})

Mock.mock('/api/user', {
    name: '张三',
    age: 18
})

// 发起真实请求时会被拦截
fetch('/api/user').then(...)
```

## 数据模板示例

```javascript
// 生成随机用户数据
Mock.mock({
    'user|1-3': [{
        'id|+1': 1,
        'name': '@cname',
        'email': '@email',
        'age|18-60': 18,
        'avatar': '@image(100x100)',
        'createdAt': '@datetime',
        'address': {
            'province': '@province',
            'city': '@city'
        }
    }]
})
```

## 运行原理

1. **模板解析**：Parser 解析属性名中的生成规则
2. **类型识别**：Handler 根据属性值的类型选择对应处理方法
3. **数据生成**：调用 Random 模块生成随机数据
4. **XHR 拦截**：在浏览器环境中替换原生 XMLHttpRequest
