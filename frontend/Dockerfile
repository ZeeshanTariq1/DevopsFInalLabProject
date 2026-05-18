# Stage 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build environment variable for production API URL
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve with nginx (tiny, production-ready web server)
FROM nginx:alpine

# Copy built React files to nginx's web folder
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config for React Router (SPA) + API proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]