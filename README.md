# Explode-Node

Explode-Node 是为音游 Dynamite 以 NodeJS 开发的私服。`dynamite.graphql` 是其后端的所有已知接口。

## 免责声明

如果认为本项目侵害到 TunerGames 利益，请在项目中发起 Issue，将在 5 日内将仓库删除。

## 详细信息

Dynamite 使用 GraphQL 作为其后端接口，本项目整理了所有已知的 GraphQL 接口，存放在 `dyanmite.graphql` 中。

官方游戏默认请求 <https://api.tunergames.com> 调用 GraphQL 后端，请求 <https://dynamite.tunergames.com> 获取谱面、曲绘、音乐等资源，请求地址模板如下。

### 资源请求地址

- 音乐：<https://dynamite.tunergames.com/download/music/encoded/{setId}>
- 封面：<https://dynamite.tunergames.com/download/cover/encoded/{setId}>
- 预览：<https://dynamite.tunergames.com/download/preview/encoded/{setId}>
- 铺面：<https://dynamite.tunergames.com/download/chart/encoded/{chartId}>
- 用户头像：<https://dynamite.tunergames.com/download/avatar/256x256_jpg/{userId}>
- 谱面商店预览图：<https://dynamite.tunergames.com/download/cover/480x270_jpg/{setId}>

其中 `setId` 为 `ChartSet` 的 `_id` 字段；`chartId` 为 `Chart` 的 `_id` 字段；`userId` 为 `User` 的 `_id` 字段。

### 可行性？

曾经见过通过中间人攻击来使用 Dynamix 私服的情况，所以完全可以如法炮制使用 Explode 作为 Dynamite 私服。或通过拆 Dynamite 修改其接口地址来达到相同效果。

### 使用方式

1. 将本项目 clone 到本地
2. `node app`
3. 用任意方法将游戏流量转发到当前电脑
4. 将需要分发的数据导入到 `data` 文件夹中

#### 分发数据结构

- `/data/music` 音乐（加密）
- `/data/cover` 选曲目录的曲绘（加密）
- `/data/preview` 选曲目录的预览音乐（加密）
- `/data/chart` 谱面（加密）
- `/data/avatar` 用户头像
- `/data/cover_small` 商店界面的预览曲绘

## 参与项目

欢迎各位佬提交，当您的 PR 首次被接受时，我们将向您发送一封 Dyfused 组织的邀请。

项目中的所有代码部分遵守 WTFPL 开源；`data` 文件夹下的内容来源于 TunerGames 审核通过的社区资源，侵删。