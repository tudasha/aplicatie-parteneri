# Partners Database Application - Architecture & Code Details

This document provides a detailed overview of the core components powering the Multi-Season Company Management system. It explores the interaction between the React frontend and the Java Spring Boot backend, specifically focusing on how multi-year tracking, satisfaction metrics, and notations are implemented.

## 1. System Overview

- **Frontend**: React.js with Vite, using `recharts` for data visualization and `lucide-react` for iconography. It features a unique "Claymorphism" UI design.
- **Backend**: Java Spring Boot providing a RESTful API.
- **Database**: PostgreSQL database accessed via pure JDBC Data Access Objects (DAOs).

---

## 2. Backend Architecture (Java)

The backend is built around a lightweight controller that delegates to DAOs for direct SQL execution.

### `ApiController.java`
This file acts as the primary router for incoming HTTP requests. It injects the `season` parameter into the DAO calls, isolating company data to the correct year.

**Code Snippet: Adding a Note Endpoint**
```java
@PostMapping("/partners/{id}/notes")
public Map<String, Object> addPartnerNote(@PathVariable int id, 
                                           @RequestBody Map<String, Object> data,
                                           HttpSession session) {
    String user = (String) session.getAttribute("currentUser");
    Map<String, Object> response = new HashMap<>();
    
    // Extracting the season passed from the frontend
    String season = (String) data.get("season");

    // Delegating to DAO with the explicit season parameter
    detailDAO.addNote(id, user, (String) data.get("noteText"), 
                      (String) data.get("emailModel"), (String) data.get("phoneScript"), 
                      Integer.parseInt(data.get("satisfactionRating").toString()), season);
                      
    response.put("success", true);
    return response;
}
```

### `CompanyDetailDAO.java`
This is the workhorse of the application. It handles advanced SQL queries, including `LEFT JOIN` aggregations and complex scoring systems.

#### Fetching Multi-Season Notations
When fetching notes, the system gracefully handles legacy global notes (which have `sezon IS NULL`) alongside modern season-specific notes.

**Code Snippet: Legacy-Aware Note Retrieval**
```java
public List<CompanyNote> getNotes(int companyId, String season) {
    List<CompanyNote> notes = new ArrayList<>();
    
    // Check if we are filtering by a specific year, or loading all history
    boolean filterBySeason = season != null && !season.isEmpty() && !season.equals("All");
    
    // The query safely includes older unseasoned notes (sezon IS NULL OR '') 
    // to prevent historical data loss
    String sql = filterBySeason 
        ? "SELECT * FROM company_notes WHERE companie_id = ? AND (sezon = ? OR sezon IS NULL OR sezon = '') ORDER BY created_at DESC"
        : "SELECT * FROM company_notes WHERE companie_id = ? ORDER BY created_at DESC";

    try (Connection conn = Database.getConnection();
         PreparedStatement pstmt = conn.prepareStatement(sql)) {
         
        pstmt.setInt(1, companyId);
        if (filterBySeason) {
            pstmt.setString(2, season); // Binds the season to the query
        }
        
        ResultSet rs = pstmt.executeQuery();
        // ... Maps ResultSet to CompanyNote objects ...
    } catch (SQLException e) { e.printStackTrace(); }
    return notes;
}
```

#### Auto-Calculated Satisfaction Scoring
The DAO also computes a 1-10 "Auto Satisfaction" score dynamically based on the company's commitment level:

**Code Snippet: Score Calculation**
```java
double score = 0;
int factors = 0;

// Factor 1: Confirmation
score += (pkg != null) ? 10 : 2;
factors++;

// Factor 2: Package Tier
if (pkg != null) {
    int tierScore;
    switch (pkg) {
        case "Platinum": tierScore = 10; break;
        case "Diamond": tierScore = 9; break;
        // ... (Gold, Silver, Bronze logic)
    }
    score += tierScore;
} else {
    score += 1;
}
factors++;

// Factor 3: Financial Amount
double amount = rs.getDouble("valoare_totala_estimata_eur");
if (amount >= 50000) score += 10;
else if (amount >= 20000) score += 8;
// ... (Other thresholds)
factors++;

double autoSat = Math.min(10, Math.round((double) score / factors));
```

---

## 3. Frontend Architecture (React)

The React frontend utilizes aggressive component states to keep the active `season` synchronized across the UI, metrics rendering, and data submission. 

### `CompanyDetail.jsx`
This component is responsible for displaying all deep data about a specific company.

#### Synchronized Multi-Fetch Strategy
In earlier iterations, attempting to fetch notes without an established season caused the API to silently fail. The updated `fetchAll` guarantees a season is selected *before* requesting data.

**Code Snippet: Safe Hydration Logic**
```javascript
const fetchAll = async (targetSeason) => {
  setLoading(true);
  try {
    let activeSeason = targetSeason;
    
    // 1. Grab available seasons first to figure out the company's timeline
    const seasonsRes = await axios.get(`/api/partners/${id}/seasons`);
    const availableSeasons = seasonsRes.data || [];
    setSeasons(availableSeasons);
    
    // 2. Default to the most recent known season if none was specified
    if (!activeSeason && availableSeasons.length > 0) {
      activeSeason = availableSeasons[0];
      setSelectedSeason(activeSeason);
      setMetricsSeason(activeSeason);
    }

    // 3. Construct the API parameter cleanly
    const seasonParam = activeSeason ? `?season=${activeSeason}` : '';
    
    // 4. Fire parallel requests locked safely to the verified season
    const [compRes, notesRes, statsRes] = await Promise.all([
      axios.get(`/api/partners/${id}${seasonParam}`),
      axios.get(`/api/partners/${id}/notes${seasonParam}`),
      axios.get(`/api/partners/${id}/stats${seasonParam}`),
    ]);

    setCompany(compRes.data);
    setNotes(notesRes.data);
    setStats(statsRes.data);
    // ...
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

#### Dynamic Metric Styling (Claymorphism)
The UI computes gradient background styles directly tied to the retrieved satisfaction ratings to give users instant visual feedback.

**Code Snippet: Dynamic Color Assignment**
```javascript
<span className="text-3xl font-black" style={{
  color: (stats?.avgSatisfaction || 0) >= 7 ? '#059669' : // Green for High
         (stats?.avgSatisfaction || 0) >= 4 ? '#D97706' : // Orange for Mid
         '#DC2626'                                        // Red for Low
}}>
  {stats?.avgSatisfaction ? stats.avgSatisfaction.toFixed(1) : '—'}
</span>
```

---

### Conclusion
By treating the `season` as a top-level route variable that trickles down all the way to the SQL `WHERE` clauses, the stack ensures perfect horizontal data isolation (Year over Year), while fallbacks (`sezon IS NULL`) guarantee vertical stability (Older global metrics aren't lost).
