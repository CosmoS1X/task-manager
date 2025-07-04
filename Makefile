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

migrate-dev:
	npm run migrate:dev

migration:
	npx tsx node_modules/.bin/knex migrate:make $(N)

start: build migrate
	npm run start

dev:
	npm run dev

session-key:
	node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

env-file:
	cp .env.example .env

.PHONY: test
