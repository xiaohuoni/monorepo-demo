# monorepo demo

## 修改 bootstrap 代码

新增包时，packages 下的空文件夹，如果名字为 xxx 则包名为 xxx，否则包名为 @xxxteam/other

```diff
- const name = shortName === 'demo' ? shortName : `@demoteam/${shortName}`;
+ const name = shortName === 'xxx' ? shortName : `@xxxteam/${shortName}`;
```

### bootstrap新增包

在 packages 下新建一个文件夹，如 `packages/some`，执行 `pnpm bootstrap`

## 构建

```bash
pnpm build
```

## 日志

确认完开发内容，提交 PR 之前，执行 `pnpm changeset`。


1、选择自己修改的包。

`🦋  Which packages would you like to include?`
空格选择

2、选择是不是大版本修改

如果不确定，以下两个问题都不选，直接回车。

```
🦋  Which packages should have a major bump? · No items were selected
🦋  Which packages should have a minor bump? · No items were selected
```

3、输入修改内容说明


命令行写起来麻烦，可以随便写一下。在下一步里面详细写明。

```
🦋  Please enter a summary for this change (this will be in the changelogs). Submit empty line to open external editor
🦋  Summary : ...
```

4、如果已在命令行中写明 changelog，这一步可以跳过

执行完前三步，会在 `.changeset` 目录下面，随机生成一个文件。双击打开编辑里面的 changelog 就可以。

5、将生成的文件，与本次的所有修改，提交到云端即可。再发版本的时候，这些文件会被自动消耗。

## 发包流程

修改 .npmrc 

```diff
+ registry=https://registry.npmjs.org/
+ # registry=https://registry.npmmirror.com
```

执行 `pnpm vp` 消耗积累的 changelog，会自动添加到指定包下的 `CHANGELOG.md`。

执行 `npm run pub` 发布。