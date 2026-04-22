package com.arttu;

import java.sql.Date;

public class SponsorshipPackage {
    private int packageId;
    private int companyId;
    private String season;
    private String packageName;
    private String car;
    private double ronValue;
    private double eurValue;
    private String productValue;
    private double totalEstimatedEur;
    private Date signingDate;
    private String finalDetails;

    public SponsorshipPackage() {}

    public SponsorshipPackage(int packageId, int companyId, String season,
                              String packageName, String car, double ronValue,
                              double eurValue, String productValue,
                              double totalEstimatedEur, Date signingDate,
                              String finalDetails) {
        this.packageId = packageId;
        this.companyId = companyId;
        this.season = season;
        this.packageName = packageName;
        this.car = car;
        this.ronValue = ronValue;
        this.eurValue = eurValue;
        this.productValue = productValue;
        this.totalEstimatedEur = totalEstimatedEur;
        this.signingDate = signingDate;
        this.finalDetails = finalDetails;
    }

    public SponsorshipPackage(int companyId, String season, String packageName,
                              String car, double ronValue, double eurValue,
                              String productValue, double totalEstimatedEur,
                              Date signingDate, String finalDetails) {
        this.companyId = companyId;
        this.season = season;
        this.packageName = packageName;
        this.car = car;
        this.ronValue = ronValue;
        this.eurValue = eurValue;
        this.productValue = productValue;
        this.totalEstimatedEur = totalEstimatedEur;
        this.signingDate = signingDate;
        this.finalDetails = finalDetails;
    }

    public int getPackageId() {
        return packageId;
    }

    public void setPackageId(int packageId) {
        this.packageId = packageId;
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

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getCar() {
        return car;
    }

    public void setCar(String car) {
        this.car = car;
    }

    public double getRonValue() {
        return ronValue;
    }

    public void setRonValue(double ronValue) {
        this.ronValue = ronValue;
    }

    public double getEurValue() {
        return eurValue;
    }

    public void setEurValue(double eurValue) {
        this.eurValue = eurValue;
    }

    public String getProductValue() {
        return productValue;
    }

    public void setProductValue(String productValue) {
        this.productValue = productValue;
    }

    public double getTotalEstimatedEur() {
        return totalEstimatedEur;
    }

    public void setTotalEstimatedEur(double totalEstimatedEur) {
        this.totalEstimatedEur = totalEstimatedEur;
    }

    public Date getSigningDate() {
        return signingDate;
    }

    public void setSigningDate(Date signingDate) {
        this.signingDate = signingDate;
    }

    public String getFinalDetails() {
        return finalDetails;
    }

    public void setFinalDetails(String finalDetails) {
        this.finalDetails = finalDetails;
    }
}

