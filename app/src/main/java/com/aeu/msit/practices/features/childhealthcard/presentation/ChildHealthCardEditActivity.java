package com.aeu.msit.practices.features.childhealthcard.presentation;

import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.aeu.msit.practices.R;
import com.aeu.msit.practices.features.childhealthcard.application.DatabaseManager;
import com.aeu.msit.practices.features.childhealthcard.domain.Child;

public class ChildHealthCardEditActivity extends AppCompatActivity {
    private DatabaseManager databaseManager;
    private int id = 0;
    ImageView bBack;
    EditText name, childId, birthday, fatherName, motherName, address, hospitalName, hospitalAddress;
    Button bSave;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_child_health_card_edit);
        getWindow().setStatusBarColor(ContextCompat.getColor(this, R.color.yellow));
        initView();
    }

    private void initView() {
        name = findViewById(R.id.child_health_card_edit_name);
        childId = findViewById(R.id.child_health_card_edit_id);
        birthday = findViewById(R.id.child_health_card_edit_birthday);
        fatherName = findViewById(R.id.child_health_card_edit_father_name);
        motherName = findViewById(R.id.child_health_card_edit_mother_name);
        address = findViewById(R.id.child_health_card_edit_address);
        hospitalName = findViewById(R.id.child_health_card_edit_hospital_name);
        hospitalAddress = findViewById(R.id.child_health_card_edit_hospital_address);
        bBack = findViewById(R.id.child_health_card_edit_back);
        bSave = findViewById(R.id.child_health_card_edit_save);

        databaseManager = new DatabaseManager(this);

        Bundle bundle = getIntent().getExtras();
        id = bundle != null ? bundle.getInt("id") : 0;

        setData();

        bSave.setOnClickListener(v -> {
            if (isValidData()) {
                databaseManager.open();
                // Add a user
                Child child = new Child();
                child.setId(id);
                child.setName(name.getText().toString());
                child.setChildId(childId.getText().toString());
                child.setBirthday(birthday.getText().toString());
                child.setFatherName(fatherName.getText().toString());
                child.setMotherName(motherName.getText().toString());
                child.setAddress(address.getText().toString());
                child.setHospitalName(hospitalName.getText().toString());
                child.setHospitalAddress(hospitalAddress.getText().toString());
                if (id == 0) {
                    databaseManager.addChild(child);
                } else {
                    databaseManager.updateChild(child);
                }

                finish();

                databaseManager.close();
            }
        });

        bBack.setOnClickListener(v -> {
            finish();
        });
    }

    private void setData() {
        Log.d("childLog", "childId: " + id);
        if (id != 0) {
            databaseManager.open();
            // Get a user
            Child child = databaseManager.getChild(id);
            if (child != null) {
                name.setText(child.getName());
                childId.setText(child.getChildId());
                birthday.setText(child.getBirthday());
                fatherName.setText(child.getFatherName());
                motherName.setText(child.getMotherName());
                address.setText(child.getAddress());
                hospitalName.setText(child.getHospitalName());
                hospitalAddress.setText(child.getHospitalAddress());
            }
            databaseManager.close();
        }
    }

    private boolean isValidData() {
        if (name.getText().length() < 2 && name.getText().length() > 100) {
            name.setError("ឈ្មោះកុមារមិនត្រឹមត្រូវ!");
            return false;
        }
        if (childId.getText().length() == 0) {
            childId.setError("សូមបញ្ចូលលេខសម្គាល់កុមារ!");
            return false;
        }
        if (birthday.getText().length() < 8) {
            birthday.setError("សូមបញ្ចូលថ្ងៃខែឆ្នាំកំណើតកុមារ!");
            return false;
        }
        if (fatherName.getText().length() < 2 && fatherName.getText().length() > 100) {
            fatherName.setError("សូមបញ្ចូលឈ្មោះឪពុក!");
            return false;
        }
        if (motherName.getText().length() < 2 && motherName.getText().length() > 100) {
            motherName.setError("សូមបញ្ចូលឈ្មោះម្ដាយ!");
            return false;
        }
        if (address.getText().length() < 2) {
            address.setError("សូមបញ្ចូលអាស័យដ្ឋាន!");
            return false;
        }
        if (hospitalName.getText().length() < 2) {
            hospitalName.setError("សូមបញ្ចូលឈ្មោះមន្ទីពេទ្យ!");
            return false;
        }
        if (hospitalAddress.getText().length() < 2) {
            hospitalAddress.setError("សូមបញ្ចូលអាស័យដ្ឋានមន្ទីពេទ្យ!");
            return false;
        }

        return true;
    }
}