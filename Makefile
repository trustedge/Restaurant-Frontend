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
