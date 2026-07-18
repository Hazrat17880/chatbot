"use client";

import { Bell, X, Check, AlertCircle, Mail, User, Settings, ExternalLink } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// Types for notifications
type NotificationType = "info" | "success" | "warning" | "error";
type NotificationAction = "navigate" | "modal" | "toast" | "none";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  read: boolean;
  icon?: React.ReactNode;
  action?: {
    type: NotificationAction;
    url?: string;
    modal?: string;
    callback?: () => void;
  };
  metadata?: {
    userId?: string;
    projectId?: string;
    messageId?: string;
    [key: string]: any;
  };
}

export function HeaderActions() {
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New message from John Doe",
      message: "Hey! Can you review the latest design changes?",
      time: "2 min ago",
      type: "info",
      read: false,
      icon: <Mail className="w-4 h-4" />,
      metadata: {
        messageId: "123",
        userId: "john-doe",
      },
    },
    {
      id: "2",
      title: "Project 'Dashboard' updated",
      message: "New changes have been pushed to production",
      time: "1 hour ago",
      type: "success",
      read: false,
      icon: <Check className="w-4 h-4" />,
      metadata: {
        projectId: "dashboard",
        version: "v2.1.0",
      },
    },
    {
      id: "3",
      title: "Server maintenance",
      message: "Scheduled maintenance tomorrow at 2 AM UTC",
      time: "3 hours ago",
      type: "warning",
      read: true,
      icon: <AlertCircle className="w-4 h-4" />,
      action: {
        type: "modal",
        modal: "maintenance-details",
      },
    },
    {
      id: "4",
      title: "New follower: Jane Smith",
      message: "Jane Smith started following your work",
      time: "5 hours ago",
      type: "info",
      read: true,
      icon: <User className="w-4 h-4" />,
      metadata: {
        userId: "jane-smith",
      },
    },
    {
      id: "5",
      title: "New comment on your post",
      message: "Sarah commented: 'This is amazing work!'",
      time: "1 day ago",
      type: "info",
      read: true,
      icon: <ExternalLink className="w-4 h-4" />,
      metadata: {
        postId: "456",
        userId: "sarah",
      },
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle notification click - ALWAYS goes to notification detail page
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);

    // Close dropdown
    setIsNotificationOpen(false);

    // Always go to the notification detail page with the ID
    router.push(`/notification/${notification.id}`);
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  // View all notifications
  const viewAllNotifications = () => {
    setIsNotificationOpen(false);
    router.push("/notification");
  };

  // Get notification type styles
  const getTypeStyles = (type: NotificationType) => {
    const styles = {
      info: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      success: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      warning: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
      error: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    };
    return styles[type];
  };

  return (
    <>
      <ThemeToggle />

      <div className="relative" ref={dropdownRef}>
        <button
          className="relative p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setIsNotificationOpen(!isNotificationOpen);
          }}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {isNotificationOpen && (
          <div className="absolute right-0 mt-2 w-[380px] max-w-[calc(100vw-2rem)] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Bell className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-3" />
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    No notifications
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`
                      flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors group
                      ${!notification.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}
                    `}
                  >
                    {/* Icon */}
                    <div
                      className={`
                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                        ${getTypeStyles(notification.type)}
                      `}
                    >
                      {notification.icon || (
                        <Bell className="w-4 h-4" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="flex-shrink-0 w-2 h-2 mt-1.5 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-zinc-500 dark:text-zinc-500">
                          {notification.time}
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          View details →
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-zinc-200 dark:border-zinc-800 text-center">
                <button
                  onClick={viewAllNotifications}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      <div className="lg:hidden w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
        JD
      </div>
    </>
  );
}