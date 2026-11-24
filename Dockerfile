# 前端镜像：构建产物 dist + 与后端同源的 nginx 路由（相对路径调用，正好同源分发）
# 放在 Frank-Frontend 仓库根目录，改名为 Dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.web.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
