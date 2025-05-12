install:
	npm install

type-check:
	npm run type-check

test:
	npm run test

test-coverage:
	npm run test -- --coverage

lint:
	npm run lint

check: type-check test lint
	@echo "All checks passed!"

build:
	npm run build

migrate:
	npm run migrate

start: build migrate
	npm run start

dev:
	npm run dev

.PHONY: test
