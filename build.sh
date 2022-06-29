if [ -f .env ]; then
    export $(cat .env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}' )
fi

wails build -ldflags "-X main.clientId=${CLIENT_ID} -X github.com/degabut/degabut-client/app.version=${VERSION} -X github.com/degabut/degabut-client/app.metaUrl=${META_URL} -X github.com/degabut/degabut-client/app.binaryUrl=${BINARY_URL}"
