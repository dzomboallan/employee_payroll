package com.example.automatedpayrollwithimagecaptureandgpstracker;

import static com.example.automatedpayrollwithimagecaptureandgpstracker.Login.autoSave;
import static com.example.automatedpayrollwithimagecaptureandgpstracker.Login.employee;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.annotation.SuppressLint;
import android.content.ContentResolver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.provider.Settings;
import android.view.View;
import android.webkit.MimeTypeMap;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.firebase.Timestamp;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.OnProgressListener;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import android.Manifest;

public class UploadDetails extends AppCompatActivity implements View.OnClickListener, LocationListener {

    private static final  int CAPTURE_CODE = 1081;
    private static final int PERMISSION_CODE = 1234;
    FirebaseFirestore db = FirebaseFirestore.getInstance();
    StorageReference reference = FirebaseStorage.getInstance().getReference();
    SharedPreferences sharedPreferences;
    Uri image_uri;
    Timestamp sdf;
    float lat;
    float lon;
    public static String address;
    Button getLocation, uploadDetails;
    FloatingActionButton forwardBtn;
    TextView empId, locationTv;
    ImageView imageView;
    ProgressBar progressBar;
    LocationManager locationManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_upload_details);

        getLocation = findViewById(R.id.getLocation_btn);
        uploadDetails = findViewById(R.id.uploadDetails_btn);
        forwardBtn = findViewById(R.id.uploadForward_btn);
        empId = findViewById(R.id.Id_tv);
        locationTv = findViewById(R.id.location_tv);
        imageView = findViewById(R.id.showImage_iv);
        progressBar = findViewById(R.id.progressBar);

        progressBar.setVisibility(View.INVISIBLE);

        sharedPreferences = getSharedPreferences("autoLogin", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putInt("key", autoSave);
        editor.putString("empid", employee);
        editor.apply();

        if (autoSave == 1){
            empId.setText(employee);
        }

        Date date = new Date();
        sdf = new Timestamp(date);


        getLocation.setOnClickListener(this);
        uploadDetails.setOnClickListener(this);
        forwardBtn.setOnClickListener(this);
        imageView.setOnClickListener(this);

        // Runtime permission
        if (ContextCompat.checkSelfPermission(UploadDetails.this, Manifest.permission.ACCESS_FINE_LOCATION)
        != PackageManager.PERMISSION_GRANTED){
            ActivityCompat.requestPermissions(UploadDetails.this, new String[]{
                    Manifest.permission.ACCESS_FINE_LOCATION
            }, 200);
        }
        if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_DENIED){
                String[] permission = {Manifest.permission.CAMERA};
                requestPermissions(permission, PERMISSION_CODE);
        }

    }

    @SuppressLint("MissingSuperCall")
    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        if (requestCode == CAPTURE_CODE){
            Bitmap photo = (Bitmap) data.getExtras().get("data");
            imageView.setImageBitmap(photo);
            Bitmap bitmap = ((BitmapDrawable) imageView.getDrawable()).getBitmap();
            ByteArrayOutputStream bytes = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, bytes);
            String path = MediaStore.Images.Media.insertImage(getContentResolver(), bitmap, "Title", null);
            image_uri = Uri.parse(path);
        }
    }

    private void uploadToFirebase(String id, Uri uri, Timestamp date, float latitude, float longitude){
        StorageReference fileRef = reference.child(System.currentTimeMillis() + "." + getFileExtension(uri));
        fileRef.putFile(uri).addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
            @Override
            public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                fileRef.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
                    @Override
                    public void onSuccess(Uri uri) {
                        Map<String, Object> update = new HashMap<>();
                        update.put("date", date);
                        update.put("empId", id);
                        update.put("image_url", uri);
                        update.put("latitude", latitude);
                        update.put("longitude", longitude);

                        db.collection("location_image_logs")
                                .document()
                                .set(update).addOnSuccessListener(new OnSuccessListener<Void>() {
                                    @Override
                                    public void onSuccess(Void unused) {
                                    }
                                });
                        progressBar.setVisibility(View.INVISIBLE);
                        Toast.makeText(UploadDetails.this, "Upload successful", Toast.LENGTH_SHORT).show();
                        imageView.setImageResource(R.drawable.ic_baseline_add_photo_alternate_24);
                        locationTv.setText("Current Location");
                    }
                });
            }
        }).addOnProgressListener(new OnProgressListener<UploadTask.TaskSnapshot>() {
            @Override
            public void onProgress(@NonNull UploadTask.TaskSnapshot snapshot) {
                progressBar.setVisibility(View.VISIBLE);
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                progressBar.setVisibility(View.INVISIBLE);
                Toast.makeText(UploadDetails.this, "Upload failed", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private String getFileExtension(Uri mUri){
        ContentResolver cr = getContentResolver();
        MimeTypeMap mime = MimeTypeMap.getSingleton();
        return mime.getExtensionFromMimeType(cr.getType(mUri));
    }

    @SuppressLint("MissingPermission")
    private void getLocation() {
        try {
            locationManager = (LocationManager) getApplicationContext().getSystemService(LOCATION_SERVICE);
            if (!locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)){
                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                builder.setTitle("Location Service Not Enabled");
                builder.setMessage("Please enable location service on your device.");
                builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                        startActivity(intent);
                    }
                });
                builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        Toast.makeText(UploadDetails.this, "Permission denied!", Toast.LENGTH_SHORT).show();
                    }
                });
                AlertDialog dialog = builder.create();
                dialog.show();
            }else {
                locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 5, UploadDetails.this);
            }
        }catch(Exception e){
            e.printStackTrace();
        }
    }

    @Override
    public void onLocationChanged(@NonNull Location location) {
        Toast.makeText(this, ""+location.getLatitude()+","+location.getLongitude(), Toast.LENGTH_SHORT).show();
        lat = (float) location.getLatitude();
        lon = (float) location.getLongitude();
        try {
            Geocoder geocoder = new Geocoder(UploadDetails.this, Locale.getDefault());
            List<Address> addresses = geocoder.getFromLocation(location.getLatitude(), location.getLongitude(), 1);
            address = addresses.get(0).getAddressLine(0);

            locationTv.setText(address);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {
        LocationListener.super.onStatusChanged(provider, status, extras);
    }

    @Override
    public void onProviderEnabled(@NonNull String provider) {
        LocationListener.super.onProviderEnabled(provider);
    }

    @Override
    public void onProviderDisabled(@NonNull String provider) {
        LocationListener.super.onProviderDisabled(provider);
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()){
            case R.id.showImage_iv:{
                Intent camera_intent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
                startActivityForResult(camera_intent, CAPTURE_CODE);
            }break;
            case R.id.getLocation_btn:{
                getLocation();
            }break;
            case R.id.uploadDetails_btn:{
                if (image_uri != null || locationTv.getText().toString().isEmpty()){
                    uploadToFirebase(employee, image_uri, sdf, lat, lon);
                }else{
                    Toast.makeText(this, "Please capture image and get location to upload", Toast.LENGTH_SHORT).show();
                }
            }break;
            case R.id.uploadForward_btn:{
                Intent forwardIntent = new Intent(UploadDetails.this, Logout.class);
                startActivity(forwardIntent);
                finish();
            }break;
        }
    }
}