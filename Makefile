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

clean:
	npm run clean

build: clean
	npm run build

migrate:
	npm run migrate

migration-generate:
	npm run migration:generate server/migrations/$(N)

migration-create:
	npm run migration:create server/migrations/$(N)

start: build migrate
	npm start

dev:
	npm run dev

session-key:
	node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

env-file:
	cp .env.example .env

.PHONY: test
