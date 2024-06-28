package com.aeu.msit.practices.features.childhealthcard.presentation;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.aeu.msit.practices.R;
import com.aeu.msit.practices.features.childhealthcard.application.DatabaseManager;
import com.aeu.msit.practices.features.childhealthcard.domain.Child;
import com.aeu.msit.practices.features.childhealthcard.domain.ChildAdapter;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.List;

public class ChildHealthCardActivity extends AppCompatActivity implements ChildAdapter.OnItemButtonClickListener {
    private DatabaseManager databaseManager;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_child_health_card);
        getWindow().setStatusBarColor(ContextCompat.getColor(this, R.color.yellow));
        initView();
    }

    @Override
    protected void onResume() {
        super.onResume();
        initView();
    }

    private void initView() {
        ImageView bBack = findViewById(R.id.child_health_card_back);
        FloatingActionButton bCreate = findViewById(R.id.child_health_card_add);

        databaseManager = new DatabaseManager(this);
        databaseManager.open();

        // List all users
        List<Child> children = databaseManager.getAllChildren();
        populateListView(children);

        databaseManager.close();

        bCreate.setOnClickListener(v -> {
            startActivity(new Intent(ChildHealthCardActivity.this, ChildHealthCardEditActivity.class));
        });

        bBack.setOnClickListener(v -> {
            finish();
        });
    }

    private void populateListView(List<Child> items) {
        if (items != null) {
            ChildAdapter adapter = new ChildAdapter(this, items, this);
            ListView listView = findViewById(R.id.child_health_card_lv);
            listView.setAdapter(adapter);
        }
    }

    @Override
    public void onButtonEditClick(int id) {
        Intent i = new Intent(ChildHealthCardActivity.this, ChildHealthCardEditActivity.class);
        i.putExtra("id", id);
        startActivity(i);
    }

    @Override
    public void onButtonDeleteClick(int id) {
        databaseManager.open();
        databaseManager.deleteChild(id);
        databaseManager.close();
        Toast.makeText(getApplicationContext(), "Delete successfully", Toast.LENGTH_SHORT).show();
        initView();
    }
}