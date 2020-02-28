#!/bin/bash

docker build -t corvimae/pokemon-manager-viewer:latest .
docker push corvimae/pokemon-manager-viewer:latest
kubectl rollout restart deployment pokemon-manager-viewer