#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Create the schema if it doesn't exist (using python to avoid needing psql client)
python -c "
import os
import dj_database_url
import psycopg2
from urllib.parse import urlparse

db_url = os.environ.get('DATABASE_URL')
if db_url:
    print('DEBUG: Ensuring mbo_portfolio schema exists...')
    conn = psycopg2.connect(db_url)
    conn.autocommit = True
    with conn.cursor() as cursor:
        cursor.execute('CREATE SCHEMA IF NOT EXISTS mbo_portfolio;')
    conn.close()
    print('DEBUG: Schema ready.')
"

# Run migrations to ensure database tables exist (exclusively in mbo_portfolio schema)
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --no-input
