#! /bin/bash
set -e
cat /initdb/000-init.sql | psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB"
