FROM node:22-alpine

WORKDIR /app

# Copia os arquivos de dependências primeiro (melhora cache)
COPY package.json package-lock.json ./
RUN npm i

# Copia o código fonte (será sobrescrito pelo volume no compose)
COPY . .

EXPOSE 5001
ENV HOST=0.0.0.0

CMD ["npm", "run", "dev"]