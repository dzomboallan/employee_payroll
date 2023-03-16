package com.example.automatedpayrollwithimagecaptureandgpstracker;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.Map;

public class Login extends AppCompatActivity {

    FirebaseFirestore fStore = FirebaseFirestore.getInstance();
    SharedPreferences sharedPreferences;
    public static int autoSave;
    public static String employee = null;
    public static String usernameTxt = null;
    public static String passwordTxt = null;
    EditText username, password;
    Button submit;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        username = findViewById(R.id.username_et);
        password = findViewById(R.id.password_et);
        submit = findViewById(R.id.loginSubmit_btn);

        sharedPreferences = getSharedPreferences("autoLogin", Context.MODE_PRIVATE);
        int j = sharedPreferences.getInt("key", 0);

        if (j > 0){
            Toast.makeText(this, "User already logged in!", Toast.LENGTH_SHORT).show();
            startActivity(new Intent(getApplicationContext(), UploadDetails.class));
        }

        submit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                usernameTxt = username.getText().toString().trim();
                passwordTxt = password.getText().toString().trim();

                CollectionReference collectionReference = fStore.collection("employees");
                collectionReference.whereEqualTo("Username", usernameTxt).get().addOnSuccessListener(new OnSuccessListener<QuerySnapshot>() {
                    @Override
                    public void onSuccess(QuerySnapshot queryDocumentSnapshots) {
                        for (DocumentSnapshot doc : queryDocumentSnapshots.getDocuments()){
                            Map <String, Object> data = doc.getData();

                            String employeeId = String.valueOf(data.get("EmpId"));
                            String u_name = (String) data.get("Username");
                            String u_password = (String) data.get("Password");

                            if (u_name.equals(usernameTxt) && u_password.equals(passwordTxt)) {
                                employee = employeeId;
                                Intent loginIntent = new Intent(Login.this, UploadDetails.class);
                                startActivity(loginIntent);
                                return;
                            }else if ((!u_name.equals(usernameTxt) && usernameTxt.length() > 0) || (!u_password.equals(passwordTxt) && passwordTxt.length() > 0)){
                                Toast.makeText(Login.this, "Wrong username or password!", Toast.LENGTH_SHORT).show();
                                username.setText("");
                                password.setText("");
                                return;
                            }
                            if (TextUtils.isEmpty(usernameTxt)){
                                username.setError("Username is required");
                            }
                            if (TextUtils.isEmpty(passwordTxt)){
                                password.setError("password is required");
                                return;
                            }
                        }
                    }
                });
                autoSave = 1;
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.putInt("key", autoSave);
                editor.putString("empid",employee);
                editor.apply();
            }
        });
    }

}