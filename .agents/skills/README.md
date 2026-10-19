# 工作区 AI skills

本目录存放与本博客工作流绑定的 task-scoped skill。DSH 会自动发现 `*/SKILL.md` 并在技能目录中注册。

| Skill | 用途 | 触发场景 |
| --- | --- | --- |
| [`blog-writing-review`](./blog-writing-review/SKILL.md) | 题解与文章正文的写作/审查规范 | 读写 `shirones/content/posts/` 下的文章；用户提到「题解」「审查」「规范」「summary/description」 |

## 约定

- 每个 skill 一个目录，入口文件固定为 `SKILL.md`。
- `SKILL.md` 顶部的 YAML frontmatter 必须包含 `name`（小写 kebab-case，与目录名一致）和 `description`（写明「做什么 + 什么时候用」）。
- 规范类内容保持**单一事实来源**：题解规范只写在本目录的 skill 里，不要在其他文档重复维护一份。
- 增删 skill 后，同步更新本索引。

## 与主题自带 skill 的关系

`node_modules/shirones` 里带有主题维护者的 `.agents/skills/`（组件、配置、打包等开发向 skill）。本目录的 skill 面向**这个博客的内容写作**，两者不冲突；若升级 `shirones` 后主题 skill 出现在项目根，请保留本目录。
