---
title: Python and django project setup
categories: django
layout: post
---

{% include toc.html %}

# Core Django Project

## Install Python using Anaconda

- Download and install [Anaconda](https://www.anaconda.com/download/) 

- Add the following to PATH

  - `<AnacondaHome>` 
  - `<AnacondaHome>/Scripts`
  - `<AnacondaHome>/Library/bin`

  ```shell
  # Ensure the right python is in the path
  > which python
  C:/ProgramData/Anaconda/python.exe

  > python --version
  Python 3.6.2 :: Anaconda custom (64-bit)
  ```

## Install package 'virtualenv'

Use administration console. (Super user)

```shell
# Locate pip at <Anaconda Install Home>/Scripts/pip
> pip install virutalenv
```

## Create Virtual Environment

Use user console.

```shell
# Create project root
> mkdir TryDjango
> cd TryDjango

# Create Virutal environment
> virutalenv .

# Note that virtual environment has Scripts, Lib
> ls
Include             Lib                 Scripts             pip-selfcheck.json  tcl
```

## Activate Virtual Environment

```shell
# Execute activation binary
> Scripts\activate

# Note the new console
(TryDjango) D:\TryDjango> 

# Confirm that the python and pip are picked from virtual env
(TryDjango) D:\TryDjango>  which pip
D:\TryDjango\Scripts\pip.exe
```

## Install Django

```shell
# pip install django==[version]
(TryDjango) D:\TryDjango> pip install django==1.11.9
```

## Create a Django project

The "src" directory shall be the source home.

```shell
(TryDjango) D:\TryDjango> mkdir src
(TryDjango) D:\TryDjango> cd src
(TryDjango) D:\TryDjango\src> django-admin startproject <project-name> .

# Note the creation of project directory and manage.py
(TryDjango) D:\TryDjango\src> ls <project-name>
manage.py         <project-name>
```

# Setup Django DB and admin

## Database

```
(TryDjango) D:\TryDjango> python manage.py migrate
```

## Create a super user login

```
(TryDjango) D:\TryDjango> python manage.py createsuperuser
```

## Start Server

```
(TryDjango) D:\TryDjango> python manage.py runserver
```

# Setup local and production settings

```shell
(TryDjango) D:\TryDjango> cd src

# Create settings module inside <app-name>
(TryDjango) D:\TryDjango\src> mkdir <app-name>/settings

# Import appropriate settings. Local overrides production overrides base.
(TryDjango) D:\TryDjango\src> cat > <app-name>/settings/__init__.py
from .base import *
from .production import *

try:
   from .local import *
except:
   pass

# Move settings.py from <app-name> to <app-name>/settings
(TryDjango) D:\TryDjango\src> mv settings.py <app-name>/base.py

# Correct BASE_DIR in <app-name>/base.py as follows. 
# We moved one level deeper in folder structure.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Replicate base as production and local
(TryDjango) D:\TryDjango\src> cp <app-name>/base.py <app-name>/local.py
(TryDjango) D:\TryDjango\src> cp <app-name>/base.py <app-name>/production.py
```

# Install utility packages

```
(TryDjango) D:\TryDjango\src> pip install psycopg2 gunicorn dj-database-url django-crispy-forms pillow
```

# Create requirements file

```
(TryDjango) D:\TryDjango> pip freeze
dj-database-url==0.4.2
Django==1.11.9
django-crispy-forms==1.7.0
gunicorn==19.7.1
Pillow==5.0.0
psycopg2==2.7.3.2
pytz==2017.3

(TryDjango) D:\TryDjango> pip freeze > requirements.txt
```

