package com.updateme

import android.app.Activity
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageInstaller
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import com.facebook.react.bridge.*

class AppManagerModule(reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext), ActivityEventListener {
    private var installPromise: Promise? = null
    private var permissionPromise: Promise? = null
    private var uninstallPromise: Promise? = null
    private var currentUninstallPackage: String? = null
    private var sessionId: Int = -1
    private val INSTALL_REQUEST_CODE = 1234
    private val UNINSTALL_REQUEST_CODE = 3456
    private val UNKNOWN_SOURCES_REQUEST_CODE = 2345
    private val INSTALL_ACTION = "${reactApplicationContext.packageName}.INSTALL_COMPLETE"

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String = "AppManager"

    private fun checkAndResolvePermissionStatus() {
        try {
            val enabled = reactApplicationContext.packageManager.canRequestPackageInstalls()
            permissionPromise?.resolve(if (enabled) "granted" else "denied")
        } catch (e: Exception) {
            permissionPromise?.resolve("denied")
        }
        permissionPromise = null
    }

    override fun onActivityResult(
            activity: Activity?,
            requestCode: Int,
            resultCode: Int,
            data: Intent?
    ) {
        when (requestCode) {
            INSTALL_REQUEST_CODE -> {
                when (resultCode) {
                    Activity.RESULT_CANCELED -> {
                        installPromise?.reject("INSTALL_FAILED", "User cancelled installation")
                        cleanupInstallation()
                    }
                    else -> {
                        if (resultCode != Activity.RESULT_OK) {
                            installPromise?.reject("INSTALL_FAILED", "Unknown installation error")
                            cleanupInstallation()
                        }
                    }
                }
            }
            UNINSTALL_REQUEST_CODE -> {
                currentUninstallPackage?.let { packageName ->
                    try {
                        reactApplicationContext.packageManager.getPackageInfo(packageName, 0)
                        uninstallPromise?.resolve(false)
                    } catch (e: PackageManager.NameNotFoundException) {
                        uninstallPromise?.resolve(true)
                    }
                }
                cleanupUninstall()
            }
            UNKNOWN_SOURCES_REQUEST_CODE -> {
                Handler(Looper.getMainLooper())
                        .postDelayed({ checkAndResolvePermissionStatus() }, 500)
            }
        }
    }

    private val installReceiver =
            object : BroadcastReceiver() {
                override fun onReceive(context: Context, intent: Intent) {
                    if (intent.action == INSTALL_ACTION) {
                        val status =
                                intent.getIntExtra(
                                        PackageInstaller.EXTRA_STATUS,
                                        PackageInstaller.STATUS_FAILURE
                                )
                        val message = intent.getStringExtra(PackageInstaller.EXTRA_STATUS_MESSAGE)

                        when (status) {
                            PackageInstaller.STATUS_SUCCESS -> {
                                installPromise?.resolve(true)
                                cleanupInstallation()
                            }
                            PackageInstaller.STATUS_PENDING_USER_ACTION -> {
                                val confirmIntent =
                                        intent.getParcelableExtra<Intent>(Intent.EXTRA_INTENT)
                                if (confirmIntent != null) {
                                    currentActivity?.startActivityForResult(
                                            confirmIntent,
                                            INSTALL_REQUEST_CODE
                                    )
                                } else {
                                    installPromise?.reject(
                                            "INSTALL_FAILED",
                                            "Failed to show install prompt"
                                    )
                                    cleanupInstallation()
                                }
                            }
                            else -> {
                                val errorMessage =
                                        when (status) {
                                            PackageInstaller.STATUS_FAILURE_ABORTED ->
                                                    "Installation aborted"
                                            PackageInstaller.STATUS_FAILURE_BLOCKED ->
                                                    "Installation blocked"
                                            PackageInstaller.STATUS_FAILURE_CONFLICT ->
                                                    "Package conflicts with an existing package"
                                            PackageInstaller.STATUS_FAILURE_INCOMPATIBLE ->
                                                    "Package is incompatible with this device"
                                            PackageInstaller.STATUS_FAILURE_INVALID -> "Invalid APK"
                                            PackageInstaller.STATUS_FAILURE_STORAGE ->
                                                    "Not enough storage space"
                                            else -> message
                                                            ?: "Unknown installation error ($status)"
                                        }
                                installPromise?.reject("INSTALL_FAILED", errorMessage)
                                cleanupInstallation()
                            }
                        }
                    }
                }
            }

    private fun cleanupInstallation() {
        try {
            reactApplicationContext.unregisterReceiver(installReceiver)
        } catch (e: IllegalArgumentException) {}
        installPromise = null
    }

    @ReactMethod
    fun isUnknownSourcesEnabled(promise: Promise) {
        try {
            val enabled = reactApplicationContext.packageManager.canRequestPackageInstalls()
            promise.resolve(enabled)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun requestUnknownSourcesPermission(promise: Promise) {
        try {
            permissionPromise = promise
            val intent =
                    Intent(
                            Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                            Uri.parse("package:${reactApplicationContext.packageName}")
                    )
            getCurrentActivity()?.startActivityForResult(intent, UNKNOWN_SOURCES_REQUEST_CODE)
        } catch (e: Exception) {
            promise.resolve("denied")
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
                appInfo.putString(
                        "appName",
                        packageInfo
                                .applicationInfo
                                ?.loadLabel(reactApplicationContext.packageManager)
                                ?.toString()
                )
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
            val activity = currentActivity ?: throw Exception("Activity is null")
            uninstallPromise = promise
            currentUninstallPackage = packageName

            val intent =
                    Intent(Intent.ACTION_DELETE).apply { data = Uri.parse("package:$packageName") }
            activity.startActivityForResult(intent, UNINSTALL_REQUEST_CODE)
        } catch (e: Exception) {
            uninstallPromise?.reject("ERROR", e.message)
            cleanupUninstall()
        }
    }

    private fun cleanupUninstall() {
        uninstallPromise = null
        currentUninstallPackage = null
    }

    @ReactMethod
    fun openApp(packageName: String, promise: Promise) {
        try {
            val intent =
                    reactApplicationContext.packageManager.getLaunchIntentForPackage(packageName)
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

            if (!reactApplicationContext.packageManager.canRequestPackageInstalls()) {
                throw Exception("Install from unknown sources permission not granted")
            }

            val intentFilter = IntentFilter(INSTALL_ACTION)
            reactApplicationContext.registerReceiver(
                    installReceiver,
                    intentFilter,
                    Context.RECEIVER_EXPORTED
            )

            val uri = Uri.parse(apkPath)
            if (!uri.scheme.equals("content") && !uri.scheme.equals("file")) {
                throw Exception("Invalid URI scheme: ${uri.scheme}. Must be content:// or file://")
            }

            val installer = reactApplicationContext.packageManager.packageInstaller
            val params =
                    PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL)
                            .apply { setInstallReason(PackageManager.INSTALL_REASON_USER) }

            sessionId = installer.createSession(params)
            val session = installer.openSession(sessionId)

            reactApplicationContext.contentResolver.openInputStream(uri)?.use { apkStream ->
                session.openWrite("APKInstall", 0, -1).use { sessionStream ->
                    apkStream.copyTo(sessionStream)
                    session.fsync(sessionStream)
                }

                val intent =
                        Intent(INSTALL_ACTION).apply {
                            setPackage(reactApplicationContext.packageName)
                        }

                val pendingIntent =
                        PendingIntent.getBroadcast(
                                activity,
                                sessionId,
                                intent,
                                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
                        )

                session.commit(pendingIntent.intentSender)
                session.close()
            }
        } catch (e: Exception) {
            installPromise?.reject(
                    "INSTALL_ERROR",
                    "Installation failed: ${e.message ?: "Unknown error"}"
            )
            cleanupInstallation()
        }
    }

    override fun onNewIntent(intent: Intent?) {}
}
