FROM node:16-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Serve the build files
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
EXPOSE 3000
