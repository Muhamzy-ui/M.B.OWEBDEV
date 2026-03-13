#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Create the schema if it doesn't exist
# We use a robust python script that handles postgres:// vs postgresql://
python -c "
import os, psycopg2
db_url = os.environ.get('DATABASE_URL')
if db_url:
    # psycopg2 needs postgresql:// instead of postgres://
    if db_url.startswith('postgres://'):
        db_url = db_url.replace('postgres://', 'postgresql://', 1)
    
    print('BUILD_LOG: Connecting to DB to ensure schema...')
    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        with conn.cursor() as cursor:
            cursor.execute('CREATE SCHEMA IF NOT EXISTS mbo_portfolio;')
            print('BUILD_LOG: Schema mbo_portfolio is ready.')
        conn.close()
    except Exception as e:
        print(f'BUILD_LOG: ERROR creating schema: {e}')
        # We don't exit here so the migrate command can show a better error if it's a permission issue
"

# Run migrations to ensure database tables exist
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --no-input
