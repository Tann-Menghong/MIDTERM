package com.aeu.msit.practices.features.childhealthcard.domain;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.aeu.msit.practices.R;

import java.util.List;

public class ChildAdapter extends ArrayAdapter<Child> {
    private Context context;
    private List<Child> items;
    private OnItemButtonClickListener listener;
    public ChildAdapter(Context context, List<Child> items, OnItemButtonClickListener listener) {
        super(context, 0, items);
        this.context = context;
        this.items = items;
        this.listener = listener;
    }

    public interface OnItemButtonClickListener {
        void onButtonEditClick(int id);
        void onButtonDeleteClick(int id);
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        if (convertView == null) {
            convertView = LayoutInflater.from(context).inflate(R.layout.children_list, parent, false);
        }

        Child item = items.get(position);

        TextView name = convertView.findViewById(R.id.children_list_name);
        TextView childId = convertView.findViewById(R.id.children_list_child_id);
        TextView birthday = convertView.findViewById(R.id.children_list_birthday);
        ImageView bEdit = convertView.findViewById(R.id.children_list_edit);
        ImageView bDelete = convertView.findViewById(R.id.children_list_delete);

        name.setText(item.getName());
        childId.setText(item.getChildId());
        birthday.setText(item.getBirthday());

        bEdit.setOnClickListener(v -> {
            if (listener != null) {
                listener.onButtonEditClick(item.getId());
            }
        });

        bDelete.setOnClickListener(v -> {
            if (listener != null) {
                listener.onButtonDeleteClick(item.getId());
            }
        });

        return convertView;
    }
}
