package com.arttu;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserDAO {

    // Login
    public String getUserRole(String userOrEmail, String password) {
        String sql = "SELECT position FROM users WHERE (username = ? OR email = ?) AND password_hash = ?";
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, userOrEmail);
            pstmt.setString(2, userOrEmail);
            pstmt.setString(3, password);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return rs.getString("position");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }


    public boolean registerUser(String username, String password, String fullName, String position, String department, String email) {
        String sql = "INSERT INTO users (username, password_hash, full_name, position, department, email) VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, username);
            pstmt.setString(2, password);
            pstmt.setString(3, fullName);
            pstmt.setString(4, position);
            pstmt.setString(5, department);
            pstmt.setString(6, email);

            pstmt.executeUpdate();
            return true;

        } catch (SQLException e) {
            // Daca intra aici, inseamna ca userul exista deja (Duplicate Key)
            System.out.println("Eroare la inregistrare (posibil duplicat): " + e.getMessage());
            return false;
        }
    }

    // get all users team directory
    public List<User> getAllUsers() {
        List<User> list = new ArrayList<>();
        String sql = "SELECT username, full_name, position, email FROM users";

        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                User u = new User();
                u.setUsername(rs.getString("username"));
                u.setFullName(rs.getString("full_name"));
                u.setPosition(rs.getString("position"));
                u.setEmail(rs.getString("email"));
                list.add(u);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
}
