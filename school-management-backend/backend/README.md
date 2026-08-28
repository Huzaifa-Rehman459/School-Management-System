# School Management System — Backend (MERN)

## Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI to match your Compass database name, and set JWT_SECRET
npm run dev
```

Server runs on `http://localhost:5000` by default.

## Folder structure

```
backend/
├── config/
│   └── db.js
├── models/
│   ├── User.js         # Principal / Manager / Teacher accounts (auth)
│   ├── Student.js       # Students are records, NOT login users
│   ├── Class.js
│   ├── Subject.js
│   ├── Attendance.js
│   └── Leave.js
├── middlewares/
│   ├── auth.js           # verifyToken + authorize(...roles)
│   └── errorHandler.js
├── controllers/
├── routes/
├── utils/
│   └── generateId.js     # STD-2026-001 / TCH-2026-001 style IDs
├── .env.example
├── server.js
└── package.json
```

## Roles & limits (enforced in `authController.js`)

| Role | Limit |
|---|---|
| SUPER_ADMIN (Principal) | 1 |
| MANAGER | 2 |
| TEACHER | unlimited |

Students are **not** login users in this build (the PDF only defines login for Principal, Manager, Teacher). Students are managed as records by Principal/Manager and viewed by their assigned Teacher.

## Auth flow

- `POST /api/auth/register` → creates a user, enforces role limits, returns JWT (as httpOnly cookie + in response body)
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me` (requires auth)
- `GET /api/auth/role-availability` → tells the React register page which roles are still open (e.g. hide "Principal" once one exists)

## Full API reference

### Auth
| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register | Public (role limits enforced) |
| POST | /api/auth/login | Public |
| POST | /api/auth/logout | Public |
| GET | /api/auth/me | Logged in |
| GET | /api/auth/role-availability | Public |

### Students
| Method | Route | Access |
|---|---|---|
| GET | /api/students | All roles (teacher auto-filtered to assigned students) |
| GET | /api/students/:id | All roles (teacher only if assigned) |
| GET | /api/students/:id/attendance-history?month=&year= | All roles |
| POST | /api/students | Principal, Manager |
| PUT | /api/students/:id | Principal, Manager |
| DELETE | /api/students/:id | Principal, Manager |
| PUT | /api/students/:id/assign-teacher | Principal, Manager — body: `{ teacherId, subjectId }` |

### Teachers
| Method | Route | Access |
|---|---|---|
| GET | /api/teachers/dashboard | Teacher (their own summary) |
| GET | /api/teachers | Principal, Manager |
| GET | /api/teachers/:id | Principal, Manager |
| POST | /api/teachers | Principal, Manager |
| PUT | /api/teachers/:id | Principal, Manager |
| DELETE | /api/teachers/:id | Principal, Manager |

### Subjects
| Method | Route | Access |
|---|---|---|
| GET | /api/subjects | All roles (teacher auto-filtered) |
| GET | /api/subjects/:id | All roles |
| POST | /api/subjects | Principal, Manager |
| PUT | /api/subjects/:id | Principal, Manager |
| DELETE | /api/subjects/:id | Principal, Manager |
| PUT | /api/subjects/:id/assign-teacher | Principal, Manager — body: `{ teacherId }` |

### Classes
| Method | Route | Access |
|---|---|---|
| GET | /api/classes | All roles |
| GET | /api/classes/:id | All roles |
| POST | /api/classes | Principal, Manager — body: `{ name, sections: [] }` |
| PUT | /api/classes/:id | Principal, Manager |
| DELETE | /api/classes/:id | Principal, Manager |
| POST | /api/classes/:id/sections | Principal, Manager — body: `{ section: "D" }` |

### Attendance
| Method | Route | Access |
|---|---|---|
| POST | /api/attendance | Teacher — body: `{ subjectId, classId, section, date, records: [{ studentId, status }] }` |
| GET | /api/attendance?classId=&subjectId=&date= | All roles |
| GET | /api/attendance/summary?date= | All roles — school-wide totals for that day |

### Leaves
| Method | Route | Access |
|---|---|---|
| POST | /api/leaves | Teacher — body: `{ leaveType, startDate, endDate, reason }` |
| GET | /api/leaves | Teacher (own only), Principal/Manager (all) |
| PUT | /api/leaves/:id/review | Principal, Manager — body: `{ status: "Approved" \| "Rejected", rejectionReason? }` |

### Dashboard
| Method | Route | Access |
|---|---|---|
| GET | /api/dashboard | Principal, Manager — school-wide totals |

## Business rules implemented

- Rule 1/2/3: unique `studentId`, `teacherId`, subject `code` (enforced via schema `unique`)
- Rule 4/5: teachers only see/mark attendance for their assigned students (enforced in controllers via `req.user.role === "TEACHER"` filters)
- Rule 6: duplicate attendance for the same student/subject/date is blocked via a compound unique index on `Attendance`
- Rule 7: only Principal/Manager can approve/reject leave (`authorize("SUPER_ADMIN", "MANAGER")` on the review route)
- Rule 8: rejecting a leave requires a `rejectionReason` (validated in `reviewLeave`)
- Rule 9: attendance can't be marked for inactive students (checked in `markAttendance`)

## Important note on frontend enforcement

The PDF explicitly calls this out: **the frontend should hide restricted options, but the backend must enforce permissions.** This backend enforces every role restriction server-side via the `authorize()` middleware and per-controller ownership checks — so even if someone edits a URL or calls the API directly with Postman, they can't access data outside their role.
