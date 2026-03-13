#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Run migrations to ensure database tables exist
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --no-input
