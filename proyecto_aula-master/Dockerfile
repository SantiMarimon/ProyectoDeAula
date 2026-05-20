# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
RUN apk add --no-cache curl && addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app
COPY --from=build /app/target/system-pqrs-0.0.1-SNAPSHOT.jar system-pqrs.jar
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "system-pqrs.jar"]
