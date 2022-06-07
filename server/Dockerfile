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
COPY ["./package*.json", "./yarn.lock", "./"]

RUN yarn install --ignore-scripts

# copy all files
COPY . .

# check files list
RUN ls -a

RUN yarn build


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
ENV PORT=4000

WORKDIR $APP_DIR


## Install production dependencies first for cache

COPY [ "./package*.json", "./" ]

COPY --from=build $APP_DIR/dist ./build
COPY .env .

EXPOSE $PORT

CMD [ "yarn", "start" ]