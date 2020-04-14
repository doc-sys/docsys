# Stage-0
FROM node:stretch

WORKDIR /usr/src/app

RUN git clone https://github.com/doc-sys/docsys.git .
RUN npm install


# Stage-final
FROM node:stretch-slim

WORKDIR /usr/src/app

COPY --from=0 /usr/src/app/node_modules ./node_modules
COPY --from=0 /usr/src/app/src ./src
COPY --from=0 /usr/src/app/lib ./lib

CMD ["node", "./lib"]