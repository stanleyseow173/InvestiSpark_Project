######## Build Angular ###############
FROM node:20 AS ng-builder

WORKDIR /src

COPY client/angular.json .
COPY client/package.json .
COPY client/package-lock.json .
COPY client/tsconfig.app.json .
COPY client/tsconfig.json .
COPY client/tsconfig.spec.json .
COPY client/src src

RUN npm i -g @angular/cli
RUN npm ci
RUN ng build

######## Build Spring Boot ###############
FROM maven:3-eclipse-temurin-20 AS sb-builder

WORKDIR /src

COPY server/mvnw .
COPY server/mvnw.cmd .
COPY server/pom.xml .
COPY server/src src

COPY --from=ng-builder /src/dist/client src/main/resources/static/

RUN mvn package -Dmaven.test.skip=true

######## Assemble Application ###############
FROM openjdk:20-slim

WORKDIR /app

COPY --from=sb-builder /src/target/miniProject-0.0.1-SNAPSHOT.jar investispark.jar

ENV PORT=8080

ENTRYPOINT SERVER_PORT=${PORT} java -jar investispark.jar