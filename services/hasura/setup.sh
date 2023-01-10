apk update
apk upgrade
apk add curl
/bin/sh -c "$(curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh)" -y -f
timeout 1m /bin/sh -c "until hasura seed apply --database-name ${POSTGRES_DATABASE}; do sleep 10; done"
hasura metadata reload
