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
	docker build --platform linux/amd64 --debug --progress=plain -t restaurant-frontend:latest .
	aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 170399736289.dkr.ecr.us-east-1.amazonaws.com
	docker tag restaurant-frontend:latest 170399736289.dkr.ecr.us-east-1.amazonaws.com/restaurant-frontend:latest
	docker push 170399736289.dkr.ecr.us-east-1.amazonaws.com/restaurant-frontend:latest

# docker-run:
# 	docker run -p 3000:3000 restaurant-frontend
docker-build:
	docker build --debug --progress=plain -t restaurant-frontend .

docker-run2:
	docker run -p 3000:3000 \
	-e PATH_PREFIX=/sushi-dynasty \
	-e DYNAMODB_ORDER_TABLE_NAME=development-Sushi-Dynasty-orderTable \
	restaurant-frontend

docker-run:
	docker run -p 3000:3000 \
	-e NEXT_PUBLIC_DEV_MODE=false \
	-e AWS_ACCESS_KEY_ID=AKIASPLE5UHQ2HDRTQ5L \
	-e AWS_SECRET_ACCESS_KEY=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 \
	-e AWS_REGION=us-east-1 \
	-e PATH_PREFIX=/sushi-dynasty \
	-e DYNAMODB_ORDER_TABLE_NAME=development-Sushi-Dynasty-orderTable \
	restaurant-frontend