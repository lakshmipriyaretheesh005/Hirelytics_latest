export type NotificationType = "admin" | "drive" | "alert";
export type NotificationPriority = "high" | "medium" | "low";

export type StudentNotification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  date: string;
  actionLabel?: string;
  actionPath?: string;
};

export const studentNotifications: StudentNotification[] = [
  {
    id: "admin-1",
    title: "Admin Update: Mock test leaderboard refresh",
    message: "The leaderboard and recent mock test scores will be recalculated tonight after 10:00 PM.",
    type: "admin",
    priority: "medium",
    date: "Mar 22, 2026",
    actionLabel: "Open Mock Tests",
    actionPath: "/mock-tests",
  },
  {
    id: "admin-2",
    title: "Admin Update: Contribution review window",
    message: "New student-contributed questions and interview experiences are being reviewed this week.",
    type: "admin",
    priority: "low",
    date: "Mar 21, 2026",
    actionLabel: "Contribute",
    actionPath: "/contribute",
  },
  {
    id: "drive-1",
    title: "Upcoming Drive: Infosys aptitude round",
    message: "Infosys aptitude round is scheduled for March 28, 2026. Make sure your profile is complete.",
    type: "drive",
    priority: "high",
    date: "Mar 22, 2026",
    actionLabel: "View Drives",
    actionPath: "/drives",
  },
  {
    id: "drive-2",
    title: "Upcoming Event: TCS NQT preparation window",
    message: "TCS NQT practice and revision should be prioritized before the April 2, 2026 drive.",
    type: "drive",
    priority: "medium",
    date: "Mar 20, 2026",
    actionLabel: "Open Prep Hub",
    actionPath: "/prep-hub?company=TCS&category=aptitude",
  },
  {
    id: "alert-1",
    title: "Student Alert: Resume missing company customization",
    message: "Update your resume for your target company before using AI Predictor again for better fit analysis.",
    type: "alert",
    priority: "high",
    date: "Mar 22, 2026",
    actionLabel: "Open AI Predictor",
    actionPath: "/ai-predictor",
  },
  {
    id: "alert-2",
    title: "Student Alert: Contribution pending approval",
    message: "One or more of your recent contributions are still pending admin approval.",
    type: "alert",
    priority: "low",
    date: "Mar 19, 2026",
    actionLabel: "Review Contributions",
    actionPath: "/contribute",
  },
];
