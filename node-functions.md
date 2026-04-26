# 概览

> **Description**: 了解Cloud Functions如何简化后端代码在云端运行，无需管理服务器资源。Node.js运行时支持，JavaScript和TypeScript开发，适用于复杂场景。未来将支持更多编程语言。
> **Keywords**: Cloud Functions, 后端代码, 云端运行, Node.js, JavaScript, TypeScript, API开发, 边缘计算
> **Page Title**: Cloud Functions: 动态能力构建与API开发 - EdgeOne Pages
> **Source**: EdgeOne Pages
> **URL**: https://pages.edgeone.ai/zh/document/cloud-functions

---
## 概览

## 简介

Cloud Functions 是 Pages Functions 提供的云端函数服务，适用于需要访问外部服务、操作数据库、处理计算密集型任务等复杂后端场景。

## 支持的运行时

Cloud Functions 支持多种主流编程语言及运行环境，您可以根据业务需求选择最合适的运行时。

### Node.js

支持 JavaScript 或 TypeScript 开发。您可以直接访问完整的 npm 生态，利用成熟的 Node.js 工具链构建应用。

### Python

支持使用 Python 语言开发，并通过 pip 集成第三方库。原生支持 Flask、FastAPI、Django、Sanic 等主流 Web 框架。

### Go

利用 Go 语言出色的并发能力与执行性能构建高性能后端服务，支持通过 Go Modules 管理项目依赖。

## 多地域部署

Cloud Functions 支持多地域部署，您可以选择函数运行的地域，将函数部署到离数据源更近的区域，从而降低网络延迟、提升响应速度。

**说明：**

多地域部署仅适用于 Cloud Functions。

### 地域选择

Cloud Functions 的地域配置与项目的**加速区域**相关：

-   **全球可用区**（含中国大陆）：可分别配置大陆地域和海外地域。
-   **中国大陆可用区**：仅需配置大陆地域。
-   **全球可用区（不含中国大陆）**：仅需配置海外地域。

默认情况下，大陆地域为 `ap-guangzhou`（广州），海外地域为 `ap-singapore`（新加坡）。

#### 可选地域列表

**大陆地域：**

| 地域名称 | 地域 ID |
| --- | --- |
| 广州 | `ap-guangzhou` |
| 上海 | `ap-shanghai` |
| 南京 | `ap-nanjing` |
| 北京 | `ap-beijing` |
| 成都 | `ap-chengdu` |

**海外地域：**

| 地域名称 | 地域 ID |
| --- | --- |
| 新加坡 | `ap-singapore` |
| 香港 | `ap-hongkong` |
| 台北 | `ap-taipei` |
| 曼谷 | `ap-bangkok` |
| 雅加达 | `ap-jakarta` |
| 首尔 | `ap-seoul` |
| 东京 | `ap-tokyo` |
| 法兰克福 | `eu-frankfurt` |
| 弗吉尼亚 | `na-ashburn` |
| 硅谷 | `na-siliconvalley` |

### 配置方式

#### 通过控制台配置

在 Pages 控制台项目设置的**函数管理**中选择部署地域。

#### 通过 edgeone.json 配置

在 `edgeone.json` 文件中，通过 `mainlandRegions` 和 `overseasRegions` 字段指定函数部署地域，根据项目的加速区域按需配置：

```
{
  "mainlandRegions": ["ap-beijing"],
  "overseasRegions": ["ap-tokyo"]
}
```

**注意：**

-   每个字段的数组中只能配置一个地域。
-   `edgeone.json` 中的地域配置优先级高于控制台配置。

## 使用限制

以下为 Cloud Functions 各运行时的通用限制与运行时版本信息：

| **内容** | **限制** | **说明** |
| --- | --- | --- |
| 代码包大小 | 128 MB | 单个函数代码包大小（含依赖）最多支持 128 MB |
| 请求 body 大小 | 6 MB | 客户端请求携带 body 最多支持 6 MB |
| 最大执行时长 | 120s | 单个请求从开始到响应的最大允许时间（Maximum Duration） |
| Node.js 版本 | v20.x | 默认 Node.js 运行时版本 |
| Python 版本 | 3.10 | 服务端运行环境为 Python 3.10，建议本地开发也使用相同版本 |
| Go 版本 | 1.26 | 运行环境版本 1.26（向后兼容） |

# Node.js

> **Description**: Overview Node Functions 提供强大的无服务器Node.js运行环境，支持复杂后端逻辑的开发与部署。自动扩展，确保高性能与低延迟，实现全栈部署。
> **Keywords**: Node.js, 无服务器, 后端逻辑, 自动扩展, 高性能, 低延迟, 全栈部署, Node Functions
> **Page Title**: Node Functions - EdgeOne Pages
> **Source**: EdgeOne Pages
> **URL**: https://pages.edgeone.ai/zh/document/node-functions

---
## Node.js

### 概述

Node.js 运行时支持 JavaScript 和 TypeScript 开发，可直接使用 npm 生态中的海量模块，适合构建 API 服务与全栈 Web 应用。

### 优势

-   **丰富的 Node.js 生态：**可以直接使用 npm 中的各类第三方库和工具，轻松集成数据库、AI、支付等服务，满足复杂业务需求。
-   **全栈开发体验：**无需再将前后端项目分离，可在同一个项目中完成开发和部署，大幅提升协作效率。
-   **路由即服务：**通过文件系统即可定义 API 路由，实现后端逻辑的快速开发与部署，将后端服务像前端页面一样便捷管理。

### 开发模式

Node.js 函数支持多种开发模式：

| 模式 | 适用场景 | 路由方式 | 框架依赖 |
| --- | --- | --- | --- |
| **Handler 模式** | 简单 API、Serverless 风格 | 文件系统路由（文件即路由） | 无（纯原生） |
| **框架模式** | 完整 Web 应用、RESTful API | 框架内置路由 | Express、Koa 等 |

### 快速开始

在项目的 ./cloud-functions/api 目录下新建 hello.js，使用以下示例代码创建您的第一个 Node.js 函数：

```
// ./cloud-functions/api/hello.js
export default function onRequest(context) {
  return new Response('Hello from Node.js!');
}
```

我们建议您通过子目录来管理函数文件，如下示例在 ./cloud-functions/api 下创建 nodeinfo.js，用于返回 node 相关信息：

```
// ./cloud-functions/api/nodeinfo.js
import * as os from 'node:os'
import { randomUUID, createHash } from 'node:crypto'

export const onRequestGet = async ({ request }) => {
  const info = {
    nodeVersion: process.version,
    pid: process.pid,
    platform: os.platform(),
    url: request.url,
  }

  return new Response(JSON.stringify(info), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  })
}
```

在 Node.js 函数中使用 Express/Koa 开发时需注意，**框架的路由只需要集中在一个函数文件里面处理，无需额外启动 HTTP Server 且需导出框架的实例**。如下示例在 ./cloud-functions/express 下创建 \[\[default\]\].js，用于处理 express 的业务逻辑：

```
// ./cloud-functions/express/[[default]].js
import express from "express";
const app = express();

// 添加日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express on Node.js!" });
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  res.json({ userId: id, message: `Fetched user ${id}` });
});

// 导出 express 实例
export default app;
```

### 路由

Node.js 函数基于 `/cloud-functions` 目录结构生成访问路由。您可在项目仓库 /cloud-functions 目录下创建任意层级的子目录，参考下述示例。

```
...
cloud-functions
├── index.js
├── hello-pages.js
├── helloworld.js
├── api
    ├── users
      ├── list.js
      ├── geo.js
      ├── [id].js
    ├── visit
      ├── index.js
    ├── [[default]].js
...
```

上述目录文件结构，经 EdgeOne Pages 平台构建后将生成以下路由。这些路由将 Pages URL 映射到 `/cloud-functions` 文件，当客户端访问 URL 时将触发对应的文件代码被运行：

| 文件路径 | 路由 |
| --- | --- |
| /cloud-functions/index.js | example.com/ |
| /cloud-functions/hello-pages.js | example.com/hello-pages |
| /cloud-functions/helloworld.js | example.com/helloworld |
| /cloud-functions/api/users/list.js | example.com/api/users/list |
| /cloud-functions/api/users/geo.js | example.com/api/users/geo |
| /cloud-functions/api/users/[id].js | example.com/api/users/1024 |
| /cloud-functions/api/visit/index.js | example.com/api/visit |
| /cloud-functions/api/[[default]].js | example.com/api/books/list、example.com/api/books/1024、example.com/api/... |

**说明：**

-   路由尾部斜杠 / 是可选。`/hello-pages` 和 `/hello-pages/` 将被路由到 /cloud-functions/hello-pages.js。
-   如果 Node.js 路由跟静态资源路由冲突，客户端请求将优先被路由到静态资源。
-   路由大小写敏感，/helloworld 将被路由到 /cloud-functions/helloworld.js，不能被路由到 /cloud-functions/HelloWorld.js

#### 路由匹配优先级

路由按以下优先级进行匹配（从高到低）：

1.  **静态路由**：精确匹配的路径优先（如 `/api/users/list`）
2.  **单级动态路由**：`[param]` 匹配单个路径段（如 `/api/users/[id]`）
3.  **多级动态路由（Catch-all）**：`[[param]]` 匹配一个或多个路径段（如 `/api/[[default]]`）

同级别路由中，路径越长（越具体）优先级越高。

#### 入口文件识别

并非所有 `.js` / `.ts` 文件都会被注册为路由。只有导出了 Function Handlers 方法（如 `onRequest`、`onRequestGet` 等）或导出了框架实例（如 Express `app`）的文件才会生成路由。

不包含入口标识的 `.js` / `.ts` 文件将被视为辅助模块，会被复制到构建产物中供其他入口文件引用，但不会注册为独立路由。

#### **动态路由**

Node.js 函数支持动态路由，上述示例中一级动态路径 /cloud-functions/api/users/\[id\].js，多级动态路径 /cloud-functions/api/\[\[default\]\].js。参考下述用法：

| 文件路径 | 路由 | 匹配 |
| --- | --- | --- |
| /cloud-functions/api/users/[id].js | example.com/api/users/1024 | 是 |
|  | example.com/api/users/vip/1024 | 否 |
|  | example.com/api/vip/1024 | 否 |
| /cloud-functions/api/[[default]].js | example.com/api/books/list | 是 |
|  | example.com/api/1024 | 是 |
|  | example.com/v2/vip/1024 | 否 |

#### 动态路由参数获取

在 Handler 模式下，可通过 `context.params` 获取动态路由参数：

```
// ./cloud-functions/api/users/[id].js
export function onRequestGet(context) {
  return new Response(`User id is ${context.params.id}`);
}
```

#### **框架内置路由**

在涉及到 Express/Koa 框架的开发时，代码的编写与文件组织形式有几个要点需要注意。

**Express/Koa 框架：**

-   所有路由服务都收拢在**一个函数文件**内，且文件名必须是 \[\[\]\] 的格式，如 \[\[default\]\].js。
-   无需额外启动 HTTP Server 与设置端口监听
-   必须导出框架实例否则构建器不会将其识别为函数 `export default app;`

例如，在目录 cloud-functions/express/\* 下创建 express 应用，需以 \[\[default\]\].js 作为入口，且所有 express 相关路由都在 \[\[default\]\].js 里面：

```
cloud-functions 
└── express
    └── [[default]].js # express.js/koa.js 入口文件，包含框架内置路由定义
```

### Function Handlers

使用 Functions Handlers 可为 Pages 创建自定义请求处理程序，以及定义 RESTful API 实现全栈应用。支持下述的 Handlers 方法：

| Handlers 方法 | 描述 |
| --- | --- |
| `onRequest`(context: EventContext): Response \| Promise<Response> | 匹配 HTTP Methods (`GET`,`POST`,`PATCH`,`PUT`,`DELETE`,`HEAD`,`OPTIONS`) |
| `onRequestGet`(context: EventContext): Response \| Promise<Response> | 匹配 HTTP Methods (`GET`) |
| `onRequestPost`(context: EventContext): Response \| Promise<Response> | 匹配 HTTP Methods (`POST`) |
| `onRequestPatch`(context: EventContext): Response \| Promise<Response> | 匹配 HTTP Methods (`PATCH`) |
| `onRequestPut`(context: EventContext): Response \| Promise<Response> | 匹配 HTTP Methods (`PUT`) |
| `onRequestDelete`(context: EventContext): Response \| Promise<Response> | 匹配 HTTP Methods (`DELETE`) |
| `onRequestHead`(context: EventContext): Response \| Promise<Response> | 匹配 HTTP Methods (`HEAD`) |
| `onRequestOptions`(context: EventContext): Response \| Promise<Response> | 匹配 HTTP Methods (`OPTIONS`) |

#### 基本用法

Handler 函数通过导出 `onRequest` 方法处理所有 HTTP 请求：

```
// ./cloud-functions/api/hello.js
export default function onRequest(context) {
  return new Response('Hello, world!', {
    headers: { 'Content-Type': 'text/plain' },
  });
}
```

#### 处理多种请求方法

通过导出不同的 Handler 方法，可以分别处理不同类型的 HTTP 请求：

```
// ./cloud-functions/api/users/index.js
export function onRequestGet(context) {
  return new Response(JSON.stringify({ users: [] }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export function onRequestPost(context) {
  return context.request.json().then(data => {
    return new Response(JSON.stringify({ message: 'Created', data }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  });
}

export function onRequestDelete(context) {
  return new Response(null, { status: 204 });
}
```

#### 获取查询参数

```
// ./cloud-functions/api/search.js
export function onRequestGet(context) {
  const url = new URL(context.request.url);
  const name = url.searchParams.get('name') || 'Guest';

  return new Response(JSON.stringify({ hello: name }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

**EventContext 对象描述**

context 是传递给 Function Handlers 方法的对象，包含下述属性：

-   uuid：EO-LOG-UUID 代表了 EO 请求的唯一标识符
-   params：动态路由 `/cloud-functions/api/users/[id].js` 参数值

```
export function onRequestGet(context) {
  return new Response(`User id is ${context.params.id}`);
}
```

-   env：Pages 环境变量
-   clientIp：客户端 IP 地址
-   server：
-   region: 部署地的区域编码​
-   requestId: 请求 ID，用于日志跟踪
-   geo：客户端地理位置信息

**Response 对象描述**

函数必须返回一个 [Response 对象](https://developer.mozilla.org/zh-CN/docs/Web/API/Response)，来响应客户端的 HTTP 请求，包含 headers，status，body 等属性。

### 示例模板

**连接 MySQL 三方数据库：**

**使用 Express 框架：**

**使用 Koa 框架：**