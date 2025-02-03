.PHONY: install dev build start clean

# Install dependencies
install:
	npm install

# Run development server
dev:
	npm run dev

# Build for production
build:
	npm run build

# Start production server
start:
	npm run start

# Clean build artifacts and dependencies
clean:
	rm -rf node_modules
	rm -rf .next
	rm -f package-lock.json

# Type checking
type-check:
	npm run type-check

# Lint code
lint:
	npm run lint

# Install and start development server
setup: install dev

buildAWS:
	docker build --platform linux/amd64 -t restaurant-frontend .
	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 170399736289.dkr.ecr.us-east-1.amazonaws.com
	docker tag restaurant-frontend:latest 170399736289.dkr.ecr.us-east-1.amazonaws.com/restaurant-frontend:latest
	docker push 170399736289.dkr.ecr.us-east-1.amazonaws.com/restaurant-frontend:latest