# GourmetLog

个人美食打卡与记忆库，使用 React + Vite，Supabase 提供 Auth、PostgreSQL 和 Storage。

## 本地运行

```bash
npm install
```

复制 `.env.example` 为 `.env.local`，填入 Supabase 项目配置：

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

然后运行：

```bash
npm run dev
```

打开 `http://localhost:3000`。

首次使用前，在 Supabase Dashboard 的 SQL Editor 中执行 [`supabase/schema.sql`](supabase/schema.sql)。

## 部署到 GitHub Pages

项目已包含 `.github/workflows/deploy-pages.yml`，会在 `main` 分支有新提交时自动构建和发布。

1. 推送代码到 GitHub 仓库的 `main` 分支。
2. 打开仓库 **Settings → Secrets and variables → Actions**。
3. 新增两个 Repository secrets：
   - `VITE_SUPABASE_URL`：Supabase 项目 URL。
   - `VITE_SUPABASE_ANON_KEY`：Supabase 的 publishable/anon key。
4. 打开 **Settings → Pages**，将 **Build and deployment → Source** 设置为 **GitHub Actions**。
5. 在 **Actions** 页面等待 `Deploy to GitHub Pages` 完成。

默认地址为：

`https://crazyzhang277.github.io/my-food-web/`

如果仓库名称或 GitHub 用户名不同，请将地址中的对应部分替换掉。

## Supabase 配置

在 Supabase Dashboard 的 **Authentication → URL Configuration** 中设置：

- **Site URL**：`https://crazyzhang277.github.io/my-food-web/`
- **Redirect URLs**：`https://crazyzhang277.github.io/my-food-web/**`

本项目使用邮箱/密码登录。若打开了邮箱确认功能，确认邮件跳转也应使用上面的 Pages 地址。

## 安全注意事项

前端可以使用 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`，数据库安全依赖 RLS 策略。

`service_role` key 具有管理员权限，绝不能放入前端、构建产物或提交到 GitHub。

## GitHub Actions 说明

Vite 在 GitHub Actions 构建时会使用 `/my-food-web/` 作为资源前缀，因此仓库 Pages 地址下的 JS、CSS 和图片可以正常加载；本地开发仍使用根路径 `/`。
