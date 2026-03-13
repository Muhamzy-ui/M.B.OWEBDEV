#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mbo_backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    # --- AUTO-CREATE SCHEMA FOR RENDER ---
    if "migrate" in sys.argv:
        db_url = os.environ.get("DATABASE_URL")
        if db_url:
            try:
                import psycopg2
                if db_url.startswith("postgres://"):
                    db_url = db_url.replace("postgres://", "postgresql://", 1)
                conn = psycopg2.connect(db_url)
                conn.autocommit = True
                with conn.cursor() as cursor:
                    cursor.execute("CREATE SCHEMA IF NOT EXISTS mbo_portfolio;")
                conn.close()
                print("DEBUG: Schema 'mbo_portfolio' checked/created via manage.py")
            except Exception as e:
                print(f"DEBUG: Schema creation failed: {e}")
    # -------------------------------------

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
