
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (title: string, message: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize with some mock notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Leave Request Approved',
        message: 'Your annual leave request for June 1-5 has been approved.',
        timestamp: new Date(2025, 4, 13, 9, 30),
        isRead: false,
      },
      {
        id: '2',
        title: 'Team Meeting',
        message: 'Reminder: Team meeting tomorrow at 10:00 AM.',
        timestamp: new Date(2025, 4, 12, 14, 15),
        isRead: false,
      },
      {
        id: '3',
        title: 'Holiday Reminder',
        message: 'Upcoming holiday: National Heroes Day on February 1st.',
        timestamp: new Date(2025, 4, 10, 11, 45),
        isRead: true,
      }
    ];
    
    setNotifications(mockNotifications);
    updateUnreadCount(mockNotifications);
  }, []);

  const updateUnreadCount = (notifs: Notification[]) => {
    setUnreadCount(notifs.filter(notif => !notif.isRead).length);
  };

  const addNotification = (title: string, message: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      timestamp: new Date(),
      isRead: false,
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
    
    toast({
      title: "New Notification",
      description: title,
    });
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    );
    
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, isRead: true }));
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
  };

  const dismissNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== id);
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        dismissNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
