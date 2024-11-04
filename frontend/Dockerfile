# Usa uma imagem Node para o build
FROM node:16 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Usa Nginx para servir os arquivos estáticos
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
