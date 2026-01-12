# Time Log Summary - Testing Guide

## Prerequisites
1. Backend server running on `http://localhost:5000`
2. Frontend running on `http://localhost:5173` (or configured port)
3. MongoDB connected with test data
4. Logged in user with valid JWT token in localStorage

## Test Data Setup

Before testing, ensure you have:

### 1. Create a Project
```
POST /api/projects
{
  "name": "Test Project",
  "description": "For time log testing"
}
```

### 2. Create Work Items with Time Logs
```
POST /api/projects/{projectId}/workitems
{
  "title": "UI Design",
  "type": "Development",
  "timeSpent": 5.5,
  "assignees": ["{userId}"],
  "timeline": {
    "startDate": "2025-01-15"
  }
}
```

Create multiple work items with:
- Different assignees
- Different types (Task, Bug, Development, Meeting)
- Different time spent values
- Different dates within the last week

### 3. Create Sprints (Optional)
```
POST /api/projects/{projectId}/sprints
{
  "name": "Sprint 1",
  "goal": "Complete core features",
  "startDate": "2025-01-13",
  "endDate": "2025-01-20",
  "state": "active"
}
```

Then assign work items to sprints by updating them:
```
PATCH /api/projects/{projectId}/workitems/{itemId}
{
  "sprintId": "{sprintId}"
}
```

## Testing Scenarios

### Scenario 1: Load Page and Display Work Items
**Steps:**
1. Navigate to Time Log Summary page
2. Observe page loads without errors

**Expected Results:**
- Page loads successfully
- "Extension is taking longer..." notice appears
- No console errors
- User dropdown is populated with work item assignees
- Date fields show reasonable date range (last 7 days)

**Test Result:** ✓ Pass / ✗ Fail

---

### Scenario 2: Search Without Filters
**Steps:**
1. Click "Search" button without selecting any filters

**Expected Results:**
- Table displays all work items
- Shows headers: User, Project, Work Item, Type, dates, Totals
- Day of week shows in second header row (MON, TUE, etc.)
- Each row shows work item and time spent
- Grand total calculated correctly

**Test Result:** ✓ Pass / ✗ Fail

---

### Scenario 3: Filter by User
**Steps:**
1. Select a user from "Team/User" dropdown
2. Click "Search"

**Expected Results:**
- Only work items assigned to selected user display
- All time logs belong to that user
- Table shows accurate totals for selected user

**Test Result:** ✓ Pass / ✗ Fail

---

### Scenario 4: Filter by Date Range
**Steps:**
1. Set "From date" to "2025-01-15"
2. Set "To date" to "2025-01-20"
3. Click "Search"

**Expected Results:**
- Only work items with start dates in range display
- Work items outside range are excluded
- Totals reflect only filtered items

**Test Result:** ✓ Pass / ✗ Fail

---

### Scenario 5: Week Selection - Current Week
**Steps:**
1. Select "Current Week" from Week dropdown
2. Note the dates that populate in From/To fields
3. Click "Search"

**Expected Results:**
- From date shows start of current week (Sunday or Monday)
- To date shows end of current week (Saturday or Sunday)
- Table displays work items from that week only

**Test Result:** ✓ Pass / ✗ Fail

---

### Scenario 6: Week Selection - Last Week
**Steps:**
1. Select "Last Week" from Week dropdown
2. Note the dates that populate in From/To fields
3. Click "Search"

**Expected Results:**
- Dates show previous week range
- All work items from previous week display
- Correct totals calculated

**Test Result:** ✓ Pass / ✗ Fail

---

### Scenario 7: Multiple Users
**Steps:**
1. Create work items for multiple users (see setup)
2. Click "Search" without user filter

**Expected Results:**
- Table groups by user with rowSpan
- Each user section shows their work items
- Totals row at bottom shows sum of all users
- Times are formatted correctly (H:MM format)

**Test Result:** ✓ Pass / ✗ Fail

---

### Scenario 8: Time Formatting
**Steps:**
1. Create work items with various timeSpent values:
   - 0.5 hours (should show 0:30)
   - 1.75 hours (should show 1:45)
   - 5.5 hours (should show 5:30)
2. Click "Search"

**Expected Results:**
- All times display in HH:MM format
- Decimal hours converted correctly
- Totals calculated and formatted properly

**Test Result:** ✓ Pass / ✗ Fail

---

### Scenario 9: Empty Results
**Steps:**
1. Select a user with no work items
2. Set date range with no work items
3. Click "Search"

**Expected Results:**
- Message displays: "No time logs to display. Click Search to load data."
- No errors in console
- UI remains responsive

**Test Result:** ✓ Pass / ✗ Fail

---

### Scenario 10: Error Handling
**Steps:**
1. Stop backend server
2. Click "Search" button

**Expected Results:**
- Error message displays: "Failed to load work items..."
- Page remains usable
- User can retry after fixing connection

**Test Result:** ✓ Pass / ✗ Fail

---

### Scenario 11: Multiple Work Items per User per Day
**Steps:**
1. Create 3+ work items for same user on same date
2. Set different times for each item
3. Click "Search"

**Expected Results:**
- Multiple rows appear for same user
- Each row shows different work item
- Date columns show individual times
- Daily total combines all items for that day

**Test Result:** ✓ Pass / ✗ Fail

---

### Scenario 12: Download Button
**Steps:**
1. Populate table with data
2. Click "Download" button

**Expected Results:**
- Button is clickable (no errors)
- Note: Currently not implemented, but should be available for future enhancement

**Test Result:** ✓ Pass / ✗ Fail (Expected - future feature)

---

## Browser Console Checks

While testing, open Developer Tools (F12) and check:

### 1. No JavaScript Errors
- Console tab should have no red errors
- Network tab should show successful API calls (200 status)

### 2. Network Requests
- Check GET `/api/projects/{projectId}/workitems` request
- Verify response includes all work items with:
  - `title`, `type`, `timeSpent`, `assignees`, `timeline`

### 3. Component State
- React DevTools should show timelogsummary component
- State should reflect current selections:
  - `workItems`: Array of loaded items
  - `timeLogs`: Array of filtered items
  - `selectedUser`: Currently selected user
  - `loading`: Should be false after search
  - `error`: Should be empty on success

---

## Performance Testing

### 1. Large Dataset
**Steps:**
1. Create 100+ work items
2. Click "Search"

**Expected Results:**
- Page loads within 2 seconds
- Table renders smoothly
- No lag when scrolling
- Memory usage reasonable (<100MB)

**Test Result:** ✓ Pass / ✗ Fail

---

### 2. Rapid Searches
**Steps:**
1. Click Search multiple times rapidly
2. Change filters and click Search repeatedly

**Expected Results:**
- Previous requests are handled correctly
- Latest search results display
- No stale data shown
- No duplicate requests on network tab

**Test Result:** ✓ Pass / ✗ Fail

---

## Accessibility Testing

### 1. Form Labels
- All input fields have associated labels
- Labels are readable and clear

### 2. Table Structure
- Table has proper `<thead>`, `<tbody>`, `<tfoot>`
- Header row describes columns
- Data cells properly aligned under headers

### 3. Button States
- Search button shows loading state
- Download button is keyboard accessible
- Tab navigation works correctly

---

## Documentation Review

- [ ] Implementation doc is accurate
- [ ] Code comments explain key functions
- [ ] Error messages are user-friendly
- [ ] Supported browsers documented

---

## Approval Checklist

- [ ] All scenarios pass
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Code reviewed
- [ ] Ready for production
