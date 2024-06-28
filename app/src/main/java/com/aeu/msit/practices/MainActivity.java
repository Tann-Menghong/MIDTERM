package com.aeu.msit.practices;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;

import com.aeu.msit.practices.features.childhealthcard.presentation.ChildHealthCardActivity;
import com.aeu.msit.practices.features.eventhandle.EventHandlerActivity;
import com.aeu.msit.practices.features.exchangerate.ExchangeRateActivity;
import com.aeu.msit.practices.features.listview.ListViewActivity;

public class MainActivity extends AppCompatActivity {
    String msg = "Practices : ";
    ImageView bHomework1, bHomework2, bHomework3, bHomework4;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Log.d(msg, "The onCreate() event");

        getWindow().setStatusBarColor(ContextCompat.getColor(this, R.color.status_bar_color));

        bHomework1 = findViewById(R.id.mainHomework1);
        bHomework2 = findViewById(R.id.mainHomework2);
        bHomework3 = findViewById(R.id.mainHomework3);
        bHomework4 = findViewById(R.id.mainHomework4);

        bHomework1.setOnClickListener(v -> {
            Intent i = new Intent(MainActivity.this, EventHandlerActivity.class);
            startActivity(i);
        });

        bHomework2.setOnClickListener(v -> {
            Intent i = new Intent(MainActivity.this, ExchangeRateActivity.class);
            startActivity(i);
        });

        bHomework3.setOnClickListener(v -> {
            Intent i = new Intent(MainActivity.this, ListViewActivity.class);
            startActivity(i);
        });

        bHomework4.setOnClickListener(v -> {
            startActivity(new Intent(MainActivity.this, ChildHealthCardActivity.class));
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