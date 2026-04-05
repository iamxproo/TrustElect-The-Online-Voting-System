# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies first (layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -q

# ─── Stage 2: Run ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built JAR
COPY --from=build /app/target/trustelect-backend-1.0.0.jar app.jar

# Create uploads directory for candidate images
RUN mkdir -p uploads/candidates

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
