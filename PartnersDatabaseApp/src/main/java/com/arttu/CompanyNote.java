package com.arttu;

import java.sql.Timestamp;

public class CompanyNote {
    private int noteId;
    private int companyId;
    private String authorUsername;
    private String noteText;
    private String emailModel;
    private String phoneScript;
    private int satisfactionRating;
    private String season;
    private Timestamp createdAt;

    public CompanyNote() {}

    public int getNoteId() { return noteId; }
    public void setNoteId(int noteId) { this.noteId = noteId; }

    public int getCompanyId() { return companyId; }
    public void setCompanyId(int companyId) { this.companyId = companyId; }

    public String getAuthorUsername() { return authorUsername; }
    public void setAuthorUsername(String authorUsername) { this.authorUsername = authorUsername; }

    public String getNoteText() { return noteText; }
    public void setNoteText(String noteText) { this.noteText = noteText; }

    public String getEmailModel() { return emailModel; }
    public void setEmailModel(String emailModel) { this.emailModel = emailModel; }

    public String getPhoneScript() { return phoneScript; }
    public void setPhoneScript(String phoneScript) { this.phoneScript = phoneScript; }

    public int getSatisfactionRating() { return satisfactionRating; }
    public void setSatisfactionRating(int satisfactionRating) { this.satisfactionRating = satisfactionRating; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }
}
