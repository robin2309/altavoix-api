FROM node:22

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Expose API port
EXPOSE 4000

# Start the app
CMD ["npm", "start"]
