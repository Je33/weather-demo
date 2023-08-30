deploy:
	cd src && yarn && yarn build
	cd infrastructure && terraform get && terraform apply -auto-approve