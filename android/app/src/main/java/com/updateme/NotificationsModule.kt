package com.updateme

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableNativeArray

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat



class NotificationsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "NotificationsModule"
    }

    @ReactMethod
    fun createChannel(channelId: String, channelName: String, description: String, promise: Promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val existingChannel = notificationManager.getNotificationChannel(channelId)
            if (existingChannel == null) {
                // Channel does not exist, create a new one
                val channel = NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_DEFAULT).apply {
                    this.description = description
                }
                notificationManager.createNotificationChannel(channel)
                promise.resolve(null) // Resolve promise indicating channel was created
            } else {
                // Channel already exists, no need to create a new one
                promise.resolve(null) // Resolve promise indicating operation was successful but no new channel was created
            }
        } else {
            promise.resolve(null)
        }
    }


    @ReactMethod
    fun sendNotification(channelId: String, title: String, message: String, promise: Promise) {
        try {
            val notificationBuilder = NotificationCompat.Builder(reactApplicationContext, channelId)
                .setContentTitle(title)
                .setContentText(message)
                .setSmallIcon(R.mipmap.ic_small_icon)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)

            val notificationManager = reactApplicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val notificationId = System.currentTimeMillis().toInt()
            notificationManager.notify(notificationId, notificationBuilder.build())
            promise.resolve(notificationId)
        } catch (e: Exception) {
            promise.reject("NOTIFICATION_ERROR", e.message)
        }
    }
}
