"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, X, ArrowLeft, Clock, Filter, Search } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  icon?: React.ReactNode;
  action?: {
    type: string;
    url?: string;
  };
  metadata?: any;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Replace with your actual API call
        // const response = await fetch('/api/notifications');
        // const data = await response.json();
        
        const mockData: Notification[] = [
          {
            id: "1",
            title: "New message from John Doe",
            message: "Hey! Can you review the latest design changes? I've updated the UI components and added new features.",
            time: "2 min ago",
            type: "info",
            read: false,
            metadata: {
              messageId: "123",
              userId: "john-doe",
            },
          },
          {
            id: "2",
            title: "Project 'Dashboard' updated",
            message: "New changes have been pushed to production. The dashboard now includes real-time analytics.",
            time: "1 hour ago",
            type: "success",
            read: false,
            metadata: {
              projectId: "dashboard",
              version: "v2.1.0",
            },
          },
          {
            id: "3",
            title: "Server maintenance",
            message: "Scheduled maintenance tomorrow at 2 AM UTC. The system will be down for approximately 30 minutes.",
            time: "3 hours ago",
            type: "warning",
            read: true,
          },
          {
            id: "4",
            title: "New follower: Jane Smith",
            message: "Jane Smith started following your work. Check out their profile to connect.",
            time: "5 hours ago",
            type: "info",
            read: true,
            metadata: {
              userId: "jane-smith",
            },
          },
          {
            id: "5",
            title: "New comment on your post",
            message: "Sarah commented: 'This is amazing work! Can you share how you achieved this?'",
            time: "1 day ago",
            type: "info",
            read: true,
            metadata: {
              postId: "456",
              userId: "sarah",
            },
          },
        ];
        
        setNotifications(mockData);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      // await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // await fetch('/api/notifications/read-all', { method: 'POST' });
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      // await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Navigate to the notification detail page
    router.push(`/notification/${notification.id}`);
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return true;
  }).filter((notif) => {
    if (!searchTerm) return true;
    return notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           notif.message.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getTypeStyles = (type: string) => {
    const styles = {
      info: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      success: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      warning: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
      error: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    };
    return styles[type as keyof typeof styles] || styles.info;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
         <button
  onClick={() => router.push("/chat")}
  className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
>
  <ArrowLeft className="w-5 h-5" />
</button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Notifications
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {notifications.filter(n => !n.read).length} unread
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Mark all read
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
          {["all", "unread", "read"].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option as any)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                filter === option
                  ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
              No notifications
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {searchTerm ? "No results found for your search" : "You're all caught up!"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`
                p-4 rounded-lg border transition-all cursor-pointer group
                hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700
                ${notification.read
                  ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                  : "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`
                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                    ${getTypeStyles(notification.type)}
                  `}
                >
                  <Bell className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                        {notification.title}
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                        )}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-zinc-500 dark:text-zinc-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notification.time}
                        </span>
                        {!notification.read && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            Unread
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors text-red-500 hover:text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {filteredNotifications.length} notifications
        </p>
      </div>
    </div>
  );
}