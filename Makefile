NODE ?= node
NPM ?= npm

.PHONY: lint test build verify check

lint:
	$(NODE) scripts/check_wedding_contracts.js

test:
	$(NODE) scripts/check_wedding_contracts.js
	@if [ -d app/node_modules ]; then \
		$(NPM) --prefix app test; \
	else \
		echo "Skipping npm test: app/node_modules is not installed."; \
	fi

build: lint

verify: lint test build

check: verify
