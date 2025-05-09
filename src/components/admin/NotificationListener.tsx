/* eslint-disable @typescript-eslint/no-explicit-any */
// components/admin/NotificationListener.tsx

"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";


interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  timestamp: Date;
  data: any;
}

export function NotificationListener({ storeId }: { storeId: string }) {
  const { socket, isConnected } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!socket) return;

    // Listen for notifications
    socket.on("new-order", (notification) => {
      console.log("New order received:", notification);
      
      const newNotification = {
        id: `order-${Date.now()}`,
        type: "ORDER_PLACED",
        title: "New Order Received",
        content: `Order #${notification.data.orderNumber} - $${notification.data.total}`,
        timestamp: new Date(notification.timestamp),
        data: notification.data
      };
      
      // Add to notifications list
      setNotifications(prev => [newNotification, ...prev].slice(0, 10));
      setUnreadCount(prev => prev + 1);
      
      // Show toast
      toast.success(newNotification.title, {
        description: newNotification.content,
        action: {
          label: "View",
          onClick: () => router.push(`/admin/${storeId}/orders`)
        }
      });
    });

    // Listen for other notification types
    socket.on("inventory-alert", (notification) => {
      // Similar handling for inventory alerts
      console.log("Inventory alert received:", notification);
      // ...
    });

    // Generic store notification handler
    socket.on("store-notification", (notification) => {
      console.log("Store notification received:", notification);
      
      const newNotification = {
        id: notification.data.id || `notification-${Date.now()}`,
        type: notification.data.type,
        title: getNotificationTitle(notification.data.type),
        content: notification.data.content || getNotificationContent(notification),
        timestamp: new Date(notification.timestamp),
        data: notification.data
      };
      
      setNotifications(prev => [newNotification, ...prev].slice(0, 10));
      setUnreadCount(prev => prev + 1);
      
      toast(newNotification.title, {
        description: newNotification.content
      });
    });

    socket.on("subscription-confirmed", (data) => {
      console.log("Store subscription confirmed:", data);
      // You could add extra state or functionality here
    });

    // Clean up on unmount
    return () => {
      socket.off("new-order");
      socket.off("inventory-alert");
      socket.off("store-notification");
    };
  }, [socket, storeId, router]);

  // Helper functions to format notifications
  function getNotificationTitle(type: string) {
    switch (type) {
      case "ORDER_PLACED": return "New Order Received";
      case "PAYMENT_RECEIVED": return "Payment Received";
      case "LOW_STOCK": return "Low Stock Alert";
      case "ORDER_STATUS_CHANGED": return "Order Status Changed";
      case "NEW_CUSTOMER": return "New Customer Registered";
      case "SYSTEM_ALERT": return "System Alert";
      default: return "New Notification";
    }
  }

  function getNotificationContent(notification: Notification) {
    // Extract relevant info based on notification type
    switch (notification.type) {
      case "ORDER_PLACED":
        return `Order #${notification.data.orderNumber} - $${notification.data.total}`;
      case "LOW_STOCK":
        return `${notification.data.productName} is running low (${notification.data.quantity} left)`;
      default:
        return notification.data.message || "You have a new notification";
    }
  }

  function clearNotifications() {
    setNotifications([]);
    setUnreadCount(0);
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case "ORDER_PLACED": return "🛒";
      case "PAYMENT_RECEIVED": return "💰";
      case "LOW_STOCK": return "⚠️";
      case "ORDER_STATUS_CHANGED": return "📦";
      case "NEW_CUSTOMER": return "👤";
      case "SYSTEM_ALERT": return "🚨";
      default: return "📢";
    }
  }

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <h4 className="font-semibold">Notifications</h4>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearNotifications}
                className="text-xs"
              >
                Clear all
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/admin/${storeId}/notifications`)}
                className="text-xs"
              >
                View all
              </Button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No new notifications
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/admin/${storeId}/notifications`)}
                  >
                    <div className="flex gap-3">
                      <div className="text-xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{notification.title}</h5>
                        <p className="text-sm text-muted-foreground">
                          {notification.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Connection status indicator - only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-muted-foreground">
          <div 
            className={`h-full w-full rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} 
          />
        </div>
      )}
    </div>
  );
}