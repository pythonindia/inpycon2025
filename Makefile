.PHONY: prod dev dev-server

SCHEDULE_MANIFEST=src/_data/schedule.json
PRETALX_SCHEDULE=https://cfp.in.pycon.org/2025/schedule/export/schedule.json

${SCHEDULE_MANIFEST}: clean-schedule-info
	curl -o ${SCHEDULE_MANIFEST} ${PRETALX_SCHEDULE}

schedule-info: ${SCHEDULE_MANIFEST}
	@echo "Schedule information is up to date."

clean-schedule-info:
	rm -rf ${SCHEDULE_MANIFEST}

deploy-dev-server: schedule-info
	ELEVENTY_ENV=dev npx @11ty/eleventy --serve
	@echo ELEVENTY_ENV=dev npx @11ty/eleventy --serve --pathprefix='/'

deploy-dev: schedule-info
	ELEVENTY_ENV=dev npx @11ty/eleventy

deploy: schedule-info
	npx @11ty/eleventy
