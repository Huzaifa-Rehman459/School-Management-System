export const ROLES = {
  principal: {
    label: "Principal",
    color: "#6C3FE8",
    light: "#EDE9FC",
    nav: [
      "dashboard",
      "students",
      "teachers",
      "subjects",
      "classes",
      "assign",
      "attendance",
      "leaves",
      "reports",
      "settings"
    ],
  },
  manager: {
    label: "Manager",
    color: "#0EA5E9",
    light: "#E0F2FE",
    nav: [
      "dashboard",
      "students",
      "teachers",
      "subjects",
      "classes",
      "assign",
      "attendance",
      "leaves"
    ],
  },
  teacher: {
    label: "Teacher",
    color: "#10B981",
    light: "#D1FAE5",
    nav: [
      "dashboard",
      "subjects",
      "students",
      "attendance",
      "leaves"
    ],
  },
};

export const NAV_LABELS = {
  dashboard:  "Dashboard",
  students:   "Students",
  teachers:   "Teachers",
  subjects:   "Subjects",
  classes:    "Classes",
  assign:     "Assignments",
  attendance: "Attendance",
  leaves:     "Leave Requests",
  reports:    "Reports",
  settings:   "Settings",
};