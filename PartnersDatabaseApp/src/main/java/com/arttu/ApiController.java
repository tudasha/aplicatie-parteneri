package com.arttu;

import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"${FRONTEND_URL:http://localhost:5173}"}, allowCredentials = "true") 
public class ApiController {

    private CompanyDAO companyDAO = new CompanyDAO();
    private UserDAO userDAO = new UserDAO();
    private CompanyDetailDAO detailDAO = new CompanyDetailDAO();

    @PostMapping("/auth/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials, HttpSession session) {
        String userOrEmail = credentials.get("userOrEmail");
        String password = credentials.get("password");
        
        String role = userDAO.getUserRole(userOrEmail, password);
        Map<String, Object> response = new HashMap<>();
        
        if (role != null) {
            session.setAttribute("currentUser", userOrEmail);
            session.setAttribute("userRole", role);
            response.put("success", true);
            response.put("username", userOrEmail);
            response.put("role", role);
        } else {
            response.put("success", false);
            response.put("message", "Invalid credentials");
        }
        return response;
    }

    @PostMapping("/auth/register")
    public Map<String, Object> register(@RequestBody Map<String, String> data) {
        boolean success = userDAO.registerUser(
            data.get("username"),
            data.get("password"),
            data.get("fullName"),
            data.get("position"),
            data.get("department"),
            data.get("email")
        );
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        if (!success) response.put("message", "Username or Email already exists!");
        return response;
    }

    @GetMapping("/partners")
    public List<Company> getPartners(@RequestParam(required = false) String status,
                                    @RequestParam(required = false) String year,
                                    @RequestParam(defaultValue = "0") int page) {
        return companyDAO.getFilteredCompanies(status, year, page);
    }

    @PostMapping("/partners")
    public Map<String, Object> addPartner(@RequestBody Company company) {
        companyDAO.addCompany(company);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return response;
    }

    @DeleteMapping("/partners/{id}")
    public Map<String, Object> deletePartner(@PathVariable int id, HttpSession session) {
        String role = (String) session.getAttribute("userRole");
        Map<String, Object> response = new HashMap<>();
        
        if ("Team Leader".equals(role) || "Admin".equals(role)) {
            companyDAO.deleteCompany(id);
            response.put("success", true);
        } else {
            response.put("success", false);
            response.put("message", "Unauthorized");
        }
        return response;
    }

    @PostMapping("/partners/toggle/{id}")
    public Map<String, Object> toggleStatus(@PathVariable int id, @RequestBody Map<String, String> data, HttpSession session) {
        String role = (String) session.getAttribute("userRole");
        String username = (String) session.getAttribute("currentUser");
        Map<String, Object> response = new HashMap<>();

        Company comp = detailDAO.getCompanyById(id);
        boolean isAuthorized = "Team Leader".equals(role) || "Admin".equals(role) || 
                               (comp != null && username != null && username.equals(comp.getAssignedUser()));

        if (isAuthorized) {
            String season = data.get("season");
            if (season != null && !season.isEmpty()) {
                companyDAO.unconfirmForSeason(id, season);
            }
            response.put("success", true);
        } else {
            response.put("success", false);
            response.put("message", "Unauthorized");
        }
        return response;
    }

    @PostMapping("/partners/confirm")
    public Map<String, Object> confirmPartner(@RequestBody Map<String, Object> data, HttpSession session) {
        String role = (String) session.getAttribute("userRole");
        String username = (String) session.getAttribute("currentUser");
        Map<String, Object> response = new HashMap<>();

        int companyId = ((Number) data.get("companyId")).intValue();
        Company comp = detailDAO.getCompanyById(companyId);

        boolean isAuthorized = "Team Leader".equals(role) || "Admin".equals(role) || 
                               (comp != null && username != null && username.equals(comp.getAssignedUser()));

        if (!isAuthorized) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return response;
        }

        Object amt = data.get("amount");
        double amount = (amt instanceof Number) ? ((Number) amt).doubleValue() : Double.parseDouble(amt.toString());

        companyDAO.confirmCompany(
            companyId,
            (String) data.get("pkgName"),
            amount,
            (String) data.get("year")
        );
        response.put("success", true);
        return response;
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userDAO.getAllUsers();
    }
    
    @GetMapping("/auth/me")
    public Map<String, Object> me(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        String user = (String) session.getAttribute("currentUser");
        if (user != null) {
            response.put("authenticated", true);
            response.put("username", user);
            response.put("role", session.getAttribute("userRole"));
        } else {
            response.put("authenticated", false);
        }
        return response;
    }
    
    @PostMapping("/auth/logout")
    public Map<String, Object> logout(HttpSession session) {
        session.invalidate();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return response;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats(@RequestParam(required = false) String season) {
        Map<String, Object> stats = companyDAO.getStatsBySeason(season);
        // Add global average satisfaction for universal metrics
        stats.put("avgSatisfaction", detailDAO.getGlobalAvgSatisfaction());
        return stats;
    }

    // ====== COMPANY DETAIL ENDPOINTS ======
    // IMPORTANT: literal paths MUST come before /{id} path variable

    @GetMapping("/partners/search")
    public List<Company> searchPartners(@RequestParam(required = false) String q,
                                        @RequestParam(required = false) String status,
                                        @RequestParam(required = false) String year,
                                        @RequestParam(required = false) Double minValue,
                                        @RequestParam(required = false) String sortBy,
                                        @RequestParam(required = false) String contactedWithin) {
        return detailDAO.searchCompanies(q, status, year, minValue, sortBy, contactedWithin);
    }

    @GetMapping("/partners/my-companies")
    public List<Company> getMyCompanies(HttpSession session) {
        String user = (String) session.getAttribute("currentUser");
        if (user == null) return List.of();
        return detailDAO.getCompaniesByAssignedUser(user);
    }

    @GetMapping("/partners/{id}/seasons")
    public List<String> getPartnerSeasons(@PathVariable int id) {
        return detailDAO.getCompanySeasons(id);
    }

    @PostMapping("/partners/{id}/add-to-season")
    public Map<String, Object> addToSeason(@PathVariable int id, @RequestBody Map<String, String> data) {
        String season = data.get("season");
        Map<String, Object> response = new HashMap<>();
        if (season == null || season.isEmpty()) {
            response.put("success", false);
            response.put("message", "Season is required");
            return response;
        }
        companyDAO.addCompanyToSeason(id, season);
        response.put("success", true);
        return response;
    }

    @GetMapping("/partners/{id}")
    public Company getPartnerDetail(@PathVariable int id, @RequestParam(required = false) String season) {
        if (season != null && !season.isEmpty()) {
            return detailDAO.getCompanyByIdForSeason(id, season);
        }
        return detailDAO.getCompanyById(id);
    }

    @GetMapping("/partners/{id}/notes")
    public List<CompanyNote> getPartnerNotes(@PathVariable int id, @RequestParam(required = false) String season) {
        return detailDAO.getNotes(id, season);
    }

    @PostMapping("/partners/{id}/notes")
    public Map<String, Object> addPartnerNote(@PathVariable int id, 
                                               @RequestBody Map<String, Object> data,
                                               HttpSession session) {
        String user = (String) session.getAttribute("currentUser");
        Map<String, Object> response = new HashMap<>();
        if (user == null) {
            response.put("success", false);
            response.put("message", "Not authenticated");
            return response;
        }
        
        String noteText = (String) data.get("noteText");
        String emailModel = (String) data.get("emailModel");
        String phoneScript = (String) data.get("phoneScript");
        Object satObj = data.get("satisfactionRating");
        int satisfactionRating = (satObj instanceof Number) ? ((Number) satObj).intValue() : Integer.parseInt(satObj.toString());
        String season = (String) data.get("season");

        detailDAO.addNote(id, user, noteText, emailModel, phoneScript, satisfactionRating, season);
        response.put("success", true);
        return response;
    }

    @GetMapping("/partners/{id}/stats")
    public Map<String, Object> getPartnerStats(@PathVariable int id, @RequestParam(required = false) String season) {
        return detailDAO.getCompanyStatsBySeason(id, season);
    }

    @PostMapping("/partners/{id}/assign")
    public Map<String, Object> assignUser(@PathVariable int id,
                                           @RequestBody Map<String, String> data,
                                           HttpSession session) {
        String role = (String) session.getAttribute("userRole");
        Map<String, Object> response = new HashMap<>();
        
        if (!"Team Leader".equals(role) && !"Admin".equals(role)) {
            response.put("success", false);
            response.put("message", "Unauthorized");
            return response;
        }

        detailDAO.setAssignment(id, data.get("username"));
        response.put("success", true);
        return response;
    }

}
