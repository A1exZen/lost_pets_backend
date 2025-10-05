FROM node:20-alpine

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости (включая devDependencies для сборки)
RUN npm ci

# Копируем остальные файлы
COPY . .

# Запускаем сборку TypeScript
RUN npm run build

# Устанавливаем только production зависимости для уменьшения размера образа
RUN npm ci --only=production && npm cache clean --force

EXPOSE 3000

# Запускаем скомпилированное приложение
CMD ["node", "dist/server.js"]