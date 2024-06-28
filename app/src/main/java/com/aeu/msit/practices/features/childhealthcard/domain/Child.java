package com.aeu.msit.practices.features.childhealthcard.domain;

public class Child {
    private int id;
    private String name;
    private String childId;
    private String birthday;
    private String fatherName;
    private String motherName;
    private String address;
    private String hospitalName;
    private String hospitalAddress;

    public Child(){

    }

    public Child(int id, String name, String childId, String birthday, String fatherName, String motherName, String address, String hospitalName, String hospitalAddress) {
        this.id = id;
        this.name = name;
        this.childId = childId;
        this.birthday = birthday;
        this.fatherName = fatherName;
        this.motherName = motherName;
        this.address = address;
        this.hospitalName = hospitalName;
        this.hospitalAddress = hospitalAddress;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getChildId() {
        return childId;
    }

    public void setChildId(String childId) {
        this.childId = childId;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public String getFatherName() {
        return fatherName;
    }

    public void setFatherName(String fatherName) {
        this.fatherName = fatherName;
    }

    public String getMotherName() {
        return motherName;
    }

    public void setMotherName(String motherName) {
        this.motherName = motherName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getHospitalAddress() {
        return hospitalAddress;
    }

    public void setHospitalAddress(String hospitalAddress) {
        this.hospitalAddress = hospitalAddress;
    }
}
