"""
M.B.O WebDev — Django Settings
Replace your entire settings.py with this file.
"""

from pathlib import Path
import os
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# ─── Read .env manually (no extra library needed) ─────────────────────────────
# We parse the .env file ourselves so you don't need python-decouple if it fails
def get_env(key, default=None):
    """Read a value from .env file or environment variables."""
    env_file = BASE_DIR / ".env"
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    if k.strip() == key:
                        return v.strip()
    return os.environ.get(key, default)


# ─── Core ─────────────────────────────────────────────────────────────────────
SECRET_KEY = get_env(
    "SECRET_KEY",
    "django-insecure-mbo-webdev-default-change-in-production-2025"
)

DEBUG = get_env("DEBUG", "True") == "True"

ALLOWED_HOSTS = get_env("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
render_host = os.environ.get("RENDER_EXTERNAL_HOSTNAME")
if render_host:
    ALLOWED_HOSTS.append(render_host)


# ─── Apps ─────────────────────────────────────────────────────────────────────
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "corsheaders",
    # Our apps — using dotted path because they live inside apps/
    "apps.contact",
    "apps.meetings",
    "apps.blog",
]


# ─── Middleware ───────────────────────────────────────────────────────────────
# CorsMiddleware MUST be first
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "mbo_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "mbo_backend.wsgi.application"


# ─── Database ─────────────────────────────────────────────────────────────────
# Defaults to SQLite so you can run instantly without PostgreSQL
# Change USE_POSTGRES=True in .env when you're ready for PostgreSQL

# Database URL provided by Render: postgresql://apex_db_f0dm_user:gbIVKITYQY694qvYwSOSeMruvhLrRroK@dpg-d6gsd2pr0fns739h58k0-a.virginia-postgres.render.com/apex_db_f0dm
USE_POSTGRES = get_env("USE_POSTGRES", "False") == "True"
DATABASE_URL = get_env("DATABASE_URL", "postgresql://apex_db_f0dm_user:gbIVKITYQY694qvYwSOSeMruvhLrRroK@dpg-d6gsd2pr0fns739h58k0-a.virginia-postgres.render.com/apex_db_f0dm")

if USE_POSTGRES:
    DATABASES = {
        "default": dj_database_url.parse(DATABASE_URL)
    }
    DATABASES["default"]["OPTIONS"] = {
        "options": "-c search_path=mbo_portfolio,public"
    }
else:
    # SQLite — works out of the box, no setup needed
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


# ─── Password Validation ──────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# ─── Internationalisation ─────────────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE     = "Africa/Lagos"
USE_I18N      = True
USE_TZ        = True


# ─── Static / Media ───────────────────────────────────────────────────────────
STATIC_URL  = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL   = "/media/"
MEDIA_ROOT  = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ─── Django REST Framework ────────────────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "30/hour",
    },
}


# ─── CORS ─────────────────────────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = [
    get_env("FRONTEND_URL", "http://localhost:5173"),
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOW_CREDENTIALS = True


# ─── Email ────────────────────────────────────────────────────────────────────
# For development, emails print to console (you'll see them in the terminal)
# For production, switch to smtp and add Gmail credentials in .env

EMAIL_BACKEND       = "django.core.mail.backends.console.EmailBackend"
CONTACT_EMAIL       = get_env("CONTACT_EMAIL", "mahmudolasunkami895@gmail.com")

# Uncomment these when you have a Gmail App Password:
# EMAIL_BACKEND       = "django.core.mail.backends.smtp.EmailBackend"
# EMAIL_HOST          = "smtp.gmail.com"
# EMAIL_PORT          = 587
# EMAIL_USE_TLS       = True
# EMAIL_HOST_USER     = get_env("EMAIL_HOST_USER", "")
# EMAIL_HOST_PASSWORD = get_env("EMAIL_HOST_PASSWORD", "")
# DEFAULT_FROM_EMAIL  = EMAIL_HOST_USER