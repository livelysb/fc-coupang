FROM openjdk:8-jre-alpine

WORKDIR /usr/app/

COPY build/libs/*.jar application.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Dspring.profiles.active=${PROFILE}", "-Ddb.user.name=${DB_USER_NAME}", "-Ddb.user.password=${DB_USER_PASSWORD}", "-jar", "application.jar"]