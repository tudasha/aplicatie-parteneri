package com.arttu;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CompanyDAO {

    // 1. ADD PARTNER
    public void addCompany(Company c) {
        String sql = "INSERT INTO companii (nume, domeniu, website, is_confirmed) VALUES (?, ?, ?, ?)";
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, c.getCompName());
            pstmt.setString(2, c.getCompProfile());
            pstmt.setString(3, "N/A");
            pstmt.setBoolean(4, false); // Pending
            pstmt.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }

    // 2. DELETE PARTNER
    public void deleteCompany(int id) {
        String sql = "DELETE FROM companii WHERE companie_id = ?";
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            pstmt.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }


    // UNCONFIRM for a specific season (clears the package data)
    public void unconfirmForSeason(int id, String season) {
        String sql = "UPDATE pachete_sponsorizare SET pachet_nume = NULL, valoare_totala_estimata_eur = 0 WHERE companie_id = ? AND sezon = ?";
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            pstmt.setString(2, season);
            pstmt.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }

    // 4. CONFIRM COMPANY
    public void confirmCompany(int companyId, String pkgName, double amount, String year) {
        try (Connection conn = Database.getConnection()) {

            String sqlDel = "DELETE FROM pachete_sponsorizare WHERE companie_id = ? AND sezon = ?";
            try (PreparedStatement pstDel = conn.prepareStatement(sqlDel)) {
                pstDel.setInt(1, companyId);
                pstDel.setString(2, year);
                pstDel.executeUpdate();
            }

            //  pachetul nou
            String sqlIns = "INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) VALUES (?, ?, ?, ?)";
            try (PreparedStatement pstIns = conn.prepareStatement(sqlIns)) {
                pstIns.setInt(1, companyId);
                pstIns.setString(2, pkgName);
                pstIns.setDouble(3, amount);
                pstIns.setString(4, year);
                pstIns.executeUpdate();
            }

        } catch (SQLException e) { e.printStackTrace(); }
    }

    // ADD COMPANY TO A NEW SEASON
    public void addCompanyToSeason(int companyId, String season) {
        try (Connection conn = Database.getConnection()) {
            // Check if the company already has a package for this season
            String checkSql = "SELECT COUNT(*) FROM pachete_sponsorizare WHERE companie_id = ? AND sezon = ?";
            try (PreparedStatement ps = conn.prepareStatement(checkSql)) {
                ps.setInt(1, companyId);
                ps.setString(2, season);
                ResultSet rs = ps.executeQuery();
                if (rs.next() && rs.getInt(1) > 0) {
                    return; // Already exists for this season
                }
            }

            // Insert a placeholder package row for the new season (no package yet)
            // Past seasons and is_confirmed status are left untouched
            String sqlIns = "INSERT INTO pachete_sponsorizare (companie_id, pachet_nume, valoare_totala_estimata_eur, sezon) VALUES (?, NULL, 0, ?)";
            try (PreparedStatement ps = conn.prepareStatement(sqlIns)) {
                ps.setInt(1, companyId);
                ps.setString(2, season);
                ps.executeUpdate();
            }
        } catch (SQLException e) { e.printStackTrace(); }
    }

    // 5. FILTER & SORT LIST
    public List<Company> getFilteredCompanies(String status, String year, int page) {
        List<Company> list = new ArrayList<>();
        int limit = 50;
        int offset = page * limit;

        boolean hasYearFilter = year != null && !year.isEmpty() && !year.equals("All");

        // Use DISTINCT ON to avoid duplicates from multi-year packages.
        // When a year filter is active, move it into the JOIN condition so the
        // LEFT JOIN still returns companies without a matching package.
        StringBuilder sql = new StringBuilder(
                "SELECT DISTINCT ON (c.companie_id) c.companie_id, c.nume, c.domeniu, c.is_confirmed, " +
                        "p.pachet_nume, p.valoare_totala_estimata_eur, p.sezon, " +
                        "ca.username as assigned_user, " +
                        "(SELECT MAX(cn.created_at) FROM company_notes cn WHERE cn.companie_id = c.companie_id) as last_contacted, " +
                        "(SELECT COUNT(*) FROM company_notes cn WHERE cn.companie_id = c.companie_id) as note_count " +
                        "FROM companii c " +
                        "LEFT JOIN pachete_sponsorizare p ON c.companie_id = p.companie_id " +
                        "LEFT JOIN company_assignments ca ON c.companie_id = ca.companie_id"
        );

        if (hasYearFilter) {
            sql.append(" AND p.sezon = ? ");
        }

        sql.append(" WHERE 1=1 ");

        sql.append(" ORDER BY c.companie_id, p.sezon DESC NULLS LAST ");

        // Wrap in sub-select so we can apply name ordering + pagination
        String wrapped = "SELECT * FROM (" + sql.toString() + ") sub ORDER BY sub.nume ASC LIMIT ? OFFSET ?";

        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(wrapped)) {

            int index = 1;
            if (hasYearFilter) {
                pstmt.setString(index++, year);
            }
            pstmt.setInt(index++, limit);
            pstmt.setInt(index++, offset);

            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                Company c = new Company();
                c.setCompanyId(rs.getInt("companie_id"));
                c.setCompName(rs.getString("nume"));
                c.setCompProfile(rs.getString("domeniu"));
                c.setConfirmed(rs.getString("pachet_nume") != null);

                String pkg = rs.getString("pachet_nume");
                c.setSponsorshipPackage(pkg != null ? pkg : "-");
                c.setSponsorshipAmount(rs.getDouble("valoare_totala_estimata_eur"));
                c.setYear(rs.getString("sezon") != null ? rs.getString("sezon") : "-");
                c.setAssignedUser(rs.getString("assigned_user"));
                c.setNoteCount(rs.getInt("note_count"));
                c.setLastContacted(rs.getTimestamp("last_contacted"));

                list.add(c);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        try (Connection conn = Database.getConnection()) {
            // 1. Revenue by Year
            List<Map<String, Object>> revenueByYear = new ArrayList<>();
            String sqlYear = "SELECT sezon, SUM(valoare_totala_estimata_eur) as total FROM pachete_sponsorizare GROUP BY sezon ORDER BY sezon";
            try (PreparedStatement ps = conn.prepareStatement(sqlYear); ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("year", rs.getString("sezon"));
                    row.put("total", rs.getDouble("total"));
                    revenueByYear.add(row);
                }
            }
            stats.put("revenueByYear", revenueByYear);

            // 2. Package Distribution
            List<Map<String, Object>> pkgDistrib = new ArrayList<>();
            String sqlPkg = "SELECT pachet_nume, COUNT(*) as count FROM pachete_sponsorizare GROUP BY pachet_nume";
            try (PreparedStatement ps = conn.prepareStatement(sqlPkg); ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("name", rs.getString("pachet_nume"));
                    row.put("value", rs.getInt("count"));
                    pkgDistrib.add(row);
                }
            }
            stats.put("packageDistribution", pkgDistrib);

            // 3. General Summary
            String sqlSum = "SELECT COUNT(*) as total_companies, " +
                           "(SELECT COUNT(DISTINCT companie_id) FROM pachete_sponsorizare WHERE pachet_nume IS NOT NULL) as confirmed, " +
                           "(SELECT SUM(valoare_totala_estimata_eur) FROM pachete_sponsorizare) as total_revenue " +
                           "FROM companii";
            try (PreparedStatement ps = conn.prepareStatement(sqlSum); ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    stats.put("totalCompanies", rs.getInt("total_companies"));
                    stats.put("confirmedCompanies", rs.getInt("confirmed"));
                    stats.put("totalRevenue", rs.getDouble("total_revenue"));
                }
            }

            // 4. Satisfaction by Hour (Best Time to Contact)
            List<Map<String, Object>> satisfactionByHour = new ArrayList<>();
            String sqlHour = "SELECT EXTRACT(HOUR FROM created_at) as contact_hour, AVG(satisfaction_rating) as avg_sat, COUNT(*) as note_count " +
                             "FROM company_notes WHERE satisfaction_rating > 0 GROUP BY EXTRACT(HOUR FROM created_at) ORDER BY contact_hour";
            try (PreparedStatement ps = conn.prepareStatement(sqlHour); ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    int hour = rs.getInt("contact_hour");
                    row.put("time", String.format("%02d:00", hour));
                    row.put("avgSatisfaction", rs.getDouble("avg_sat"));
                    row.put("noteCount", rs.getInt("note_count"));
                    satisfactionByHour.add(row);
                }
            }
            stats.put("satisfactionByHour", satisfactionByHour);

            // 5. Satisfaction by Day of Week
            List<Map<String, Object>> satisfactionByDay = new ArrayList<>();
            String sqlDay = "SELECT EXTRACT(ISODOW FROM created_at) as contact_day, AVG(satisfaction_rating) as avg_sat, COUNT(*) as note_count " +
                            "FROM company_notes WHERE satisfaction_rating > 0 GROUP BY EXTRACT(ISODOW FROM created_at) ORDER BY contact_day";
            try (PreparedStatement ps = conn.prepareStatement(sqlDay); ResultSet rs = ps.executeQuery()) {
                String[] dayNames = {"", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    int dayIdx = rs.getInt("contact_day");
                    if (dayIdx >= 1 && dayIdx <= 7) {
                        row.put("day", dayNames[dayIdx]);
                        row.put("avgSatisfaction", rs.getDouble("avg_sat"));
                        row.put("noteCount", rs.getInt("note_count"));
                        satisfactionByDay.add(row);
                    }
                }
            }
            stats.put("satisfactionByDay", satisfactionByDay);

            // 6. Satisfaction by Month
            List<Map<String, Object>> satisfactionByMonth = new ArrayList<>();
            String sqlMonth = "SELECT EXTRACT(MONTH FROM created_at) as contact_month, AVG(satisfaction_rating) as avg_sat, COUNT(*) as note_count " +
                            "FROM company_notes WHERE satisfaction_rating > 0 GROUP BY EXTRACT(MONTH FROM created_at) ORDER BY contact_month";
            try (PreparedStatement ps = conn.prepareStatement(sqlMonth); ResultSet rs = ps.executeQuery()) {
                String[] monthNames = {"", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    int monthIdx = rs.getInt("contact_month");
                    if (monthIdx >= 1 && monthIdx <= 12) {
                        row.put("month", monthNames[monthIdx]);
                        row.put("avgSatisfaction", rs.getDouble("avg_sat"));
                        row.put("noteCount", rs.getInt("note_count"));
                        satisfactionByMonth.add(row);
                    }
                }
            }
            stats.put("satisfactionByMonth", satisfactionByMonth);

        } catch (SQLException e) { e.printStackTrace(); }
        return stats;
    }

    // STATS FILTERED BY SEASON
    public Map<String, Object> getStatsBySeason(String season) {
        if (season == null || season.isEmpty() || season.equals("All")) {
            return getStats();
        }
        Map<String, Object> stats = new HashMap<>();
        try (Connection conn = Database.getConnection()) {
            // 1. Revenue by Year (filtered)
            List<Map<String, Object>> revenueByYear = new ArrayList<>();
            String sqlYear = "SELECT sezon, SUM(valoare_totala_estimata_eur) as total FROM pachete_sponsorizare WHERE sezon = ? GROUP BY sezon ORDER BY sezon";
            try (PreparedStatement ps = conn.prepareStatement(sqlYear)) {
                ps.setString(1, season);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("year", rs.getString("sezon"));
                    row.put("total", rs.getDouble("total"));
                    revenueByYear.add(row);
                }
            }
            stats.put("revenueByYear", revenueByYear);

            // 2. Package Distribution (filtered)
            List<Map<String, Object>> pkgDistrib = new ArrayList<>();
            String sqlPkg = "SELECT pachet_nume, COUNT(*) as count FROM pachete_sponsorizare WHERE sezon = ? AND pachet_nume IS NOT NULL GROUP BY pachet_nume";
            try (PreparedStatement ps = conn.prepareStatement(sqlPkg)) {
                ps.setString(1, season);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("name", rs.getString("pachet_nume"));
                    row.put("value", rs.getInt("count"));
                    pkgDistrib.add(row);
                }
            }
            stats.put("packageDistribution", pkgDistrib);

            // 3. General Summary (filtered by season)
            String sqlSum = "SELECT " +
                           "(SELECT COUNT(DISTINCT p.companie_id) FROM pachete_sponsorizare p WHERE p.sezon = ?) as total_companies, " +
                           "(SELECT COUNT(DISTINCT p.companie_id) FROM pachete_sponsorizare p WHERE p.sezon = ? AND p.pachet_nume IS NOT NULL) as confirmed, " +
                           "(SELECT COALESCE(SUM(valoare_totala_estimata_eur), 0) FROM pachete_sponsorizare WHERE sezon = ?) as total_revenue";
            try (PreparedStatement ps = conn.prepareStatement(sqlSum)) {
                ps.setString(1, season);
                ps.setString(2, season);
                ps.setString(3, season);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    stats.put("totalCompanies", rs.getInt("total_companies"));
                    stats.put("confirmedCompanies", rs.getInt("confirmed"));
                    stats.put("totalRevenue", rs.getDouble("total_revenue"));
                }
            }

            // Satisfaction stats remain universal (notes aren't season-scoped)
            // 4. Satisfaction by Hour
            List<Map<String, Object>> satisfactionByHour = new ArrayList<>();
            String sqlHour = "SELECT EXTRACT(HOUR FROM created_at) as contact_hour, AVG(satisfaction_rating) as avg_sat, COUNT(*) as note_count " +
                             "FROM company_notes WHERE satisfaction_rating > 0 GROUP BY EXTRACT(HOUR FROM created_at) ORDER BY contact_hour";
            try (PreparedStatement ps = conn.prepareStatement(sqlHour); ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    int hour = rs.getInt("contact_hour");
                    row.put("time", String.format("%02d:00", hour));
                    row.put("avgSatisfaction", rs.getDouble("avg_sat"));
                    row.put("noteCount", rs.getInt("note_count"));
                    satisfactionByHour.add(row);
                }
            }
            stats.put("satisfactionByHour", satisfactionByHour);

            // 5. Satisfaction by Day of Week
            List<Map<String, Object>> satisfactionByDay = new ArrayList<>();
            String sqlDay = "SELECT EXTRACT(ISODOW FROM created_at) as contact_day, AVG(satisfaction_rating) as avg_sat, COUNT(*) as note_count " +
                            "FROM company_notes WHERE satisfaction_rating > 0 GROUP BY EXTRACT(ISODOW FROM created_at) ORDER BY contact_day";
            try (PreparedStatement ps = conn.prepareStatement(sqlDay); ResultSet rs = ps.executeQuery()) {
                String[] dayNames = {"", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    int dayIdx = rs.getInt("contact_day");
                    if (dayIdx >= 1 && dayIdx <= 7) {
                        row.put("day", dayNames[dayIdx]);
                        row.put("avgSatisfaction", rs.getDouble("avg_sat"));
                        row.put("noteCount", rs.getInt("note_count"));
                        satisfactionByDay.add(row);
                    }
                }
            }
            stats.put("satisfactionByDay", satisfactionByDay);

            // 6. Satisfaction by Month
            List<Map<String, Object>> satisfactionByMonth = new ArrayList<>();
            String sqlMonth = "SELECT EXTRACT(MONTH FROM created_at) as contact_month, AVG(satisfaction_rating) as avg_sat, COUNT(*) as note_count " +
                            "FROM company_notes WHERE satisfaction_rating > 0 GROUP BY EXTRACT(MONTH FROM created_at) ORDER BY contact_month";
            try (PreparedStatement ps = conn.prepareStatement(sqlMonth); ResultSet rs = ps.executeQuery()) {
                String[] monthNames = {"", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    int monthIdx = rs.getInt("contact_month");
                    if (monthIdx >= 1 && monthIdx <= 12) {
                        row.put("month", monthNames[monthIdx]);
                        row.put("avgSatisfaction", rs.getDouble("avg_sat"));
                        row.put("noteCount", rs.getInt("note_count"));
                        satisfactionByMonth.add(row);
                    }
                }
            }
            stats.put("satisfactionByMonth", satisfactionByMonth);

        } catch (SQLException e) { e.printStackTrace(); }
        return stats;
    }
}