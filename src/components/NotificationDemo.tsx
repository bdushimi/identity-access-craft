
import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';

const NotificationDemo = () => {
  const { addNotification } = useNotifications();

  const generateDemoNotification = () => {
    const titles = [
      'Leave Request Approved',
      'Reminder: Team Meeting',
      'Holiday Coming Up',
      'Payroll Processed',
      'System Maintenance'
    ];
    
    const messages = [
      'Your leave request has been approved by your manager.',
      'Don\'t forget about the team meeting tomorrow at 10 AM.',
      'There is an upcoming public holiday next week.',
      'Your salary has been processed and will be deposited soon.',
      'The system will be undergoing maintenance this weekend.'
    ];

    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    addNotification(randomTitle, randomMessage);
  };

  return (
    <Button variant="outline" onClick={generateDemoNotification}>
      Test Notification
    </Button>
  );
};

export default NotificationDemo;
