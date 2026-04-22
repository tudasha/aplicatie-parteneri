package com.arttu;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.List;

@Controller
public class PartnerController {

    private CompanyDAO companyDAO = new CompanyDAO();
    private UserDAO userDAO = new UserDAO();

    @GetMapping("/")
    public String showLandingPage() { return "landing"; }

    @GetMapping("/login")
    public String showLoginPage() { return "login"; }

    @PostMapping("/login")
    public String processLogin(@RequestParam String userOrEmail, @RequestParam String password, HttpSession session, Model model) {
        String role = userDAO.getUserRole(userOrEmail, password);
        if (role != null) {
            session.setAttribute("currentUser", userOrEmail);
            session.setAttribute("userRole", role);
            return "redirect:/dashboard";
        }
        model.addAttribute("error", "Invalid credentials");
        return "login";
    }

    @GetMapping("/register")
    public String showRegisterPage() { return "register"; }

    @PostMapping("/register")
    public String processRegister(@RequestParam String username, @RequestParam String password, @RequestParam String numePrenume,
                                  @RequestParam String position, @RequestParam String department, @RequestParam String email, Model model) {
        boolean success = userDAO.registerUser(username, password, numePrenume, position, department, email);
        if (success) {
            return "redirect:/login";
        } else {
            model.addAttribute("error", "Username or Email already exists!");
            return "register";
        }
    }

    @GetMapping("/dashboard")
    public String showDashboard(@RequestParam(required = false) String status,
                                @RequestParam(required = false) String year,
                                @RequestParam(defaultValue = "0") int page,
                                HttpSession session, Model model) {

        String user = (String) session.getAttribute("currentUser");
        if (user == null) return "redirect:/login";

        List<Company> list = companyDAO.getFilteredCompanies(status, year, page);
        List<User> teamList = userDAO.getAllUsers();

        model.addAttribute("partners", list);
        model.addAttribute("teamMembers", teamList);
        model.addAttribute("username", user);
        model.addAttribute("userRole", session.getAttribute("userRole"));
        model.addAttribute("currentPage", page);
        return "index";
    }

    @PostMapping("/add")
    public String addPartner(@ModelAttribute Company company) {
        companyDAO.addCompany(company);
        return "redirect:/dashboard";
    }

    // --- DELETE (Only Team Leader) ---
    @PostMapping("/delete/{id}")
    public String deletePartner(@PathVariable int id, HttpSession session) {
        String role = (String) session.getAttribute("userRole");
        if (role == null) return "redirect:/login";

        if ("Team Leader".equals(role)) {
            companyDAO.deleteCompany(id);
        }
        return "redirect:/dashboard";
    }

    // --- TOGGLE STATUS (Per-season, handled by API) ---
    @PostMapping("/toggle-status/{id}")
    public String toggleStatus(@PathVariable int id, HttpSession session) {
        // Per-season unconfirm is now handled via the React frontend + API
        return "redirect:/dashboard";
    }

    // --- CONFIRM WITH PACKAGE (Pop-up Data) (Only Team Leader) ---
    @PostMapping("/confirm-partner")
    public String confirmPartner(@RequestParam int companyId,
                                 @RequestParam String pkgName,
                                 @RequestParam double amount,
                                 @RequestParam String year,
                                 HttpSession session) {
        String role = (String) session.getAttribute("userRole");
        if (role == null || !"Team Leader".equals(role)) {
            return "redirect:/dashboard";
        }

        companyDAO.confirmCompany(companyId, pkgName, amount, year);
        return "redirect:/dashboard";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }
}