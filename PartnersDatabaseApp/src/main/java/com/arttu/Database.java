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
        } else if (envUrl.startsWith("postgres://") || envUrl.startsWith("postgresql://")) {
            // Render gives us: postgres://user:pass@host/db or postgresql://...
            // JDBC needs: jdbc:postgresql://host/db
            // We strip the username and password from the URL because DriverManager uses the USER and PASSWORD variables
            try {
                java.net.URI uri = new java.net.URI(envUrl);
                envUrl = "jdbc:postgresql://" + uri.getHost() + ":" + (uri.getPort() != -1 ? uri.getPort() : 5432) + uri.getPath() + (uri.getQuery() != null ? "?" + uri.getQuery() : "");
            } catch (Exception e) {
                // Fallback basic replacement if URI parsing fails
                envUrl = envUrl.replaceFirst("postgres(?:ql)?://", "jdbc:postgresql://");
                // Remove the user:pass@ part manually
                envUrl = envUrl.replaceAll("//.*@", "//");
            }
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
            Class.forName("org.postgresql.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("PostgreSQL JDBC Driver not found. Ensure the JAR is in your Libraries.", e);
        }

        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    public static void initializeDatabase() {
        try (Connection conn = getConnection();
             java.sql.Statement stmt = conn.createStatement()) {
            
            // Litereally executing exactly what schema.sql contains to ensure the DB is initialized
            String schemaSql = 
                "CREATE TABLE IF NOT EXISTS companii (" +
                "    companie_id SERIAL PRIMARY KEY," +
                "    nume VARCHAR(255) NOT NULL," +
                "    domeniu VARCHAR(255)," +
                "    website VARCHAR(255)," +
                "    is_confirmed BOOLEAN DEFAULT FALSE" +
                ");" +
                "CREATE TABLE IF NOT EXISTS pachete_sponsorizare (" +
                "    companie_id INT REFERENCES companii(companie_id) ON DELETE CASCADE," +
                "    pachet_nume VARCHAR(255)," +
                "    valoare_totala_estimata_eur NUMERIC(15, 2)," +
                "    sezon VARCHAR(50)" +
                ");" +
                "CREATE TABLE IF NOT EXISTS users (" +
                "    username VARCHAR(100) PRIMARY KEY," +
                "    password_hash VARCHAR(255) NOT NULL," +
                "    full_name VARCHAR(255)," +
                "    position VARCHAR(100)," +
                "    department VARCHAR(100)," +
                "    email VARCHAR(255) UNIQUE" +
                ");" +
                "CREATE TABLE IF NOT EXISTS company_assignments (" +
                "    assignment_id SERIAL PRIMARY KEY," +
                "    companie_id INT REFERENCES companii(companie_id) ON DELETE CASCADE," +
                "    username VARCHAR(100) REFERENCES users(username) ON DELETE SET NULL," +
                "    assigned_date TIMESTAMP DEFAULT NOW()," +
                "    UNIQUE(companie_id)" +
                ");" +
                "CREATE TABLE IF NOT EXISTS company_notes (" +
                "    note_id SERIAL PRIMARY KEY," +
                "    companie_id INT REFERENCES companii(companie_id) ON DELETE CASCADE," +
                "    author_username VARCHAR(100) REFERENCES users(username) ON DELETE SET NULL," +
                "    note_text TEXT," +
                "    email_model TEXT," +
                "    phone_script TEXT," +
                "    satisfaction_rating INT CHECK (satisfaction_rating BETWEEN 1 AND 10)," +
                "    sezon VARCHAR(50)," +
                "    created_at TIMESTAMP DEFAULT NOW()" +
                ");" +
                "INSERT INTO users (username, password_hash, full_name, position, department, email) " +
                "VALUES ('admin', 'admin', 'Administrator', 'Team Leader', 'Management', 'admin@arttu.ro') " +
                "ON CONFLICT (username) DO NOTHING;";

            stmt.execute(schemaSql);
            System.out.println("Database schema verified and initialized!");
        } catch (SQLException e) {
            System.err.println("Failed to initialize database schema: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

