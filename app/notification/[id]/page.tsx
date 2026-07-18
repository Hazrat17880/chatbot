"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Bell, ArrowLeft, Clock, Check, X, ExternalLink } from "lucide-react";

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
  metadata?: {
    userId?: string;
    projectId?: string;
    messageId?: string;
    [key: string]: any;
  };
}

export default function NotificationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const notificationId = params.id as string;
  
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        // Replace with your actual API call
        // const response = await fetch(`/api/notifications/${notificationId}`);
        // const data = await response.json();
        
        const mockData: Notification[] = [
          {
            id: "1",
            title: "New message from John Doe",
            message: "Hey! Can you review the latest design changes? I've updated the UI components and added new features. Let me know what you think!",
            time: "2024-01-15T10:30:00",
            type: "info",
            read: false,
            metadata: {
              userId: "john-doe",
              messageId: "123",
              email: "john@example.com",
            },
          },
          {
            id: "2",
            title: "Project 'Dashboard' updated",
            message: "New changes have been pushed to production. The dashboard now includes real-time analytics, improved performance, and a new dark mode feature.",
            time: "2024-01-15T09:15:00",
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
            time: "2024-01-14T22:00:00",
            type: "warning",
            read: true,
          },
          {
            id: "4",
            title: "New follower: Jane Smith",
            message: "Jane Smith started following your work. Check out their profile to connect.",
            time: "2024-01-14T18:45:00",
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
            time: "2024-01-14T14:20:00",
            type: "info",
            read: true,
            metadata: {
              postId: "456",
              userId: "sarah",
            },
          },
        ];

        const found = mockData.find(n => n.id === notificationId);
        if (found) {
          setNotification(found);
        } else {
          setError("Notification not found");
        }
      } catch (error) {
        console.error("Failed to fetch notification:", error);
        setError("Failed to load notification");
      } finally {
        setLoading(false);
      }
    };

    if (notificationId) {
      fetchNotification();
    }
  }, [notificationId]);

  const markAsRead = async () => {
    if (!notification) return;
    try {
      // await fetch(`/api/notifications/${notification.id}/read`, { method: 'POST' });
      setNotification({ ...notification, read: true });
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const deleteNotification = async () => {
    if (!notification) return;
    try {
      // await fetch(`/api/notifications/${notification.id}`, { method: 'DELETE' });
      router.push("/notification");
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const getTypeStyles = (type: string) => {
    const styles = {
      info: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      success: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800",
      warning: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
      error: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
    };
    return styles[type as keyof typeof styles] || styles.info;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      info: <Bell className="w-6 h-6" />,
      success: <Check className="w-6 h-6" />,
      warning: <Bell className="w-6 h-6" />,
      error: <X className="w-6 h-6" />,
    };
    return icons[type as keyof typeof icons] || icons.info;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            {error || "Notification not found"}
          </h2>
          <button
            onClick={() => router.push("/notification")}
            className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all notifications →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/notification")}
          className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to notifications</span>
        </button>
        <div className="flex items-center gap-2">
          {!notification.read && (
            <button
              onClick={markAsRead}
              className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
            >
              <Check className="w-4 h-4 inline mr-1" />
              Mark as read
            </button>
          )}
          <button
            onClick={deleteNotification}
            className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/40 transition-colors"
          >
            <X className="w-4 h-4 inline mr-1" />
            Delete
          </button>
        </div>
      </div>

      {/* Notification Card */}
      <div className={`
        rounded-2xl border-2 p-8 transition-all
        ${getTypeStyles(notification.type)}
        ${!notification.read ? "ring-2 ring-blue-400 dark:ring-blue-500" : ""}
      `}>
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`
            flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center
            ${getTypeStyles(notification.type)}
          `}>
            {getTypeIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {notification.title}
              </h1>
              {!notification.read && (
                <span className="flex-shrink-0 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                  Unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(notification.time).toLocaleString()}
              </span>
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs capitalize">
                {notification.type}
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
            {notification.message}
          </p>
        </div>

        {/* Metadata */}
        {notification.metadata && Object.keys(notification.metadata).length > 0 && (
          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
              Additional Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(notification.metadata).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 rounded-lg"
                >
                  <span className="font-medium text-zinc-600 dark:text-zinc-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {notification.action && notification.action.url && (
          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => {
                if (notification.action?.url) {
                  router.push(notification.action.url);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}