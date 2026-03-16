# Use Node LTS
FROM node:20

# Working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project
COPY . .

# Build NestJS app
RUN npm run build

# Expose API port
EXPOSE 3000

# Start NestJS app
CMD ["npm", "run", "start:prod"]