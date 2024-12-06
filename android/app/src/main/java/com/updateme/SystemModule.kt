package com.updateme
import androidx.activity.ComponentActivity
import android.app.Activity;
import android.os.Build;
import android.window.OnBackInvokedDispatcher;
import android.window.OnBackInvokedCallback;
import android.view.KeyEvent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ActivityEventListener
import android.content.Intent

class SystemModule(reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private var onBackInvokedCallback: OnBackInvokedCallback? = null

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String = "System"

    @ReactMethod
    fun simulateBackPress() {
        currentActivity?.runOnUiThread {
            if (Build.VERSION.SDK_INT >= 33) {
               currentActivity?.let { activity ->
                    @Suppress("DEPRECATION")
                    activity.onBackPressed()
                }
            } else {
                @Suppress("DEPRECATION")
                currentActivity?.onBackPressed()
            }
        }
    }

    override fun onActivityResult(
        activity: Activity?,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        // Implement if needed
    }

    override fun onNewIntent(intent: Intent?) {
        // Implement if needed
    }
}