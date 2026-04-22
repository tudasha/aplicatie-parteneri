package com.arttu;

public class User {
    private int userId;
    private String username;
    private String password;
    private String fullName;
    private String position;   // Options: TEAM_LEADER, JUNIOR_TEAM_LEADER, MEMBER, RECRUIT
    private String department; // Options: Mechanical, Electronics, PR, etc.
    private String email;

    // --- CONSTRUCTORS ---

    // 1. Default Constructor (Required by some Java frameworks)
    public User() {}

    // 2. Account Completion Constructor (4 Strings)
    // Use this in com.arttu.LoginFrame to create a session without needing a DB ID yet
    public User(String username, String fullName, String position, String department) {
        this.username = username;
        this.fullName = fullName;
        this.position = position;
        this.department = department;
    }

    // 3. Full com.arttu.Database Constructor (6 arguments)
    // Use this when loading an existing user from your PostgreSQL database
    public User(int userId, String username, String fullName, String position, String department, String email) {
        this.userId = userId;
        this.username = username;
        this.fullName = fullName;
        this.position = position;
        this.department = department;
        this.email = email;
    }

    public int getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getFullName() { return fullName; }
    public String getPosition() { return position; }
    public String getDepartment() { return department; }
    public String getEmail() { return email; }


    public void setUserId(int userId) { this.userId = userId; }
    public void setUsername(String username) { this.username = username; }
    public void setPassword(String password) { this.password = password; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setPosition(String position) { this.position = position; }
    public void setDepartment(String department) { this.department = department; }
    public void setEmail(String email) { this.email = email; }

    // --- PERMISSION LOGIC ---


    public boolean isLeader() {
        if (this.position == null) return false;
        return "TEAM_LEADER".equalsIgnoreCase(this.position) ||
                "JUNIOR_TEAM_LEADER".equalsIgnoreCase(this.position);
    }
}