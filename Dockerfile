FROM node:12-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:12-alpine AS production
WORKDIR /app
COPY --from=build ./app/dist ./dist
COPY package*.json ./
RUN npm install --production
CMD npm start
ENV PORT=80
EXPOSE 80