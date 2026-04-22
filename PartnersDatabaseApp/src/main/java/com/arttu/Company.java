package com.arttu;

public class Company {
    private int companyId;
    private String compName;     // <-- Site-ul cauta asta
    private String compProfile;
    private boolean confirmed;
    private String sponsorshipPackage;
    private double sponsorshipAmount;
    private String year;
    private String assignedUser;
    private String website;
    private int noteCount;
    private java.sql.Timestamp lastContacted;

    public Company() {}



    public String getCompName() { return compName; }
    public void setCompName(String compName) { this.compName = compName; }


    public int getCompanyId() { return companyId; }
    public void setCompanyId(int companyId) { this.companyId = companyId; }

    public String getCompProfile() { return compProfile; }
    public void setCompProfile(String compProfile) { this.compProfile = compProfile; }

    public boolean isConfirmed() { return confirmed; }
    public void setConfirmed(boolean confirmed) { this.confirmed = confirmed; }

    public String getSponsorshipPackage() { return sponsorshipPackage; }
    public void setSponsorshipPackage(String sponsorshipPackage) { this.sponsorshipPackage = sponsorshipPackage; }

    public double getSponsorshipAmount() { return sponsorshipAmount; }
    public void setSponsorshipAmount(double sponsorshipAmount) { this.sponsorshipAmount = sponsorshipAmount; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getAssignedUser() { return assignedUser; }
    public void setAssignedUser(String assignedUser) { this.assignedUser = assignedUser; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public int getNoteCount() { return noteCount; }
    public void setNoteCount(int noteCount) { this.noteCount = noteCount; }

    public java.sql.Timestamp getLastContacted() { return lastContacted; }
    public void setLastContacted(java.sql.Timestamp lastContacted) { this.lastContacted = lastContacted; }
}