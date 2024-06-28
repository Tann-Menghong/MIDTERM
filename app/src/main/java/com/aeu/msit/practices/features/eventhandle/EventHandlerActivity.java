package com.aeu.msit.practices.features.eventhandle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;

import com.aeu.msit.practices.MainActivity;
import com.aeu.msit.practices.R;

public class EventHandlerActivity extends AppCompatActivity {
    String msg = "SecondActivityLog : ";
    Button bButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_handler);
        Log.d(msg, "The onCreate() event");

        getWindow().setStatusBarColor(ContextCompat.getColor(this, R.color.status_bar_color));

        bButton = findViewById(R.id.secondButton);
        bButton.setOnClickListener(v -> {
            Intent i = new Intent(EventHandlerActivity.this, MainActivity.class);
            startActivity(i);
        });
    }

    @Override
    protected void onStart() {
        super.onStart();
        Log.d(msg, "The onStart() event");
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d(msg, "The onResume() event");
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.d(msg, "The onPause() event");
    }

    @Override
    protected void onStop() {
        super.onStop();
        Log.d(msg, "The onStop() event");
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.d(msg, "The onDestroy() event");
    }
}