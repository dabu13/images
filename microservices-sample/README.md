Sample Microservices App for AKS

This repository contains a minimal microservices sample with:
- `api` : Node/Express middleware service storing data in PostgreSQL
- `ui`  : Static web UI served by Nginx
- Kubernetes manifests for running on AKS (demo)
- GitHub Actions workflow to build Docker images and push to Azure Container Registry (ACR)

Required GitHub secrets before using the workflow:
- `AZURE_CREDENTIALS` (optional for azure/login)
- `ACR_REGISTRY` (e.g. myregistry.azurecr.io)
- `ACR_USERNAME` and `ACR_PASSWORD` (or use `AZURE_CREDENTIALS`/az acr login)

Quick steps:
1. Edit k8s manifests if you want a managed Postgres instead of the included Deployment.
2. Create necessary GitHub secrets.
3. Push to GitHub — workflow builds `api` and `ui` images and pushes to ACR.
4. Deploy `microservices-sample/k8s` manifests to AKS.
