all: 

dev:
	docker-compose up -d 
	npx prisma db push
	ts-node prisma/seed
	pnpm run dev

db-down: 
	docker-compose down

restart:
	make db-down 
	make dev
