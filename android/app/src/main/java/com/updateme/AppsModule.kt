package com.updateme

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableNativeArray

class AppsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "AppsModule"
    }

    @ReactMethod
    fun checkUnknownSource(promise: Promise) {
        try {
            val canInstall: Boolean
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                val pm = reactApplicationContext.packageManager
                canInstall = pm.canRequestPackageInstalls()
            } else {
                canInstall = true
            }
            promise.resolve(canInstall)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    @ReactMethod
    fun requestUnknownSource() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            val intent =
                android.content.Intent(
                    android.provider.Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    android.net.Uri.parse("package:" + reactApplicationContext.packageName)
                )
            intent.flags = android.content.Intent.FLAG_ACTIVITY_NEW_TASK
            reactApplicationContext.startActivity(intent)
        }
    }


    @ReactMethod
    fun isAppInstalled(packageName: String, promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            pm.getPackageInfo(packageName, 0)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun getAllApps(promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val packages = pm.getInstalledPackages(0)
            val result = WritableNativeArray()
            for (packageInfo in packages) {
                // add the package name to the list
                result.pushString(packageInfo.packageName)
            }
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }

    @ReactMethod
    fun getAppVersion(packageName: String, promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val packageInfo = pm.getPackageInfo(packageName, 0)
            promise.resolve(packageInfo.versionName)
        } catch (e: Exception) {
            promise.resolve(null)
        }
    }

    @ReactMethod
    fun openApp(packageName: String) {
        val intent = reactApplicationContext.packageManager.getLaunchIntentForPackage(packageName)
        if (intent != null) {
            intent.flags = android.content.Intent.FLAG_ACTIVITY_NEW_TASK
            reactApplicationContext.startActivity(intent)
        }
    }

    @ReactMethod
    fun uninstallApp(packageName: String) {
        val intent = android.content.Intent(android.content.Intent.ACTION_DELETE)
        intent.data = android.net.Uri.parse("package:$packageName")
        intent.flags = android.content.Intent.FLAG_ACTIVITY_NEW_TASK
        reactApplicationContext.startActivity(intent)
    }

}
