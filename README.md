# 🍜 GourmetLog — 个人美食打卡与记忆库

> **GourmetLog** 是一款专注于记录、定位与分享个人美食记忆的高奢风移动端优先 Web 应用。具备 Supabase 云端多端实时同步、GPS 坐标自动逆地理编码解析城市、照片高保真压缩上传云盘，以及极具仪式感的美食打卡体验。

---

## 🌐 线上部署与在线体验 (Live Demo)

- 🔗 **Cloudflare Pages / Workers 部署链接**：[https://my-food-web.js-2773612084.workers.dev](https://my-food-web.js-2773612084.workers.dev)
- 📦 **GitHub 源代码仓库**：[https://github.com/crazyzhang277/my-food-web](https://github.com/crazyzhang277/my-food-web)

---

## ✨ 核心特性

- 🔒 **Supabase 云端同步与账号体系**：全端登录同步，数据隐私隔离，支持邮箱/密码注册登录。
- 📍 **GPS 顺滑自动定位与城市解析**：内置 `navigator.geolocation` 结合 OpenStreetMap Nominatim 逆地理编码，一键精准解析当前城市与街道。
- 📸 **照片云盘存储**：上传美食图片自动进行前端轻量压缩，并快速持久化存储于 Supabase Storage (`food-images`)。
- 🎨 **法式暖米高奢视觉 (Gourmet Light Theme)**：摒弃沉闷暗黑，采用温暖舒缓的法式米白纸底（`#FAF6F0`）、琥珀暖火渐变与高透毛玻璃面板，极致唤醒食欲。
- 💫 **Framer Motion 物理拟真微动效**：弹性五星打分、流畅 Modal Drawer 抽屉、卡片 Hover/Tap 缩放与手势缩放反馈。
- 🔍 **多维检索与城市标签导航**：支持关键词全文搜索（餐厅、菜品、心得）以及城市横向滑动 Pill 导航。

---

## 🛠️ 技术栈

- **前端框架**：React 18 + Vite
- **后端与云服务**：[Supabase](https://supabase.com/) (Auth, PostgreSQL, Storage Bucket)
- **云端部署**：Cloudflare Workers / Pages (`https://my-food-web.js-2773612084.workers.dev`)
- **动效引擎**：Framer Motion
- **图标库**：Lucide Icons (`lucide-react`)
- **地理解析**：Browser Geolocation API + OpenStreetMap Reverse Geocoding
- **图片处理**：`browser-image-compression`

---

## 🗄️ 数据库 Schema 配置 (Supabase SQL)

在 Supabase Dashboard 的 SQL Editor 中运行以下建表语句：

```sql
-- 1. 创建用户 Profile 表
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text not null,
  avatar_url text,
  created_at timestamptz default now() not null
);

-- 2. 创建美食打卡记录表
create table public.food_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  restaurant_name text not null,
  city text not null,
  address text,
  latitude float8,
  longitude float8,
  rating smallint check (rating >= 1 and rating <= 5) not null default 5,
  price_per_person numeric(10, 2),
  recommended_dishes text[] default '{}'::text[],
  tags text[] default '{}'::text[],
  image_urls text[] not null default '{}'::text[],
  notes text,
  dining_date date default current_date not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. 开启 Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.food_logs enable row level security;

-- 4. RLS 安全策略与外键修复
alter table public.food_logs drop constraint if exists food_logs_user_id_fkey;
alter table public.food_logs add constraint food_logs_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
create policy "Allow profile insert" on public.profiles for insert with check (true);
create policy "Users can view own food logs" on public.food_logs for select using (auth.uid() = user_id);
create policy "Users can insert own food logs" on public.food_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own food logs" on public.food_logs for update using (auth.uid() = user_id);
create policy "Users can delete own food logs" on public.food_logs for delete using (auth.uid() = user_id);
```

---

## 🚀 本地开发与启动指南

### 1. 克隆项目与安装依赖
```bash
git clone https://github.com/crazyzhang277/my-food-web.git
cd my-food-web
npm install
```

### 2. 环境变量配置 (`.env.local`)
在项目根目录新建 `.env.local` 文件并填入你的 Supabase 配置：
```env
VITE_SUPABASE_URL=https://mqrkgtogkkdezicozoqv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcmtndG9na2tkZXppY296b3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MjA3MzUsImV4cCI6MjEwMjA5NjczNX0.B3C-nHWCjPZKTCB1eYzd6sj6DmEx8qbIJ_joyU7eZc8
```

### 3. 启动开发服务器
```bash
npm run dev
```
打开浏览器访问 `http://localhost:3000` 即可开始使用。

---

## ⚡ 部署到 Cloudflare

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，选择 **Workers & Pages** $\rightarrow$ **Create Application** $\rightarrow$ **Connect to Git**。
2. 选中仓库 `crazyzhang277/my-food-web`。
3. **Build Settings**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
4. 环境变量增加 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY`，点击 **Save and Deploy** 即可完成秒级部署。

---

## 🔮 路线图与后续迭代计划 (Roadmap)

- [ ] 🗺️ **交互式足迹地图大屏**：集成 Mapbox / 高德地图，以动态标记点展示所有打卡过的餐厅与城市地图轨迹。
- [ ] 📊 **个人年度食记与口味统计报告**：可视化展示最爱的菜系标签雷达图、人均消费趋势图与年度打卡频次分析。
- [ ] 👥 **私密圈子与美食共享**：支持生成精美食记海报卡片分享给好友，或创建家庭/情侣专属美食打卡圈。
- [ ] 🤖 **AI 智能菜品与卡路里识别**：拍摄美食照片，AI 自动识别菜品名称、风味特征与大致热量估算。
- [ ] 📱 **PWA 离线打卡缓存**：无网环境下先暂存离线打卡，连网后后台全自动静默同步至 Supabase 云端。

---

## 📄 开源许可证

[MIT License](LICENSE) © 2026 GourmetLog Team
