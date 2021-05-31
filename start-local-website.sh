#!/bin/bash
docker container run --detach --name duke_site --publish 4000:4000 --volume $(pwd):/srv/jekyll jekyll/jekyll:builder jekyll serve
