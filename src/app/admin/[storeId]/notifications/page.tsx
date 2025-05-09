/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { NotificationItem, NotificationsTable } from "./notifications-table";
import { useSocket } from "@/contexts/SocketContext";
import { Notification } from "@prisma/client";

export default function NotificationsPage() {
  const { storeId } = useParams();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  // Fetch notifications on page load
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log(`Fetching from: ${process.env.NEXT_PUBLIC_NOTIFICATION_SERVER_URL}/api/notifications/${storeId}`);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_NOTIFICATION_SERVER_URL}/api/notifications/${storeId}`);
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`Error ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log("Fetched notifications:", data);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [storeId]);

  // Listen for new notifications from socket
  useEffect(() => {
    if (!socket) return;

    // Debug all events
    const debugHandler = (event: string, ...args: any[]) => {
      console.log(`[Socket Debug] Received event: ${event}`, args);
    };
    socket.onAny(debugHandler);

    // Handle store-notification events
    const handleStoreNotification = (eventData: any) => {
      console.log("Store notification received:", eventData);
      
      if (!eventData || !eventData.data) return;
      
      // Extract notification data properly based on the event format
      const notificationData = eventData.data;
      
      // If this is already a full notification object
      if (notificationData.id && notificationData.title && notificationData.content) {
        setNotifications(prev => [notificationData as Notification, ...prev]);
      } else {
        // Otherwise construct a notification from the data
        const newNotification = {
          id: notificationData.id || Math.floor(Math.random() * 10000),
          title: notificationData.title || `New ${notificationData.type || 'Event'}`,
          content: notificationData.content || JSON.stringify(notificationData),
          type: notificationData.type || 'SYSTEM_ALERT',
          priority: notificationData.priority || 'MEDIUM',
          isRead: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          storeId: storeId as string,
        } as Notification;
        
        setNotifications(prev => [newNotification, ...prev]);
      }
    };

    // Listen to both specific events and generic store notification events
    socket.on("store-notification", handleStoreNotification);
    socket.on("new-order", handleStoreNotification);
    socket.on("PRODUCT_CREATED", handleStoreNotification);

    return () => {
      socket.off("store-notification", handleStoreNotification);
      socket.off("new-order", handleStoreNotification);
      socket.off("PRODUCT_CREATED", handleStoreNotification);
      socket.offAny(debugHandler);
    };
  }, [socket, storeId]);

  // Mark notification as read
  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NOTIFICATION_SERVER_URL}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Format notifications for data table
  const formattedNotifications = notifications.map(notification => ({
    id: notification.id,
    title: notification.title,
    content: notification.content,
    type: notification.type,
    priority: notification.priority,
    isRead: notification.isRead,
    createdAt: format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm'),
    data: notification.data
  }));

  return (
    <div className="space-y-4">
      <Heading
        title={`Notifications (${notifications.length})`}
        description="Manage your store notifications"
      />
      <Separator />
      <NotificationsTable 
        data={formattedNotifications as NotificationItem[]} 
        loading={loading}
        onReadClick={markAsRead}
      />
    </div>
  );
}
