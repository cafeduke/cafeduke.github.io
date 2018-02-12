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

## Install virtual environment packages

Use administration console. (Super user)

```shell
# Locate pip at <Anaconda Install Home>/Scripts/pip
> pip install virutalenv
> pip install virtualenvwrapper
```

For Windows check [here](https://virtualenvwrapper.readthedocs.io/en/latest/install.html)

## Create Virtual Environment

Use user console.

```shell
# Create project base directory
> mkdir RJ
> cd RJ

# Create Virutal environment
> mkvirtualenv RJ

# Note the prompt automatically using the virutal environment.
(RJ) D:\RJ>

```

## Enter and exit virtual environment

```shell
# Enter virutal environment
D:\RJ> workon RJ
(RJ) D:\RJ> 

# Confirm right pip
(RJ) D:\RJ> which pip
D:\RJ\Scripts\pip.exe

# Exit virtual environment
(RJ) D:\RJ> deactivate
D:\RJ>
```

## Install Django

```shell
# pip install django==[version]
(RJ) D:\RJ\src> pip install django==2.0.1
```

## Setup Django configuration

```shell
# Create src
(RJ) D:\RJ\src> mkdir src
(RJ) D:\RJ\src> cd src

# Create configuration-root directory 'config'
(RJ) D:\RJ\src> django-admin startproject config .

# Note the creation of 'config' directory and 'manage.py'
(RJ) D:\RJ\src> ls 
manage.py  config

# Create settings under config
(RJ) D:\RJ\src> cd config
(RJ) D:\RJ\src\config> mkdir settings
(RJ) D:\RJ\src\config> mv settings.py settings/base.py

# Correct BASE_DIR in config/settings/base.py as follows. 
# We moved one level deeper in folder structure.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Create __init__.py to use the appropriate settings
# Import appropriate settings. Local overrides production overrides base.
(RJ) D:\RJ\src\config> cd settings
(RJ) D:\RJ\src\config\settings> cat > __init__.py
from .base import *

try:
   from .production import *
except:
   pass

try:
   from .local import *
except:
   pass
```

# Setup Django DB and admin

## Database

```
(RJ) D:\RJ\src> python manage.py migrate
```

## Create a super user login

```
(RJ) D:\RJ\src> python manage.py createsuperuser
```

## Start Server

```
(RJ) D:\RJ\src> python manage.py runserver
```

# Install utility packages

```
(RJ) D:\RJ\src> pip install psycopg2 gunicorn dj-database-url django-crispy-forms pillow
```

# Create requirements file

```
(RJ) D:\RJ\src> pip freeze
dj-database-url==0.4.2
Django==1.11.9
django-crispy-forms==1.7.0
gunicorn==19.7.1
Pillow==5.0.0
psycopg2==2.7.3.2
pytz==2017.3

(RJ) D:\RJ\src> pip freeze > requirements.txt
```

