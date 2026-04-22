package com.arttu;

public class SponsorshipHistory {
    private int historyId;
    private int companyId;
    private String season;
    private String car;
    private String contactStatus;
    private String packageName;
    private String value;
    private String responsibleTU;
    private String comments;

    public SponsorshipHistory() {}

    public SponsorshipHistory(int historyId, int companyId, String season,
                              String car, String contactStatus, String packageName,
                              String value, String responsibleTU, String comments) {
        this.historyId = historyId;
        this.companyId = companyId;
        this.season = season;
        this.car = car;
        this.contactStatus = contactStatus;
        this.packageName = packageName;
        this.value = value;
        this.responsibleTU = responsibleTU;
        this.comments = comments;
    }

    public SponsorshipHistory(int companyId, String season, String car,
                              String contactStatus, String packageName,
                              String value, String responsibleTU, String comments) {
        this.companyId = companyId;
        this.season = season;
        this.car = car;
        this.contactStatus = contactStatus;
        this.packageName = packageName;
        this.value = value;
        this.responsibleTU = responsibleTU;
        this.comments = comments;
    }

    public int getHistoryId() {
        return historyId;
    }

    public void setHistoryId(int historyId) {
        this.historyId = historyId;
    }

    public int getCompanyId() {
        return companyId;
    }

    public void setCompanyId(int companyId) {
        this.companyId = companyId;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public String getCar() {
        return car;
    }

    public void setCar(String car) {
        this.car = car;
    }

    public String getContactStatus() {
        return contactStatus;
    }

    public void setContactStatus(String contactStatus) {
        this.contactStatus = contactStatus;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getResponsibleTU() {
        return responsibleTU;
    }

    public void setResponsibleTU(String responsibleTU) {
        this.responsibleTU = responsibleTU;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}

