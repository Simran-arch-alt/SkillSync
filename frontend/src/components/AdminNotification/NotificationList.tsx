import NotificationCard from "./NotificationCard";

const notifications = [
  {
    id: 1,
    title: "New User Registered",
    description: "John Doe has successfully created an account.",
    time: "10 minutes ago",
    type: "user" as const,
    unread: true,
  },
  {
    id: 2,
    title: "Skill Library Updated",
    description: "Docker has been added to the Skill Library.",
    time: "35 minutes ago",
    type: "skill" as const,
    unread: false,
  },
  {
    id: 3,
    title: "Monthly Report Generated",
    description: "The monthly analytics report is now available.",
    time: "Yesterday • 4:30 PM",
    type: "report" as const,
    unread: false,
  },
  {
    id: 4,
    title: "System Backup Completed",
    description: "Daily database backup completed successfully.",
    time: "Yesterday • 2:00 PM",
    type: "system" as const,
    unread: true,
  },
  {
    id: 5,
    title: "New Job Role Added",
    description: "Backend Developer role has been added to the system.",
    time: "2 days ago",
    type: "system" as const,
    unread: false,
  },
];

const NotificationList = () => {
  return (
    <>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          title={notification.title}
          description={notification.description}
          time={notification.time}
          type={notification.type}
          unread={notification.unread}
        />
      ))}
    </>
  );
};

export default NotificationList;