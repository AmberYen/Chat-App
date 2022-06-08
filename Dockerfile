# ===========
# Global Args
# ===========
# This is automagically shared to yarn and npm
ARG APP_DIR=/usr/app

# ====================
# Stage 0: Development
# ====================
# Base Image: node:16-alpine
FROM node:12-alpine AS build

# -----------------
# Stage 0 Arguments
# -----------------
ARG APP_DIR

WORKDIR $APP_DIR

## Install devdependencies first for building time to cache
COPY ["./package*.json", "./yarn.lock", "./tsconfig.json", "./"]
COPY server $APP_DIR/server
COPY client $APP_DIR/client

RUN yarn install --ignore-scripts

# check files list
RUN ls -a

RUN yarn build-server


# ========================
# Stage 1: Run application
# ========================
# Base Image: node:16-alpine
FROM node:12-alpine 

# -----------------
# Stage 1 Arguments
# -----------------
ARG APP_DIR

# -----------------------------
# Stage 1 Environment Variables
# -----------------------------
ENV PORT=3000

WORKDIR $APP_DIR/server


## Install production dependencies first for cache
COPY --from=build $APP_DIR/node_modules ./node_modules
COPY [ "./server/package*.json", "./" ]
COPY [ "./schema.graphql", "../" ]

COPY --from=build $APP_DIR/server/dist ./dist

RUN ls -a

EXPOSE $PORT

CMD [ "yarn", "start" ]