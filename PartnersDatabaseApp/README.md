# PartnersDatabaseApp
 ARTTU Formula Student - Partner Management Dashboard

A Java Spring Boot application designed to manage, track, and visualize sponsorship data for the ARTTU Formula Student Racing Team (Cluj-Napoca).

 Features

- Data Management: Uses PostgreSQL to store partner companies and sponsorship packages.
- User Authentication: Secure Login and Registration system with persistent user storage.
- Dashboard Interface: - View all partners (Confirmed/Pending).
  - Filter partners by Season (2025, 2026).
  - Sort partners alphabetically automatically.
- **CRUD Operations:**
  - **Create:** Add new partners via a modal popup.
  - **Read:** View detailed package info and amounts.
  - **Delete:** Remove partners with admin confirmation.


## 🛠️ Technology Stack

- Language: Java 
- Framework: Spring Boot (Web, Thymeleaf)
- Database: PostgreSQL (JDBC Connection)
- Frontend: HTML5, CSS3, Thymeleaf Engine
- Tools: Maven, IntelliJ IDEA, DBeaver

 📂 Project Structure
src/main/java/com/arttu ├── ArttuApplication.java # Main entry point ├── PartnerController.java # Web Controller (routes) ├── Company.java # POJO / Entity class ├── CompanyDAO.java # Database Logic (CRUD) ├── User.java # User Entity ├── UserDAO.java # User Authentication Logic └── Database.java # DB Connection Singleton

src/main/resources ├── templates # HTML Views (index, login, register) ├── static/images # Assets (logo.svg) └── application.properties # Configuration


## ⚙️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/arttu-dashboard.git](https://github.com/your-username/arttu-dashboard.git)
    ```
2.  **Database Configuration:**
    - Ensure PostgreSQL is running on port `5433` (or update `Database.java`).
    - Create a database named `partnersdatabaseupdated`.
    - The application will automatically handle table creation if configured, or run the provided SQL script.
3.  **Run the App:**
    - Open the project in IntelliJ IDEA.
    - Run `ArttuApplication.java`.
4.  **Access the Dashboard:**
    - Open browser: `http://localhost:8080`

## 🔑 Default Credentials

- **Username:** `admin`
- **Password:** `admin`

*Project created for the ARTTU Cluj-Napoca Formula Student Team.*
