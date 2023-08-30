deploy:
	cd src && yarn && yarn build
	cd infrastructure && terraform init && terraform get && terraform apply -auto-approve