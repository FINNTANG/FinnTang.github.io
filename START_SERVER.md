# 🚀 如何启动本地服务器预览网站

YouTube视频嵌入需要通过HTTP服务器运行，不能直接打开HTML文件（file://协议不支持）。

## 方法1：使用VSCode Live Server（最简单）⭐

如果你在用VSCode/Cursor编辑器：

1. 安装扩展：**Live Server** by Ritwick Dey
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"
4. 浏览器会自动打开 `http://localhost:5500`
5. ✅ YouTube视频可以正常播放了！

---

## 方法2：使用Python（如果已安装Python）

在项目文件夹打开终端，运行：

### Python 3.x:
```bash
python -m http.server 8000
```

### Python 2.x:
```bash
python -m SimpleHTTPServer 8000
```

然后访问：`http://localhost:8000`

---

## 方法3：使用Node.js的http-server

如果安装了Node.js：

```bash
# 安装http-server（只需一次）
npm install -g http-server

# 在项目目录运行
http-server -p 8000
```

然后访问：`http://localhost:8000`

---

## 方法4：使用PHP（如果已安装PHP）

```bash
php -S localhost:8000
```

然后访问：`http://localhost:8000`

---

## ⚠️ 重要说明

- ❌ **不要**直接双击 `index.html` 打开（file://协议）
- ✅ **必须**通过上述任一方法启动HTTP服务器
- ✅ 通过 `http://localhost:端口号` 访问

这样YouTube视频就可以正常自动播放了！🎬

---

## 🌐 部署到线上

当你把网站部署到Vercel、Netlify、GitHub Pages等平台时，就是HTTP/HTTPS协议，YouTube视频会自动正常工作，不需要任何额外配置！

