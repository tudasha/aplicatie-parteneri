# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the JAR from the build stage
# The JAR name is based on your artifactId and version in pom.xml
COPY --from=build /app/target/oop-project-darialuana-0.0.1-SNAPSHOT.jar app.jar

# Expose the port (Render will override this via the PORT environment variable)
EXPOSE 8081

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
