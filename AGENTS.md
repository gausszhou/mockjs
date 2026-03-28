# Mock.js 开发指南

## 项目结构

```
src/           源代码
  mock.js      入口文件
  mock/        核心模块
    handler.js   模板处理
    parser.js    模板解析
    util.js      工具函数
    random/      随机数据生成
    regexp/      正则处理
    schema/     JSON Schema
    valid/      数据验证
    xhr/        XHR 拦截
test/          测试文件 (*.test.js)
dist/          打包产物
```

## 命令

```bash
pnpm install    # 安装依赖
npx vitest run  # 运行测试
npx vite build  # 打包
```

## 代码规范

- ES 模块 (ESM)
- 4 空格缩进
- 无分号
- 常量 UPPER_SNAKE_CASE
- 函数/变量 camelCase

## Git 提交

- 使用中文 commit message
- 格式：`<type>: <description>`
- type: feat | fix | refactor | chore | docs
- 跳过 pre-commit hook: `git commit --no-verify -m "..."`

## 注意事项

- **只有用户主动要求提交代码时才进行提交**
- 不要自动提交或推送代码
