# International Love Show — 静态宣传站

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```
产物在 `dist/`，可托管于任何静态宿主。

## 部署注意

SPA 路由需要 Nginx fallback：

```nginx
location / {
    try_files $uri /index.html;
}
```

## 资源

- 轮播图源文件：`轮播图(1).psd`
- 提取脚本：`scripts/extract-psd.py`（依赖 `psd-tools`）
