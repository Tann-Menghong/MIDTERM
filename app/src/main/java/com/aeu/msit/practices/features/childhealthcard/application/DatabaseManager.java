package com.aeu.msit.practices.features.childhealthcard.application;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import com.aeu.msit.practices.features.childhealthcard.domain.Child;

import java.util.ArrayList;
import java.util.List;

public class DatabaseManager {
    private DatabaseHelper dbHelper;
    private SQLiteDatabase database;

    public DatabaseManager(Context context) {
        dbHelper = new DatabaseHelper(context);
    }

    public void open() {
        database = dbHelper.getWritableDatabase();
    }

    public void close() {
        dbHelper.close();
    }

    // Create
    public void addChild(Child child) {
        ContentValues values = new ContentValues();
        values.put("name", child.getName());
        values.put("childId", child.getChildId());
        values.put("birthday", child.getBirthday());
        values.put("fatherName", child.getFatherName());
        values.put("motherName", child.getMotherName());
        values.put("address", child.getAddress());
        values.put("hospitalName", child.getHospitalName());
        values.put("hospitalAddress", child.getHospitalAddress());

        database.insert("children", null, values);
    }

    // Read
    public Child getChild(int id) {
        Cursor cursor = database.query("children", null, "id=?", new String[]{String.valueOf(id)}, null, null, null);
        if (cursor != null && cursor.moveToFirst()) {
            /*Child child = new Child(
                    cursor.getInt(cursor.getColumnIndex("id")),
                    cursor.getString(cursor.getColumnIndex("name")),
                    cursor.getString(cursor.getColumnIndex("childId")),
                    cursor.getString(cursor.getColumnIndex("birthday")),
                    cursor.getString(cursor.getColumnIndex("fatherName")),
                    cursor.getString(cursor.getColumnIndex("motherName")),
                    cursor.getString(cursor.getColumnIndex("address")),
                    cursor.getString(cursor.getColumnIndex("hospitalName")),
                    cursor.getString(cursor.getColumnIndex("hospitalAddress"))
            );
            cursor.close();
            return child;*/

            int idIndex = cursor.getColumnIndex("id");
            int nameIndex = cursor.getColumnIndex("name");
            int childIdIndex = cursor.getColumnIndex("childId");
            int birthdayIndex = cursor.getColumnIndex("birthday");
            int fatherNameIndex = cursor.getColumnIndex("fatherName");
            int motherNameIndex = cursor.getColumnIndex("motherName");
            int addressIndex = cursor.getColumnIndex("address");
            int hospitalNameIndex = cursor.getColumnIndex("hospitalName");
            int hospitalAddressIndex = cursor.getColumnIndex("hospitalAddress");

            if (idIndex != -1 && nameIndex != -1 && childIdIndex != -1) {
                Child child = new Child(
                        cursor.getInt(idIndex),
                        cursor.getString(nameIndex),
                        cursor.getString(childIdIndex),
                        cursor.getString(birthdayIndex),
                        cursor.getString(fatherNameIndex),
                        cursor.getString(motherNameIndex),
                        cursor.getString(addressIndex),
                        cursor.getString(hospitalNameIndex),
                        cursor.getString(hospitalAddressIndex)
                );
                cursor.close();
                return child;
            }
        }
        return null;
    }

    // Update
    public void updateChild(Child child) {
        ContentValues values = new ContentValues();
        values.put("name", child.getName());
        values.put("childId", child.getChildId());
        values.put("birthday", child.getBirthday());
        values.put("fatherName", child.getFatherName());
        values.put("motherName", child.getMotherName());
        values.put("address", child.getAddress());
        values.put("hospitalName", child.getHospitalName());
        values.put("hospitalAddress", child.getHospitalAddress());

        database.update("children", values, "id=?", new String[]{String.valueOf(child.getId())});
    }

    // Delete
    public void deleteChild(int id) {
        database.delete("children", "id=?", new String[]{String.valueOf(id)});
    }

    // List All Users
    public List<Child> getAllChildren() {
        List<Child> children = new ArrayList<>();
        Cursor cursor = database.rawQuery("SELECT * FROM children", null);
        if (cursor.moveToFirst()) {
            int idIndex = cursor.getColumnIndex("id");
            int nameIndex = cursor.getColumnIndex("name");
            int childIdIndex = cursor.getColumnIndex("childId");
            int birthdayIndex = cursor.getColumnIndex("birthday");
            int fatherNameIndex = cursor.getColumnIndex("fatherName");
            int motherNameIndex = cursor.getColumnIndex("motherName");
            int addressIndex = cursor.getColumnIndex("address");
            int hospitalNameIndex = cursor.getColumnIndex("hospitalName");
            int hospitalAddressIndex = cursor.getColumnIndex("hospitalAddress");
            if (idIndex != -1 && nameIndex != -1 && childIdIndex != -1) {
                do {
                    Child child = new Child(
                            cursor.getInt(idIndex),
                            cursor.getString(nameIndex),
                            cursor.getString(childIdIndex),
                            cursor.getString(birthdayIndex),
                            cursor.getString(fatherNameIndex),
                            cursor.getString(motherNameIndex),
                            cursor.getString(addressIndex),
                            cursor.getString(hospitalNameIndex),
                            cursor.getString(hospitalAddressIndex)
                    );
                    children.add(child);
                } while (cursor.moveToNext());
            }
        }
        cursor.close();
        return children;
    }
}
