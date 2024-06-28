package com.aeu.msit.practices.features.exchangerate;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.os.Build;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;

import com.aeu.msit.practices.R;

import java.text.DecimalFormat;

public class ExchangeRateActivity extends AppCompatActivity implements AdapterView.OnItemSelectedListener {
    ImageView bBack, imgKHRCurrency, imgUSDCurrency, imgEURCurrency;
    Spinner spCurrency;
    EditText etKHRAmount;
    TextView etUSDAmount, etEURAmount;
    String[] currencyList = { "KHR", "USD", "EUR" };
    int currentPosition = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_exchange_rate);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(ContextCompat.getColor(this, R.color.status_bar_color));
        }

        bBack = findViewById(R.id.excBack);
        imgKHRCurrency = findViewById(R.id.excKHRImage);
        imgUSDCurrency = findViewById(R.id.excUSDImage);
        imgEURCurrency = findViewById(R.id.excEURImage);
        etKHRAmount = findViewById(R.id.excKHRAmount);
        etUSDAmount = findViewById(R.id.excUSDAmount);
        etEURAmount = findViewById(R.id.excEURAmount);
        spCurrency = findViewById(R.id.excSpinCurrency);

        bBack.setOnClickListener(v -> finish());

        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, R.layout.custom_spinner_item /*android.R.layout.simple_spinner_item*/, currencyList);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spCurrency.setAdapter(adapter);
        spCurrency.setOnItemSelectedListener(this);
        etKHRAmount.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                // Called before text changes
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                // Called during text changes
                String currentAmount = s.toString().isEmpty() || s.toString().equals(".") ? "0" : s.toString(); // Get the updated text
                // Perform any actions based on the new text
                DecimalFormat formatCurrency = new DecimalFormat("#.##");
                switch (currentPosition) {
                    case 1:
                        etUSDAmount.setText(formatCurrency.format(Double.parseDouble(currentAmount) * 4073)); //USD to KHR
                        etEURAmount.setText(formatCurrency.format(Double.parseDouble(currentAmount) * 0.93)); //USD to EUR
                        break;
                    case 2:
                        etUSDAmount.setText(formatCurrency.format(Double.parseDouble(currentAmount) * 1.07)); //EUR to USD
                        etEURAmount.setText(formatCurrency.format(Double.parseDouble(currentAmount) * 4375)); //EUR to KHR
                        break;
                    default:
                        etUSDAmount.setText(formatCurrency.format((Double.parseDouble(currentAmount) / 4000) * 0.98)); //KHR to USD
                        etEURAmount.setText(formatCurrency.format((Double.parseDouble(currentAmount) / 4000) * 0.80)); //KHR to EUR
                        break;
                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });

    }

    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
        currentPosition = position;
        switch (position) {
            case 1:
                etKHRAmount.setText("1.00");
                imgKHRCurrency.setImageResource(R.mipmap.united_states_flag_circle);
                etUSDAmount.setText("4073");
                imgUSDCurrency.setImageResource(R.mipmap.cambodia_flag_circle);
                etEURAmount.setText("0.93");
                imgEURCurrency.setImageResource(R.mipmap.united_kingdom_flag_circle);
                break;
            case 2:
                etKHRAmount.setText("1.00");
                imgKHRCurrency.setImageResource(R.mipmap.united_kingdom_flag_circle);
                etUSDAmount.setText("1.07");
                imgUSDCurrency.setImageResource(R.mipmap.united_states_flag_circle);
                etEURAmount.setText("4375");
                imgEURCurrency.setImageResource(R.mipmap.cambodia_flag_circle);
                break;
            default:
                etKHRAmount.setText("4000");
                imgKHRCurrency.setImageResource(R.mipmap.cambodia_flag_circle);
                etUSDAmount.setText("0.98");
                imgUSDCurrency.setImageResource(R.mipmap.united_states_flag_circle);
                etEURAmount.setText("0.8");
                imgEURCurrency.setImageResource(R.mipmap.united_kingdom_flag_circle);
                break;
        }
//        String selectedCurrency = currencyList[position];
//        Toast.makeText(this, "Selected currency: " + selectedCurrency, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onNothingSelected(AdapterView<?> parent) {
        // Handle case when nothing is selected
    }
}