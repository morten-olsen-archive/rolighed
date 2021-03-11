FROM node:15-alpine as builder
WORKDIR /workspace
COPY .npmrc ./package.json /workspace/
RUN yarn install
COPY . /workspace
RUN yarn bundle

FROM node:15-alpine
COPY --from=builder /workspace/app/index.js /app/bundle.js
RUN ls -al /app
CMD ["node", "/app/bundle.js"]
