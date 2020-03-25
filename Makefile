# Docker build project
d-build-project:
	docker-compose build

# Docker up project
d-up-project:
	docker-compose up -d

# Docker up project with Filebeat sending data to external ELK project
d-up-project-elk:
	docker-compose -f docker-compose.yml -f docker-compose.elk.yml up -d

# Docker down project
d-down-project:
	docker-compose down

# Docker build simulator integration test
d-build-sim-integration-test:
	docker build -t minitwit-simulator-integration-test -f tests/simulator-integration-test/Dockerfile ./tests/simulator-integration-test

# Docker build minified simulator test
d-build-min-sim-test:
	docker build -t minitwit-simulator ./tests/simulator -f ./tests/simulator/Dockerfile

# Run integration test
run-sim-integration-test:
	$(MAKE) d-build-project
	$(MAKE) d-build-sim-integration-test
	$(MAKE) d-up-project
	docker run --network=minitwit-network minitwit-simulator-integration-test
	$(MAKE) d-down-project

# Run minified simulator test
run-min-sim-test:
	$(MAKE) d-build-project
	$(MAKE) d-build-min-sim-test
	$(MAKE) d-up-project
	docker run --network=minitwit-network minitwit-simulator
	$(MAKE) d-down-project

run-flag-tool:
	$(MAKE) d-build-project
	$(MAKE) d-up-project
	docker build -t minitwit-flagtool -f ./backend/Dockerfile-flagtool ./backend
	docker run --network=minitwit-network minitwit-flagtool $(ARGS)
