
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismissNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative p-2 h-9 w-9">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-80">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 hover:bg-slate-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0" 
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notification.id);
                      }}
                    >
                      <span className="sr-only">Dismiss</span>
                      <span aria-hidden="true">&times;</span>
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{notification.message}</p>
                  <span className="text-xs text-slate-400 mt-2 block">
                    {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">
              No notifications
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
