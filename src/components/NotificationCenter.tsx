import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Clock, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { mockPolicies } from '@/data/mockData';
import { isExpiringSoon, isExpired, getDaysUntil, getTimeAgo } from '@/utils/dateUtils';

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  policyId?: string;
  clientName?: string;
  read: boolean;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: Notification[] = [];

      // Policy expiration notifications
      mockPolicies.forEach(policy => {
        const daysUntil = getDaysUntil(policy.maturityDate);
        
        if (isExpired(policy.maturityDate) && policy.status === 'Active') {
          newNotifications.push({
            id: `exp-${policy.id}`,
            type: 'error',
            title: 'Policy Expired',
            message: `Policy ${policy.policyNo} for ${policy.clientName} has expired`,
            timestamp: new Date().toISOString(),
            policyId: policy.id,
            clientName: policy.clientName,
            read: false
          });
        } else if (isExpiringSoon(policy.maturityDate)) {
          newNotifications.push({
            id: `warn-${policy.id}`,
            type: 'warning',
            title: 'Policy Expiring Soon',
            message: `Policy ${policy.policyNo} expires in ${daysUntil} days`,
            timestamp: new Date().toISOString(),
            policyId: policy.id,
            clientName: policy.clientName,
            read: false
          });
        }
      });

      // Premium collection reminders
      const activePolicies = mockPolicies.filter(p => p.status === 'Active');
      if (activePolicies.length > 0) {
        newNotifications.push({
          id: 'premium-reminder',
          type: 'info',
          title: 'Premium Collection Reminder',
          message: `${activePolicies.length} policies require premium collection this month`,
          timestamp: new Date().toISOString(),
          read: false
        });
      }

      // Recent activities
      newNotifications.push({
        id: 'recent-activity',
        type: 'success',
        title: 'New Policy Added',
        message: 'IGI-LIFE-007 has been successfully created',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false
      });

      setNotifications(newNotifications);
    };

    generateNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      default:
        return <Bell className="h-5 w-5 text-info" />;
    }
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 animate-pulse-glow">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications at the moment</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md animate-slide-up ${
                  notification.read ? 'bg-muted/30' : 'bg-card'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`text-sm font-medium ${
                          !notification.read ? 'font-semibold' : ''
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {getTimeAgo(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs"
                      >
                        Mark Read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNotification(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;