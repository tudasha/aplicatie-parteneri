package com.arttu;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CompanyDetailDAO {

    // Get a single company by ID with assignment info
    public Company getCompanyById(int id) {
        String sql = "SELECT c.companie_id, c.nume, c.domeniu, c.website, c.is_confirmed, " +
                     "p.pachet_nume, p.valoare_totala_estimata_eur, p.sezon, " +
                     "ca.username as assigned_user " +
                     "FROM companii c " +
                     "LEFT JOIN pachete_sponsorizare p ON c.companie_id = p.companie_id " +
                     "LEFT JOIN company_assignments ca ON c.companie_id = ca.companie_id " +
                     "WHERE c.companie_id = ?";
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                Company c = new Company();
                c.setCompanyId(rs.getInt("companie_id"));
                c.setCompName(rs.getString("nume"));
                c.setCompProfile(rs.getString("domeniu"));
                c.setWebsite(rs.getString("website"));
                c.setConfirmed(rs.getBoolean("is_confirmed"));
                String pkg = rs.getString("pachet_nume");
                c.setSponsorshipPackage(pkg != null ? pkg : "-");
                c.setSponsorshipAmount(rs.getDouble("valoare_totala_estimata_eur"));
                c.setYear(rs.getString("sezon") != null ? rs.getString("sezon") : "-");
                c.setAssignedUser(rs.getString("assigned_user"));
                return c;
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    // Get all seasons a company participated in
    public List<String> getCompanySeasons(int companyId) {
        List<String> seasons = new ArrayList<>();
        String sql = "SELECT DISTINCT sezon FROM pachete_sponsorizare WHERE companie_id = ? AND sezon IS NOT NULL ORDER BY sezon DESC";
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, companyId);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                seasons.add(rs.getString("sezon"));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return seasons;
    }

    // Get company details for a specific season
    public Company getCompanyByIdForSeason(int id, String season) {
        String sql = "SELECT c.companie_id, c.nume, c.domeniu, c.website, c.is_confirmed, " +
                     "p.pachet_nume, p.valoare_totala_estimata_eur, p.sezon, " +
                     "ca.username as assigned_user " +
                     "FROM companii c " +
                     "LEFT JOIN pachete_sponsorizare p ON c.companie_id = p.companie_id AND p.sezon = ? " +
                     "LEFT JOIN company_assignments ca ON c.companie_id = ca.companie_id " +
                     "WHERE c.companie_id = ?";
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, season);
            pstmt.setInt(2, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                Company c = new Company();
                c.setCompanyId(rs.getInt("companie_id"));
                c.setCompName(rs.getString("nume"));
                c.setCompProfile(rs.getString("domeniu"));
                c.setWebsite(rs.getString("website"));
                c.setConfirmed(rs.getString("pachet_nume") != null);
                String pkg = rs.getString("pachet_nume");
                c.setSponsorshipPackage(pkg != null ? pkg : "-");
                c.setSponsorshipAmount(rs.getDouble("valoare_totala_estimata_eur"));
                c.setYear(rs.getString("sezon") != null ? rs.getString("sezon") : "-");
                c.setAssignedUser(rs.getString("assigned_user"));
                return c;
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    // Assign a user to a company (upsert)
    public void setAssignment(int companyId, String username) {
        String sql = "INSERT INTO company_assignments (companie_id, username) VALUES (?, ?) " +
                     "ON CONFLICT (companie_id) DO UPDATE SET username = ?, assigned_date = NOW()";
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, companyId);
            pstmt.setString(2, username);
            pstmt.setString(3, username);
            pstmt.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }

    // Get notes for a company by season
    public List<CompanyNote> getNotes(int companyId, String season) {
        List<CompanyNote> notes = new ArrayList<>();
        boolean filterBySeason = season != null && !season.isEmpty() && !season.equals("All");
        String sql = filterBySeason 
            ? "SELECT * FROM company_notes WHERE companie_id = ? AND (sezon = ? OR sezon IS NULL OR sezon = '') ORDER BY created_at DESC"
            : "SELECT * FROM company_notes WHERE companie_id = ? ORDER BY created_at DESC";

        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, companyId);
            if (filterBySeason) {
                pstmt.setString(2, season);
            }
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                CompanyNote n = new CompanyNote();
                n.setNoteId(rs.getInt("note_id"));
                n.setCompanyId(rs.getInt("companie_id"));
                n.setAuthorUsername(rs.getString("author_username"));
                n.setNoteText(rs.getString("note_text"));
                n.setEmailModel(rs.getString("email_model"));
                n.setPhoneScript(rs.getString("phone_script"));
                n.setSatisfactionRating(rs.getInt("satisfaction_rating"));
                n.setSeason(rs.getString("sezon"));
                n.setCreatedAt(rs.getTimestamp("created_at"));
                notes.add(n);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return notes;
    }

    // Add a note
    public void addNote(int companyId, String author, String noteText,
                        String emailModel, String phoneScript, int satisfactionRating, String season) {
        String sql = "INSERT INTO company_notes (companie_id, author_username, note_text, " +
                     "email_model, phone_script, satisfaction_rating, sezon) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, companyId);
            pstmt.setString(2, author);
            pstmt.setString(3, noteText);
            pstmt.setString(4, emailModel);
            pstmt.setString(5, phoneScript);
            pstmt.setInt(6, satisfactionRating);
            pstmt.setString(7, season);
            pstmt.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }

    // Get company-specific stats
    public Map<String, Object> getCompanyStats(int companyId) {
        Map<String, Object> stats = new HashMap<>();
        try (Connection conn = Database.getConnection()) {
            // Revenue by year for this company
            List<Map<String, Object>> revenueByYear = new ArrayList<>();
            String sqlYear = "SELECT sezon, SUM(valoare_totala_estimata_eur) as total " +
                             "FROM pachete_sponsorizare WHERE companie_id = ? GROUP BY sezon ORDER BY sezon";
            try (PreparedStatement ps = conn.prepareStatement(sqlYear)) {
                ps.setInt(1, companyId);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("year", rs.getString("sezon"));
                    row.put("total", rs.getDouble("total"));
                    revenueByYear.add(row);
                }
            }
            stats.put("revenueByYear", revenueByYear);

            // Package breakdown for this company
            List<Map<String, Object>> pkgBreakdown = new ArrayList<>();
            String sqlPkg = "SELECT pachet_nume, valoare_totala_estimata_eur as value, sezon " +
                            "FROM pachete_sponsorizare WHERE companie_id = ? ORDER BY sezon";
            try (PreparedStatement ps = conn.prepareStatement(sqlPkg)) {
                ps.setInt(1, companyId);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("name", rs.getString("pachet_nume"));
                    row.put("value", rs.getDouble("value"));
                    row.put("season", rs.getString("sezon"));
                    pkgBreakdown.add(row);
                }
            }
            stats.put("packageBreakdown", pkgBreakdown);

            // Satisfaction ratings over time
            List<Map<String, Object>> satisfaction = new ArrayList<>();
            String sqlSat = "SELECT satisfaction_rating, created_at FROM company_notes " +
                            "WHERE companie_id = ? AND satisfaction_rating > 0 ORDER BY created_at ASC";
            try (PreparedStatement ps = conn.prepareStatement(sqlSat)) {
                ps.setInt(1, companyId);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("rating", rs.getInt("satisfaction_rating"));
                    row.put("date", rs.getTimestamp("created_at").toString());
                    satisfaction.add(row);
                }
            }
            stats.put("satisfactionHistory", satisfaction);

            // Average satisfaction — blend manual ratings with auto-calculated score
            double manualAvg = 0;
            boolean hasManual = false;
            String sqlAvg = "SELECT AVG(satisfaction_rating) as avg_sat FROM company_notes " +
                            "WHERE companie_id = ? AND satisfaction_rating > 0";
            try (PreparedStatement ps = conn.prepareStatement(sqlAvg)) {
                ps.setInt(1, companyId);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    manualAvg = rs.getDouble("avg_sat");
                    hasManual = !rs.wasNull() && manualAvg > 0;
                }
            }

            // Auto-calculated satisfaction for this company
            double autoSat = 0;
            boolean hasAuto = false;
            String sqlAutoSat = "SELECT c.is_confirmed, p.pachet_nume, p.valoare_totala_estimata_eur " +
                                "FROM companii c LEFT JOIN pachete_sponsorizare p ON c.companie_id = p.companie_id " +
                                "WHERE c.companie_id = ?";
            try (PreparedStatement ps = conn.prepareStatement(sqlAutoSat)) {
                ps.setInt(1, companyId);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    double score = 0;
                    int factors = 0;
                    score += rs.getBoolean("is_confirmed") ? 10 : 2;
                    factors++;
                    String pkg = rs.getString("pachet_nume");
                    if (pkg != null) {
                        int tierScore;
                        switch (pkg) {
                            case "Platinum": tierScore = 10; break;
                            case "Diamond": tierScore = 9; break;
                            case "Gold": tierScore = 8; break;
                            case "Silver": tierScore = 6; break;
                            case "Bronze": tierScore = 4; break;
                            default: tierScore = 5; break;
                        }
                        score += tierScore;
                    } else {
                        score += 1;
                    }
                    factors++;
                    double amount = rs.getDouble("valoare_totala_estimata_eur");
                    if (amount >= 50000) score += 10;
                    else if (amount >= 20000) score += 8;
                    else if (amount >= 10000) score += 6;
                    else if (amount >= 5000) score += 4;
                    else if (amount > 0) score += 2;
                    else score += 1;
                    factors++;
                    autoSat = Math.min(10, Math.round((double) score / factors));
                    hasAuto = true;
                }
            }

            // Blend: if both exist, average them
            if (hasManual && hasAuto) {
                stats.put("avgSatisfaction", (manualAvg + autoSat) / 2.0);
            } else if (hasManual) {
                stats.put("avgSatisfaction", manualAvg);
            } else if (hasAuto) {
                stats.put("avgSatisfaction", autoSat);
            } else {
                stats.put("avgSatisfaction", 0.0);
            }
            stats.put("autoSatisfaction", hasAuto ? autoSat : 0.0);

            // Total revenue for this company
            String sqlTotal = "SELECT SUM(valoare_totala_estimata_eur) as total FROM pachete_sponsorizare WHERE companie_id = ?";
            try (PreparedStatement ps = conn.prepareStatement(sqlTotal)) {
                ps.setInt(1, companyId);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    stats.put("totalRevenue", rs.getDouble("total"));
                }
            }

        } catch (SQLException e) { e.printStackTrace(); }
        return stats;
    }

    // Get company stats filtered by a specific season
    public Map<String, Object> getCompanyStatsBySeason(int companyId, String season) {
        if (season == null || season.isEmpty() || season.equals("All")) {
            return getCompanyStats(companyId);
        }
        Map<String, Object> stats = new HashMap<>();
        try (Connection conn = Database.getConnection()) {
            // Revenue for this season
            List<Map<String, Object>> revenueByYear = new ArrayList<>();
            String sqlYear = "SELECT sezon, SUM(valoare_totala_estimata_eur) as total " +
                             "FROM pachete_sponsorizare WHERE companie_id = ? AND sezon = ? GROUP BY sezon";
            try (PreparedStatement ps = conn.prepareStatement(sqlYear)) {
                ps.setInt(1, companyId);
                ps.setString(2, season);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("year", rs.getString("sezon"));
                    row.put("total", rs.getDouble("total"));
                    revenueByYear.add(row);
                }
            }
            stats.put("revenueByYear", revenueByYear);

            // Package breakdown for this season
            List<Map<String, Object>> pkgBreakdown = new ArrayList<>();
            String sqlPkg = "SELECT pachet_nume, valoare_totala_estimata_eur as value, sezon " +
                            "FROM pachete_sponsorizare WHERE companie_id = ? AND sezon = ? AND pachet_nume IS NOT NULL";
            try (PreparedStatement ps = conn.prepareStatement(sqlPkg)) {
                ps.setInt(1, companyId);
                ps.setString(2, season);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("name", rs.getString("pachet_nume"));
                    row.put("value", rs.getDouble("value"));
                    row.put("season", rs.getString("sezon"));
                    pkgBreakdown.add(row);
                }
            }
            stats.put("packageBreakdown", pkgBreakdown);

            // Satisfaction history (notes are global)
            List<Map<String, Object>> satisfaction = new ArrayList<>();
            String sqlSat = "SELECT satisfaction_rating, created_at FROM company_notes " +
                            "WHERE companie_id = ? AND satisfaction_rating > 0 ORDER BY created_at ASC";
            try (PreparedStatement ps = conn.prepareStatement(sqlSat)) {
                ps.setInt(1, companyId);
                ResultSet rs = ps.executeQuery();
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("rating", rs.getInt("satisfaction_rating"));
                    row.put("date", rs.getTimestamp("created_at").toString());
                    satisfaction.add(row);
                }
            }
            stats.put("satisfactionHistory", satisfaction);

            // Manual avg satisfaction (global)
            double manualAvg = 0;
            boolean hasManual = false;
            String sqlAvg = "SELECT AVG(satisfaction_rating) as avg_sat FROM company_notes " +
                            "WHERE companie_id = ? AND satisfaction_rating > 0";
            try (PreparedStatement ps = conn.prepareStatement(sqlAvg)) {
                ps.setInt(1, companyId);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    manualAvg = rs.getDouble("avg_sat");
                    hasManual = !rs.wasNull() && manualAvg > 0;
                }
            }

            // Auto-calculated satisfaction for this SEASON
            double autoSat = 0;
            boolean hasAuto = false;
            String sqlAutoSat = "SELECT pachet_nume, valoare_totala_estimata_eur " +
                                "FROM pachete_sponsorizare WHERE companie_id = ? AND sezon = ?";
            try (PreparedStatement ps = conn.prepareStatement(sqlAutoSat)) {
                ps.setInt(1, companyId);
                ps.setString(2, season);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    double score = 0;
                    int factors = 0;
                    String pkg = rs.getString("pachet_nume");
                    // Confirmation derived from package presence
                    score += (pkg != null) ? 10 : 2;
                    factors++;
                    if (pkg != null) {
                        int tierScore;
                        switch (pkg) {
                            case "Platinum": tierScore = 10; break;
                            case "Diamond": tierScore = 9; break;
                            case "Gold": tierScore = 8; break;
                            case "Silver": tierScore = 6; break;
                            case "Bronze": tierScore = 4; break;
                            default: tierScore = 5; break;
                        }
                        score += tierScore;
                    } else {
                        score += 1;
                    }
                    factors++;
                    double amount = rs.getDouble("valoare_totala_estimata_eur");
                    if (amount >= 50000) score += 10;
                    else if (amount >= 20000) score += 8;
                    else if (amount >= 10000) score += 6;
                    else if (amount >= 5000) score += 4;
                    else if (amount > 0) score += 2;
                    else score += 1;
                    factors++;
                    autoSat = Math.min(10, Math.round((double) score / factors));
                    hasAuto = true;
                }
            }

            if (hasManual && hasAuto) {
                stats.put("avgSatisfaction", (manualAvg + autoSat) / 2.0);
            } else if (hasManual) {
                stats.put("avgSatisfaction", manualAvg);
            } else if (hasAuto) {
                stats.put("avgSatisfaction", autoSat);
            } else {
                stats.put("avgSatisfaction", 0.0);
            }
            stats.put("autoSatisfaction", hasAuto ? autoSat : 0.0);

            // Total revenue for this season
            String sqlTotal = "SELECT COALESCE(SUM(valoare_totala_estimata_eur), 0) as total FROM pachete_sponsorizare WHERE companie_id = ? AND sezon = ?";
            try (PreparedStatement ps = conn.prepareStatement(sqlTotal)) {
                ps.setInt(1, companyId);
                ps.setString(2, season);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    stats.put("totalRevenue", rs.getDouble("total"));
                }
            }

        } catch (SQLException e) { e.printStackTrace(); }
        return stats;
    }

    // Advanced search with filters
    public List<Company> searchCompanies(String nameQuery, String status, String year,
                                          Double minValue, String sortBy, String contactedWithin) {
        List<Company> list = new ArrayList<>();

        boolean hasYearFilter = year != null && !year.isEmpty() && !year.equals("All");

        // Use DISTINCT ON to avoid duplicates from multi-year packages
        StringBuilder sql = new StringBuilder(
            "SELECT DISTINCT ON (c.companie_id) c.companie_id, c.nume, c.domeniu, c.is_confirmed, " +
            "p.pachet_nume, p.valoare_totala_estimata_eur, p.sezon, " +
            "ca.username as assigned_user, " +
            "(SELECT MAX(cn.created_at) FROM company_notes cn WHERE cn.companie_id = c.companie_id) as last_contacted, " +
            "(SELECT COUNT(*) FROM company_notes cn WHERE cn.companie_id = c.companie_id) as note_count " +
            "FROM companii c " +
            "LEFT JOIN pachete_sponsorizare p ON c.companie_id = p.companie_id"
        );

        // Year filter in JOIN condition to keep LEFT JOIN semantics
        if (hasYearFilter) {
            sql.append(" AND p.sezon = ? ");
        }

        sql.append(" LEFT JOIN company_assignments ca ON c.companie_id = ca.companie_id ");
        sql.append(" WHERE 1=1 ");

        List<Object> params = new ArrayList<>();
        if (hasYearFilter) {
            params.add(year);
        }

        if (nameQuery != null && !nameQuery.isEmpty()) {
            sql.append(" AND LOWER(c.nume) LIKE ? ");
            params.add("%" + nameQuery.toLowerCase() + "%");
        }

        if (status != null && !status.isEmpty() && !status.equals("All")) {
            if ("Confirmed".equalsIgnoreCase(status)) {
                sql.append(" AND p.pachet_nume IS NOT NULL ");
            } else if ("Pending".equalsIgnoreCase(status)) {
                sql.append(" AND p.pachet_nume IS NULL ");
            }
        }

        if (minValue != null && minValue > 0) {
            sql.append(" AND p.valoare_totala_estimata_eur >= ? ");
            params.add(minValue);
        }

        if (contactedWithin != null && !contactedWithin.isEmpty() && !contactedWithin.equals("All")) {
            try {
                int days = Integer.parseInt(contactedWithin);
                long millis = System.currentTimeMillis() - ((long) days * 24 * 60 * 60 * 1000);
                java.sql.Timestamp cutoff = new java.sql.Timestamp(millis);
                sql.append(" AND (SELECT MAX(cn.created_at) FROM company_notes cn WHERE cn.companie_id = c.companie_id) >= ? ");
                params.add(cutoff);
            } catch (NumberFormatException e) { }
        }

        sql.append(" ORDER BY c.companie_id, p.sezon DESC NULLS LAST ");

        String orderClause = "sub.nume ASC";
        if ("lastContactedDesc".equals(sortBy)) {
            orderClause = "sub.last_contacted DESC NULLS LAST, sub.nume ASC";
        } else if ("lastContactedAsc".equals(sortBy)) {
            orderClause = "sub.last_contacted ASC NULLS LAST, sub.nume ASC";
        }

        // Wrap to apply name ordering + limit
        String wrapped = "SELECT * FROM (" + sql.toString() + ") sub ORDER BY " + orderClause + " LIMIT 100";

        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(wrapped)) {
            int index = 1;
            for (Object param : params) {
                if (param instanceof String) {
                    pstmt.setString(index++, (String) param);
                } else if (param instanceof Double) {
                    pstmt.setDouble(index++, (Double) param);
                }
            }
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

    // Global average satisfaction for universal metrics
    // Combines manual satisfaction ratings from notes AND auto-calculated satisfaction per company
    public double getGlobalAvgSatisfaction() {
        // Weighted blend: average of (manual avg, auto avg)
        double manualAvg = 0;
        double autoAvg = 0;
        boolean hasManual = false;
        boolean hasAuto = false;

        try (Connection conn = Database.getConnection()) {
            // Manual average from notes
            String sqlManual = "SELECT AVG(satisfaction_rating) as avg_sat FROM company_notes WHERE satisfaction_rating > 0";
            try (PreparedStatement ps = conn.prepareStatement(sqlManual);
                 ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    manualAvg = rs.getDouble("avg_sat");
                    hasManual = !rs.wasNull() && manualAvg > 0;
                }
            }

            // Auto-calculated average from confirmed companies
            // Formula mirrors frontend: avg of (confirmScore, tierScore, amountScore) per company
            String sqlAuto = "SELECT c.is_confirmed, p.pachet_nume, p.valoare_totala_estimata_eur " +
                             "FROM companii c LEFT JOIN pachete_sponsorizare p ON c.companie_id = p.companie_id";
            try (PreparedStatement ps = conn.prepareStatement(sqlAuto);
                 ResultSet rs = ps.executeQuery()) {
                double totalAutoScore = 0;
                int autoCount = 0;
                while (rs.next()) {
                    double score = 0;
                    int factors = 0;
                    // Factor 1: confirmation
                    score += rs.getBoolean("is_confirmed") ? 10 : 2;
                    factors++;
                    // Factor 2: package tier
                    String pkg = rs.getString("pachet_nume");
                    if (pkg != null) {
                        int tierScore;
                        switch (pkg) {
                            case "Platinum": tierScore = 10; break;
                            case "Diamond": tierScore = 9; break;
                            case "Gold": tierScore = 8; break;
                            case "Silver": tierScore = 6; break;
                            case "Bronze": tierScore = 4; break;
                            default: tierScore = 5; break;
                        }
                        score += tierScore;
                    } else {
                        score += 1;
                    }
                    factors++;
                    // Factor 3: amount
                    double amount = rs.getDouble("valoare_totala_estimata_eur");
                    if (amount >= 50000) score += 10;
                    else if (amount >= 20000) score += 8;
                    else if (amount >= 10000) score += 6;
                    else if (amount >= 5000) score += 4;
                    else if (amount > 0) score += 2;
                    else score += 1;
                    factors++;

                    double companyAutoSat = Math.min(10, Math.round((double) score / factors));
                    totalAutoScore += companyAutoSat;
                    autoCount++;
                }
                if (autoCount > 0) {
                    autoAvg = totalAutoScore / autoCount;
                    hasAuto = true;
                }
            }
        } catch (SQLException e) { e.printStackTrace(); }

        // Blend: if both exist, average them; otherwise return whichever is available
        if (hasManual && hasAuto) return (manualAvg + autoAvg) / 2.0;
        if (hasManual) return manualAvg;
        if (hasAuto) return autoAvg;
        return 0;
    }
    // Get companies assigned to a specific user
    public List<Company> getCompaniesByAssignedUser(String username) {
        List<Company> list = new ArrayList<>();
        // Use DISTINCT ON to avoid duplicates from multi-year packages
        String innerSql = "SELECT DISTINCT ON (c.companie_id) c.companie_id, c.nume, c.domeniu, c.is_confirmed, " +
                     "p.pachet_nume, p.valoare_totala_estimata_eur, p.sezon, " +
                     "ca.username as assigned_user, " +
                     "(SELECT COUNT(*) FROM company_notes cn WHERE cn.companie_id = c.companie_id) as note_count " +
                     "FROM companii c " +
                     "INNER JOIN company_assignments ca ON c.companie_id = ca.companie_id " +
                     "LEFT JOIN pachete_sponsorizare p ON c.companie_id = p.companie_id " +
                     "WHERE ca.username = ? " +
                     "ORDER BY c.companie_id, p.sezon DESC NULLS LAST";
        String sql = "SELECT * FROM (" + innerSql + ") sub ORDER BY sub.nume ASC";
        try (Connection conn = Database.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, username);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                Company c = new Company();
                c.setCompanyId(rs.getInt("companie_id"));
                c.setCompName(rs.getString("nume"));
                c.setCompProfile(rs.getString("domeniu"));
                c.setConfirmed(rs.getBoolean("is_confirmed"));
                String pkg = rs.getString("pachet_nume");
                c.setSponsorshipPackage(pkg != null ? pkg : "-");
                c.setSponsorshipAmount(rs.getDouble("valoare_totala_estimata_eur"));
                c.setYear(rs.getString("sezon") != null ? rs.getString("sezon") : "-");
                c.setAssignedUser(rs.getString("assigned_user"));
                c.setNoteCount(rs.getInt("note_count"));
                list.add(c);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }
}
