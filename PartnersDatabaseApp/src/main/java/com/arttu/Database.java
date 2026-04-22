package com.arttu;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {
    // Port 5433 was identified in your error logs
    private static final String URL;
    static {
        String envUrl = System.getenv("DB_URL");
        if (envUrl == null) {
            envUrl = "jdbc:postgresql://localhost:5433/partnersdatabaseupdated";
        } else if (envUrl.startsWith("postgres://")) {
            envUrl = envUrl.replace("postgres://", "jdbc:postgresql://");
        }
        URL = envUrl;
    }
    private static final String USER = System.getenv("DB_USER") != null ? System.getenv("DB_USER") : "postgres";
    private static final String PASSWORD = System.getenv("DB_PASSWORD") != null ? System.getenv("DB_PASSWORD") : "postgres";

    /**
     * Establishes a connection to the PostgreSQL database.
     * @return Connection object
     * @throws SQLException if the connection fails or driver is missing
     */
    public static Connection getConnection() throws SQLException {
        try {
            // Explicitly load the PostgreSQL driver
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("PostgreSQL JDBC Driver not found. Ensure the JAR is in your Libraries.", e);
        }

        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}

