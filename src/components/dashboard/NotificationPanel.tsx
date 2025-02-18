import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface Notification {
  id: string;
  type:
    | "payment_failure"
    | "cancellation"
    | "success"
    | "invoice_generated"
    | "payment_retry";
  message: string;
  timestamp: string;
}

interface NotificationPanelProps {
  notifications?: Notification[];
}

const defaultNotifications: Notification[] = [
  {
    id: "1",
    type: "payment_failure",
    message: "Payment failed for subscriber John Doe",
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    type: "invoice_generated",
    message: "Monthly invoice generated for ABC Corp",
    timestamp: "30 minutes ago",
  },
  {
    id: "3",
    type: "payment_retry",
    message: "Payment retry scheduled for XYZ Ltd",
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    type: "cancellation",
    message: "Jane Smith cancelled their subscription",
    timestamp: "2 hours ago",
  },
  {
    id: "5",
    type: "success",
    message: "New subscriber: Mike Johnson",
    timestamp: "3 hours ago",
  },
];

const NotificationPanel = ({
  notifications = defaultNotifications,
}: NotificationPanelProps) => {
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "payment_failure":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "cancellation":
        return <XCircle className="h-4 w-4 text-orange-500" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type: Notification["type"]) => {
    switch (type) {
      case "payment_failure":
        return <Badge variant="destructive">Payment Failed</Badge>;
      case "cancellation":
        return <Badge variant="warning">Cancelled</Badge>;
      case "success":
        return <Badge variant="default">Success</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-[300px] bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <Bell className="h-5 w-5 text-gray-500" />
        </div>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  {getNotificationBadge(notification.type)}
                  <span className="text-xs text-gray-500">
                    {notification.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{notification.message}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default NotificationPanel;
