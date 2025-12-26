.PHONY: all build test coverage lint clean dev install

# Default target
all: install lint test build

# Install dependencies
install:
	npm install

# Build for production
build:
	npm run build

# Run development server
dev:
	npm run dev

# Run tests
test:
	npm test

# Run tests with coverage
coverage:
	npm test -- --coverage

# Run linter
lint:
	npx eslint app/ test/ --ext .js,.vue || true

# Clean build artifacts
clean:
	rm -rf dist/
	rm -rf coverage/
	rm -rf node_modules/.cache/

# Preview production build
preview:
	npm run preview

# Help target
help:
	@echo "Available targets:"
	@echo "  all      - Install, lint, test, and build"
	@echo "  install  - Install npm dependencies"
	@echo "  build    - Build for production"
	@echo "  dev      - Run development server"
	@echo "  test     - Run test suite"
	@echo "  coverage - Run tests with coverage report"
	@echo "  lint     - Run ESLint"
	@echo "  clean    - Remove build artifacts"
	@echo "  preview  - Preview production build"
	@echo "  help     - Show this help message"
