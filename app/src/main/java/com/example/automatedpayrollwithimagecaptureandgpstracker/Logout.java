package com.example.automatedpayrollwithimagecaptureandgpstracker;

import static com.example.automatedpayrollwithimagecaptureandgpstracker.Login.employee;
import static com.example.automatedpayrollwithimagecaptureandgpstracker.UploadDetails.address;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;


public class Logout extends AppCompatActivity implements View.OnClickListener{

    SharedPreferences sharedPreferences;
    Button logout;
    TextView showLocation, showId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_logout);

        logout = findViewById(R.id.logout_btn);
        showId = findViewById(R.id.logoutId_tv);
        showLocation = findViewById(R.id.loc_tv);

        showId.setText(employee);
        showLocation.setText(address);
        sharedPreferences = getSharedPreferences("autoLogin", Context.MODE_PRIVATE);

        logout.setOnClickListener(this);
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()){
            case R.id.logout_btn:{
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.putInt("key", 0);
                editor.apply();

                Toast.makeText(this, "User logged out!", Toast.LENGTH_SHORT).show();

                startActivity(new Intent(Logout.this, Login.class));
                finish();
            }break;
        }
    }
}