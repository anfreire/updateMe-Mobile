package com.updateme
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.PermissionAwareActivity

class AppManagerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var installPromise: Promise? = null
    private val INSTALL_REQUEST_CODE = 1234

    private val packageInstallObserver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val status = intent?.getIntExtra(PackageInstaller.EXTRA_STATUS, PackageInstaller.STATUS_FAILURE)
            when (status) {
                PackageInstaller.STATUS_SUCCESS -> {
                    installPromise?.resolve(true)
                }
                else -> {
                    installPromise?.resolve(false)
                }
            }
            installPromise = null
            context?.unregisterReceiver(this)
        }
    }
    
    override fun getName(): String {
        return "AppManager"
    }

    @ReactMethod
    fun isUnknownSourcesEnabled(promise: Promise) {
        try {
            val enabled = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactApplicationContext.packageManager.canRequestPackageInstalls()
            } else {
                Settings.Secure.getInt(reactApplicationContext.contentResolver, 
                    Settings.Secure.INSTALL_NON_MARKET_APPS) == 1
            }
            promise.resolve(enabled)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }


    @ReactMethod
    fun requestUnknownSourcesPermission(promise: Promise) {
        try {
            permissionPromise = promise
            
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val intent = Intent(
                    Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    Uri.parse("package:${reactApplicationContext.packageName}")
                )
                getCurrentActivity()?.startActivityForResult(intent, UNKNOWN_SOURCES_REQUEST_CODE)
            } else {
                val intent = Intent(Settings.ACTION_SECURITY_SETTINGS)
                getCurrentActivity()?.startActivity(intent)
                // Check the result after returning from settings
                Handler(Looper.getMainLooper()).postDelayed({
                    checkAndResolvePermissionStatus()
                }, 500)
            }
        } catch (e: Exception) {
            promise.resolve("denied")
        }
    }

    private fun checkAndResolvePermissionStatus() {
        try {
            val enabled = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactApplicationContext.packageManager.canRequestPackageInstalls()
            } else {
                Settings.Secure.getInt(reactApplicationContext.contentResolver, 
                    Settings.Secure.INSTALL_NON_MARKET_APPS) == 1
            }
            
            permissionPromise?.resolve(if (enabled) "granted" else "denied")
        } catch (e: Exception) {
            permissionPromise?.resolve("denied")
        }
        permissionPromise = null
    }

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == UNKNOWN_SOURCES_REQUEST_CODE) {
            Handler(Looper.getMainLooper()).postDelayed({
                checkAndResolvePermissionStatus()
            }, 500)
        }
    }

    @ReactMethod
    fun getAppVersion(packageName: String, promise: Promise) {
        try {
            val packageInfo = reactApplicationContext.packageManager.getPackageInfo(packageName, 0)
            promise.resolve(packageInfo.versionName)
        } catch (e: PackageManager.NameNotFoundException) {
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val apps = WritableNativeArray()
            val packages = reactApplicationContext.packageManager.getInstalledPackages(0)
            
            for (packageInfo in packages) {
                val appInfo = WritableNativeMap()
                appInfo.putString("packageName", packageInfo.packageName)
                appInfo.putString("versionName", packageInfo.versionName)
                appInfo.putString("appName", 
                    packageInfo.applicationInfo.loadLabel(reactApplicationContext.packageManager).toString())
                apps.pushMap(appInfo)
            }
            promise.resolve(apps)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun uninstallApp(packageName: String, promise: Promise) {
        try {
            val intent = Intent(Intent.ACTION_DELETE)
            intent.data = Uri.parse("package:$packageName")
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun openApp(packageName: String, promise: Promise) {
        try {
            val intent = reactApplicationContext.packageManager.getLaunchIntentForPackage(packageName)
            if (intent != null) {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                reactApplicationContext.startActivity(intent)
                promise.resolve(true)
            } else {
                promise.reject("ERROR", "App not found or cannot be launched")
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

        @ReactMethod
    fun installApk(apkPath: String, promise: Promise) {
        try {
            val activity = currentActivity ?: throw Exception("Activity is null")
            installPromise = promise

            val intentFilter = IntentFilter(activity.packageName + ".PACKAGE_INSTALLED")
            reactApplicationContext.registerReceiver(packageInstallObserver, intentFilter)

            val apkUri = Uri.parse(apkPath)
            val intent = Intent(Intent.ACTION_VIEW)
            intent.setDataAndType(apkUri, "application/vnd.android.package-archive")
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION

            activity.startActivityForResult(intent, INSTALL_REQUEST_CODE)
        } catch (e: Exception) {
            installPromise?.resolve(false)
            installPromise = null
        }
    }

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == INSTALL_REQUEST_CODE) {
            if (installPromise != null) {
                Handler(Looper.getMainLooper()).postDelayed({
                    installPromise?.resolve(false)
                    installPromise = null
                }, 5000)
            }
        }
    }
}