# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json yarn.lock ./

# Instalar as dependências
RUN yarn install

# Copiar todo o código
COPY . .

# Gerar o cliente Prisma
RUN yarn prisma generate

# Compilar o código
RUN yarn build

# Etapa de produção
FROM node:20-alpine AS production

WORKDIR /app

# Copiar as dependências e o build da etapa de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Se necessário, ajuste o caminho para o diretório Prisma
COPY --from=builder /app/database/prisma ./prisma

# Expor a porta que será usada pela aplicação
EXPOSE 4000

# Comando para rodar a aplicação
CMD ["node", "dist/main"]
