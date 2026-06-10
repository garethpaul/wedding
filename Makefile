NODE ?= node
NPM ?= npm
ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))

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

verify: lint test build

check: verify
