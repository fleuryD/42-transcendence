
all : up


up :
	@docker compose -f ./docker-compose.yml up --build

up2 :
	@docker compose -f ./docker-compose.yml up

down :
	@docker compose -f ./docker-compose.yml down

stop :
	@docker compose -f ./docker-compose.yml stop

start :
	@docker compose -f ./docker-compose.yml start

status :
	@docker ps

clear : down stop
	docker system prune -f

re : clear up




ps:
	@ echo "\n\n$(C_CYA)make ps :$(C_NOR)\n\n"

	@ echo "$(C_YEL)docker images ps :$(C_NOR)"
	@ docker images ps

	@ echo "$(C_YEL)docker container ps :$(C_NOR)"
	@ docker container ps

	@ echo "$(C_YEL)docker volume ls :$(C_NOR)"
	@ docker volume ls

	@ echo ""




clean:
	clear
	@ echo "\n\n$(C_CYA)make clean :$(C_NOR)\n\n"

	@ echo "$(C_YEL)docker-compose -f docker-compose.yml down -v :$(C_NOR)"
	@ docker-compose -f docker-compose.yml down -v

	@ echo "$(C_YEL)docker volume prune -f :$(C_NOR)"
	@ docker volume prune -f

	@ echo "$(C_YEL)docker system prune -a -f :$(C_NOR)"
	@ docker system prune -a -f

	@ echo ""

	@make ps