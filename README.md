# Chat App
A chat app build from scatch and utilize with Node.js, Graphql, MongoDB and Redis.

You can also run it with Docker! 

Use jest to implement unit test for this project.

## Preview

### Project Architecture
# <p><img width="700px" src="https://imgur.com/o69GHxY.png?1" alt="Chat App Architecture"></a></p>

# <p><img width="500px" src="http://g.recordit.co/D7SkOEouhn.gif" alt="Chat App GraphQL screen recording"></a></p>

## Features
:white_check_mark: Able to One to One send messages

:white_check_mark: Able to get JWT Token & Check authorization

:white_check_mark: Support Dockerfile & Docker Compose

:white_check_mark: Support Unit Test

:white_check_mark: Full Typescript type checked

## Setup

### For local development
You can use volta to intall correct Node.js version. [install Volta](http://volta.sh)

```sh
# install Volta
curl https://get.volta.sh | bash

# install Node
volta install node
```

Then, clone this repository
```sh
git clone https://github.com/AmberYen/ChattingApp.git
cd ChattingApp

```

Edit docker-compose.yml first, mark server section
```sh
# Docker Compose for Chatting app
version: '3.7'
services:
  mongo:
    image: "mongo:3.6"
    ports:
      - "27017:27017"
    volumes:
      - mongodata:/data/db
  redis:
    image: "redis:alpine"
    ports:
      - "6379:6379"
  # server:
  #   build: .
  #   image: chatting-app
  #   environment:
  #     DB_URL: "mongodb://mongo:27017/chatting-app"
  #     JWT_AUTH_SALT: amberyan
  #     REDIS_DOMAIN_NAME: redis      
  #   ports:
  #     - "3000:3000"
  #   depends_on:
  #     - mongo
  #     - redis

# Storage Volumes (non-volatile)
volumes:
  mongodata:
    driver: local
```
Run MongoDB and Redis with docker compose
```sh
docker-compose up
```

Next, go to server folder and install the project dependencies
```sh
cd server
yarn
```

Build the project for the first time

```sh
yarn build
```

Change .env.example file to .env
```sh
mv .env.example .env
vim .env // you can change salt or anything in the .env
```

Insert some seed data
```sh
node dist/seeds/seedUsers.js
```

And finally, start the project

```sh
yarn dev
```

After server build process completed, you should see `GraphQL API` running on http://localhost:3000/graphql

## For docker version
After you modify anything in the server folder, you can build it in the docker image and run it with docker compose.

Unmark docker-compose.yml
```sh
# Docker Compose for Chatting app
version: '3.7'
services:
  mongo:
    image: "mongo:3.6"
    ports:
      - "27017:27017"
    volumes:
      - mongodata:/data/db
  redis:
    image: "redis:alpine"
    ports:
      - "6379:6379"
  server:
    build: .
    image: chatting-app
    environment:
      DB_URL: "mongodb://mongo:27017/chatting-app"
      JWT_AUTH_SALT: amberyan
      REDIS_DOMAIN_NAME: redis      
    ports:
      - "3000:3000"
    depends_on:
      - mongo
      - redis

# Storage Volumes (non-volatile)
volumes:
  mongodata:
    driver: local
```

Build image
```sh
docker-compose build
```

Run server with docker command
```sh
docker-compose up
```

After docker run process completed, you should see `GraphQL API` running on http://localhost:3000/graphql

## Run test
You can run unit test for this project
```sh
cd server
yarn test
```

## To be continued
- [ ] Build Frontend page for real chatting 
- [ ] Build Session service
- [ ] Build Graphql API gateway (connect to session service and multiple users with different gateway)
- [ ] Implement Send/Delivered/Read status
- [ ] Implement user online status
- [ ] Cache user online status via Apollo CacheControl

## Legal

&copy; 2022 Amber Yen, all rights reserved.
