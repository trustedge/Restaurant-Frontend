.PHONY: install dev build clean sst-dev sst-deploy sst-deploy-prod sst-remove sst-remove-prod ssm

include ../.env

# Install dependencies
install:
	npm install

# Run development server
dev:
	npm run dev

# Build for production
build:
	npm run build

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

# SST development
sst-dev:
	npm run sst:dev

# SST build
sst-build:
	npm run sst:build

# SST deploy (development)
sst-deploy:
	npm run sst:deploy

# SST deploy (production)
sst-deploy-prod:
	npm run sst:deploy:prod

# SST remove (development)
sst-remove:
	npm run sst:remove

# SST remove (production)
sst-remove-prod:
	npm run sst:remove:prod

# Setup SSM parameters
ssm:
	aws ssm put-parameter --name "$(PATH_PREFIX)/RESTAURANT_NAME" --value "Johnny's Dining" --type "String"
	aws ssm put-parameter --name "$(PATH_PREFIX)/RESTAURANT_DESCRIPTION" --value "Johnny's Dining offers classic American cuisine with the finest and freshest ingredients!" --type "String"
	aws ssm put-parameter --name "$(PATH_PREFIX)/RESTAURANT_ADDRESS" --value "123 Main Street" --type "String"
	aws ssm put-parameter --name "$(PATH_PREFIX)/RESTAURANT_HOURS" --value "11AM-10PM" --type "String"
	aws ssm put-parameter --name "$(PATH_PREFIX)/RESTAURANT_EMAIL" --value "info@johnnysdinning.com" --type "String"
	aws ssm put-parameter --name "$(PATH_PREFIX)/RESTAURANT_SUPPORT_PHONE" --value "+1234567890" --type "String"
	aws ssm put-parameter --name "$(PATH_PREFIX)/PHONE_AGENT_INSTRUCTION" --value file://../references/instructions.data --type "String"