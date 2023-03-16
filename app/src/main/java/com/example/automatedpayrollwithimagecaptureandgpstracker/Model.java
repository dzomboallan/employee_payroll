package com.example.automatedpayrollwithimagecaptureandgpstracker;

import com.google.firebase.Timestamp;

public class Model {

    private String empId;
    private String imageUrl;
    private Timestamp date;
    private float latitude;
    private float longitude;

    public Model(){}

    public Model(String empId, String imageUrl, Timestamp date, float latitude, float longitude){
        this.empId = empId;
        this.imageUrl = imageUrl;
        this.date = date;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Timestamp getDate(){return date;}

    public void setDate(Timestamp date){this.date = date;}

    public float getLatitude() {
        return latitude;
    }

    public void setLatitude(float latitude) {
        this.latitude = latitude;
    }

    public float getLongitude() {
        return longitude;
    }

    public void setLongitude(float longitude) {
        this.longitude = longitude;
    }


}
