# Time Log Summary - API Reference

## Backend Endpoints

### 1. Fetch Work Items (EXISTING)
```
GET /api/projects/{projectId}/workitems
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `boardId` | ObjectId | Filter by board ID |
| `state` | String | Filter by state (New, Active, Resolved) |
| `type` | String | Filter by type (Task, Bug, etc.) |
| `assignee` | ObjectId | Filter by assignee |
| `search` | String | Search in title/description |
| `page` | Number | Page number (default: 1) |
| `limit` | Number | Items per page (default: 100) |

**Response:**
```json
{
  "items": [
    {
      "_id": "ObjectId",
      "projectId": "ObjectId",
      "sprintId": "ObjectId",
      "title": "string",
      "type": "string",
      "state": "string",
      "timeSpent": 5.5,
      "assignees": [
        {
          "_id": "ObjectId",
          "name": "string",
          "email": "string"
        }
      ],
      "timeline": {
        "startDate": "2025-01-15T00:00:00Z",
        "dueDate": "2025-01-20T00:00:00Z",
        "completedDate": "2025-01-18T00:00:00Z"
      },
      "createdAt": "2025-01-15T00:00:00Z",
      "updatedAt": "2025-01-15T00:00:00Z"
    }
  ],
  "total": 10
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/projects/123abc/workitems?limit=50" \
  -H "Authorization: Bearer your_jwt_token"
```

**Success Code:** 200 OK
**Error Codes:** 400 (Invalid ID), 401 (Unauthorized), 500 (Server Error)

---

### 2. Fetch Time Log Summary (NEW)
```
GET /api/projects/{projectId}/time-log-summary
```

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | ObjectId | Filter by user ID |
| `fromDate` | String (ISO) | Start date (YYYY-MM-DD) |
| `toDate` | String (ISO) | End date (YYYY-MM-DD) |
| `sprintId` | ObjectId | Filter by sprint |

**Response:**
```json
{
  "timeLogs": {
    "John Doe": {
      "2025-01-15": [
        {
          "title": "UI Design",
          "type": "Development",
          "timeSpent": 5.5,
          "sprintName": "Sprint 1"
        },
        {
          "title": "Code Review",
          "type": "Development",
          "timeSpent": 2.0,
          "sprintName": "Sprint 1"
        }
      ],
      "2025-01-16": [
        {
          "title": "Bug Fixing",
          "type": "Bug",
          "timeSpent": 4.0,
          "sprintName": "Sprint 1"
        }
      ]
    },
    "Jane Smith": {
      "2025-01-15": [
        {
          "title": "Testing",
          "type": "Development",
          "timeSpent": 6.0,
          "sprintName": "Sprint 1"
        }
      ]
    }
  },
  "items": [
    // Full work item objects
  ]
}
```

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/projects/123abc/time-log-summary?fromDate=2025-01-15&toDate=2025-01-20&userId=456def" \
  -H "Authorization: Bearer your_jwt_token"
```

**Success Code:** 200 OK
**Error Codes:** 400 (Invalid ID), 401 (Unauthorized), 500 (Server Error)

---

### 3. Update Work Item Time Spent
```
PATCH /api/projects/{projectId}/workitems/{itemId}
```

**Headers:**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "timeSpent": 5.5,
  "title": "Updated Title",
  "state": "Completed"
}
```

**Response:**
```json
{
  "item": {
    "_id": "ObjectId",
    "timeSpent": 5.5,
    // ... other fields
  }
}
```

**Success Code:** 200 OK
**Error Codes:** 400 (Invalid data), 401 (Unauthorized), 404 (Not found), 500 (Server Error)

---

## Frontend Service Methods

### workItemService.js
```javascript
import { fetchWorkItems, updateWorkItem } from '../services/workItemService';

// Fetch all work items
const { items, total } = await fetchWorkItems(projectId, {
  assignee: userId,
  state: 'Completed',
  limit: 100
});

// Update a work item
await updateWorkItem(projectId, workItemId, {
  timeSpent: 5.5,
  state: 'Completed'
});
```

### timeLogService.js
```javascript
import { 
  fetchTimeLogSummary,
  updateTimeSpent,
  formatHours,
  getWeekDateRange 
} from '../services/timeLogService';

// Fetch time log summary
const { timeLogs, items } = await fetchTimeLogSummary(projectId, {
  userId: '123abc',
  fromDate: '2025-01-15',
  toDate: '2025-01-20'
});

// Update time spent
await updateTimeSpent(projectId, workItemId, 5.5);

// Format hours to HH:MM
const formatted = formatHours(5.5); // Returns "5:30"

// Get week date range
const { startDate, endDate } = getWeekDateRange('current');
// Returns: { startDate: '2025-01-12', endDate: '2025-01-18' }
```

---

## Data Models

### WorkItem Schema
```javascript
{
  projectId: ObjectId (ref: Project),
  sprintId: ObjectId (ref: Sprint),
  boardId: ObjectId (ref: Board),
  title: String,
  description: String,
  type: String (Task, Bug, Feature, etc.),
  state: String (New, Active, Resolved),
  points: Number,
  assignees: [ObjectId] (refs: User),
  timeSpent: Number (in hours, decimal),
  timeline: {
    startDate: Date,
    dueDate: Date,
    completedDate: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

### User Schema (Assignee)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  // ... other fields
}
```

### Sprint Schema
```javascript
{
  projectId: ObjectId (ref: Project),
  name: String,
  goal: String,
  startDate: Date,
  endDate: Date,
  state: String (planned, active, completed),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Authentication

All endpoints require JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token is stored in localStorage after login:
```javascript
const token = localStorage.getItem('token');
```

---

## Error Responses

### Invalid Project ID
```json
{
  "message": "Invalid projectId"
}
```
**Status:** 400

### Unauthorized
```json
{
  "message": "Unauthorized"
}
```
**Status:** 401

### Not Found
```json
{
  "message": "Work item not found"
}
```
**Status:** 404

### Server Error
```json
{
  "message": "Failed to fetch work items",
  "error": "Error message details"
}
```
**Status:** 500

---

## Response Time Benchmarks

| Operation | Dataset Size | Expected Time |
|-----------|--------------|---------------|
| Fetch 10 work items | 10 items | < 100ms |
| Fetch 100 work items | 100 items | < 300ms |
| Fetch 1000 work items | 1000 items | < 1000ms |
| Calculate time logs | 100 items | < 50ms |
| Render table | 50 rows | < 200ms |

---

## Example Usage Flow

### 1. Login and Get Token
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
});
const { token } = await response.json();
localStorage.setItem('token', token);
```

### 2. Fetch Work Items
```javascript
const projectId = '123abc'; // From useProject() hook
const { items } = await fetchWorkItems(projectId);
console.log('Loaded', items.length, 'work items');
```

### 3. Filter by User and Date
```javascript
const userId = items[0].assignees[0]._id;
const { timeLogs } = await fetchTimeLogSummary(projectId, {
  userId: userId,
  fromDate: '2025-01-15',
  toDate: '2025-01-20'
});
console.log('Time logs:', timeLogs);
```

### 4. Update Time Spent
```javascript
await updateWorkItem(projectId, itemId, {
  timeSpent: 5.5,
  state: 'Completed'
});
```

---

## Rate Limiting & Best Practices

1. **Cache Results:** Don't refetch work items on every render
2. **Debounce Filters:** Debounce search input to reduce API calls
3. **Pagination:** Use limit/page for large datasets
4. **Error Handling:** Always wrap API calls in try-catch
5. **Loading States:** Show loading indicator during API calls
6. **Optimize Queries:** Use specific filters to reduce response size

---

## Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid token |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Backend issue |

---

**Last Updated:** January 2025
**API Version:** 1.0
**Compatibility:** Node.js 14+, MongoDB 4.0+
