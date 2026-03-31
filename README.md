# Agent Platform 文档

在线文档：https://weeknd0214.github.io/agent-platform-docs/

---

## 平台已实现的功能

### 后装智能体

实现了后装算法迭代 Agent 的任务编排流程（分类、下载、标注、训练数据生成、训练/预测/转换）在中台界面的显示，并提供了**人在回路**功能，在关键节点支持人工介入。

![后装智能体界面1](https://github.com/user-attachments/assets/ddacc036-ece2-45ba-aebb-3c642ea98ad5)

<img width="1280" height="781" alt="image" src="https://github.com/user-attachments/assets/d6c481cc-ae3b-4a5b-88ca-73c873641cdd" />

---

### AI 网关

> 参考文档：[AI 网关](https://weeknd0214.github.io/agent-platform-docs/)

通过插件链路沿请求路径组合而成的网关，实现平台化的**流量控制、用户权限、审计检查**等功能。

![AI 网关界面1](https://github.com/user-attachments/assets/b0563701-17f1-444d-9663-16798b9cf2dd)

<img width="1280" height="745" alt="image" src="https://github.com/user-attachments/assets/2e7206e7-f932-406e-a609-24fde221fe67" />

**已实现功能点：**

- 鉴权、请求校验与按用户/IP 的限流能力
- 按 `assistant_id` / `graph_id` 的路由转发与主备故障回退
- 首包超时控制、SSE 管道式转发与统一错误响应格式
- 全链路审计日志记录与 `X-Request-Id` 请求追踪透传
- Token 使用量采集与按用户/模型维度统计汇总
- 全局监控中的服务器 GPU/CPU 资源采集与可视化展示
- 全局监控中的 AI 网关成功率、延时、趋势、Top 用户/模型与最近审计展示

<img width="1280" height="745" alt="image" src="https://github.com/user-attachments/assets/d0290d9e-2123-426f-8189-e8ad4a2a5b8b" />

---

### 权限管理

- 实现了用户**登录、登出**和基于 Session 的身份校验
- 实现了按角色（算法/工程、产品/测试/管理、运维、管理员）进行**页面与能力权限**控制

<img width="1280" height="781" alt="20260331-203811" src="https://github.com/user-attachments/assets/039316dd-1593-479f-b7a8-3a89f0d0cc94" />

<img width="1280" height="781" alt="image" src="https://github.com/user-attachments/assets/c86105ac-f96c-4522-899f-c3312a64b749" />

---

### 移动端适配

移动端同样可以使用智能体平台，各功能点待开放外网端口后进行完整测试。

![移动端适配界面](https://github.com/user-attachments/assets/ba230d8f-d695-4217-a915-b3e0f704893b)

---

### RAG 集成

现有的 RAG 是参考 RAGFlow 进行的二开，能较为丝滑地外接 Agent 框架，**集成成本主要为配置 + 少量胶水代码**，数据仍只在 RAG 代码库和对应持久化数据库中维护。

![RAG 集成架构](https://github.com/user-attachments/assets/45a3eb11-4fd7-4c75-a070-45113e73ba7c)

#### RAG 整体流程

**离线（上游）入库链路：**

上传文档 → MySQL / MinIO 记录状态与文件 → Worker（ML 模型）解析文档 → Embedding 模型对 chunk 计算向量 → 写入 Elasticsearch

**在线（下游）检索链路：**

Embedding 计算「当前问题」向量 → ES 混合检索 → 可选 Rerank 重排 → 片段注入 Prompt → Chat 模型生成答案

> **说明：** 分词、全文 match、向量近邻与加权融合在 ES + `rag/nlp` 内完成；MySQL 管理租户、Dialog、文档状态。

#### 入库后端

deepdoc 解析链上的若干小模型负责将 PDF / 扫描件转化为**可切分的文本与版面结构**（字块、区域类型、表格网格）。在多栏、跨页场景下块间顺序未定时，由 XGBoost 小模型进行**阅读顺序判断与文本拼接**，得到适合进一步切分的连续正文。随后解析器按策略切 chunk，最终由 **Qwen3-Embedding** 对每个 chunk 向量化并写入 Elasticsearch。

![入库流程图](https://github.com/user-attachments/assets/745c11ba-5037-42ce-b1d5-59dc629eb325)

---

## 项目视频展示

- [视频 1](https://drive.google.com/file/d/1E4xfGbtw32taibn3dDk4mtcMHyfsR0a6/view?usp=sharing)
- [视频 2](https://drive.google.com/file/d/10-8CdSe5chyWFGKnJO7A-wFiWzsf49eB/view?usp=drive_link)
