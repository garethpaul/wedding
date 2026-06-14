NODE ?= node
NPM ?= npm
override ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))

.PHONY: lint test build verify check

lint:
	$(NODE) "$(ROOT)/scripts/check_wedding_contracts.js"

test:
	$(NODE) "$(ROOT)/scripts/check_wedding_contracts.js"
	@if [ -d "$(ROOT)/app/node_modules" ]; then \
		$(NPM) --prefix "$(ROOT)/app" test; \
	else \
		echo "Skipping npm test: app/node_modules is not installed."; \
	fi

build: lint
	@if [ -d "$(ROOT)/app/node_modules" ]; then \
		$(NPM) --prefix "$(ROOT)/app" run build; \
	else \
		echo "Skipping CSS build: app/node_modules is not installed."; \
	fi

verify: lint test build

check: verify
