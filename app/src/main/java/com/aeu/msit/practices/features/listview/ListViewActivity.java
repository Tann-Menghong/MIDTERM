package com.aeu.msit.practices.features.listview;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.aeu.msit.practices.R;

public class ListViewActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list_view);
        getWindow().setStatusBarColor(ContextCompat.getColor(this, R.color.status_bar_color));

        ListView listView = findViewById(R.id.hw3ListView);
        ImageView back = findViewById(R.id.hw3Back);

        String[] listSubject = {
                "C Programming",
                "C++ Programming",
                "C# Programming",
                "Java Programming",
                "JavaScript",
                "HTML",
                "CSS",
        };

        ArrayAdapter<String> adapter = new ArrayAdapter<>(
                this,
                android.R.layout.simple_list_item_1,
                listSubject
        );
        listView.setAdapter(adapter);

        listView.setOnItemClickListener((parent, view, position, id) -> Toast.makeText(ListViewActivity.this, listSubject[position], Toast.LENGTH_SHORT).show());

        back.setOnClickListener(v -> finish());
    }
}