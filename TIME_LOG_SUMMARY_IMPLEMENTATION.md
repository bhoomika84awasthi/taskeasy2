# Time Log Summary Implementation

## Overview
The Time Log Summary feature has been successfully implemented to display work item time logs from sprints and calculate time spent by users and dates.

## Changes Made

### 1. Frontend Updates

#### Updated Files:
- **`src/pages/timelogsummary.jsx`** - Complete rewrite to add dynamic functionality
  - Added state management for work items, time logs, filters, and loading states
  - Implemented `useEffect` hooks to fetch work items on component load
  - Added helper functions for calculating time logs, formatting hours, and grouping data
  - Made all form controls functional with state binding
  - Updated table to display dynamic data from fetched work items
  - Added date range calculations for week selections
  - Added error handling and loading states

#### New Service Files:
- **`src/services/timeLogService.js`** - New service module with utility functions
  - `fetchTimeLogSummary()` - Fetch time log data from backend
  - `updateTimeSpent()` - Update time spent on a work item
  - `formatHours()` - Format decimal hours to HH:MM format
  - `calculateTotalHours()` - Sum up hours from multiple logs
  - `groupLogsByUserAndDate()` - Group logs for table rendering
  - `getWeekDateRange()` - Calculate date ranges for current/last week

### 2. Backend Updates

#### Updated Routes:
- **`backend/routes/workitems.js`** - Added new endpoint
  - **GET `/projects/:projectId/time-log-summary`**
    - Query parameters: `userId`, `fromDate`, `toDate`, `sprintId`
    - Returns grouped time logs by user and date
    - Populates assignee names and sprint information

## Features Implemented

### 1. Work Item Fetching
- Automatically loads all work items for the current project on page load
- Extracts and displays unique users and teams from assignees

### 2. Filtering Options
- **Team Filter**: Select team (currently shows default team)
- **User Filter**: Select individual user from list of assignees
- **Week Selection**: 
  - Current Week: Automatically sets dates for current week
  - Last Week: Automatically sets dates for previous week
  - Custom Range: Manual date selection
- **Month Selection**: 12-month dropdown selector
- **Date Range**: From date and To date inputs for custom ranges

### 3. Data Processing
- **Time Calculation**: Calculates total time spent per user, per day
- **Filtering**: Applies all selected filters to work items
- **Grouping**: Groups time logs by user and date for table display
- **Totals**: Calculates daily totals and grand totals

### 4. Display Formatting
- **Hour Format**: Converts decimal hours to HH:MM format (e.g., 1.5 hours = 1:30)
- **Dynamic Columns**: Creates date columns based on available data
- **Day of Week**: Shows abbreviated day names (MON, TUE, etc.)
- **Responsive Table**: Groups rows by user with rowSpan for cleaner display

### 5. Search Functionality
- Click "Search" button to filter and display time logs
- Shows loading state during data processing
- Displays error messages if data loading fails
- Shows empty state message if no logs match criteria

## How to Use

### 1. Initial Setup
When the page loads:
- All work items from the current project are automatically fetched
- Users are extracted from work item assignees
- Date range is set to last 7 days by default

### 2. Filtering Time Logs
1. Select filters:
   - Choose a user from the "Team/User" dropdown
   - Optionally select a week or month
   - Or manually set from/to dates
2. Click "Search" button
3. View the filtered time logs in the table

### 3. Understanding the Table
- **User**: Person assigned to the work item
- **Project**: Project name (currently shows selected project)
- **Work Item**: Title of the work item (clickable)
- **Type**: Type of work item (Task, Bug, Feature, etc.)
- **Date Columns**: Each column shows time spent on that date
- **Totals**: Sum of time spent on each item and each date

## Data Flow

```
Component Mount
    ↓
Load Work Items (fetchWorkItems)
    ↓
Extract Users & Teams
    ↓
User Clicks Search
    ↓
calculateTimeLogs() filters by:
    - Selected User
    - Date Range (from/to dates)
    ↓
Group by User & Date
    ↓
Display in Table
```

## Integration with Backend

### API Endpoint Used:
```
GET /api/projects/:projectId/workitems
Authorization: Bearer {token}
```

### New Optional Endpoint:
```
GET /api/projects/:projectId/time-log-summary
Query Parameters:
  - userId: Filter by user ID
  - fromDate: Start date (ISO format)
  - toDate: End date (ISO format)
  - sprintId: Filter by sprint
Authorization: Bearer {token}
```

## Technical Details

### State Management
- `workItems`: All fetched work items from the project
- `timeLogs`: Filtered work items for display
- `teams`: Available teams (currently static)
- `users`: Extracted from work item assignees
- `selectedTeam/selectedUser`: Filter selections
- `fromDate/toDate`: Date range filters
- `loading/error`: UI state for loading and errors

### Key Functions
1. `loadWorkItems()` - Fetches initial data
2. `calculateTimeLogs()` - Applies filters and returns filtered logs
3. `handleSearch()` - Processes search and updates display
4. `getDateColumns()` - Extracts unique dates from logs
5. `formatHours()` - Converts decimal to HH:MM
6. `getUsersFromLogs()` - Gets unique users from logs
7. `getTotalForDate()` - Sums time for a specific date
8. `getGrandTotal()` - Calculates total time across all logs

## Notes

- Time spent is stored in the WorkItem model as `timeSpent` (in hours)
- Work item start dates are used for time log dates
- If a work item has no start date, it won't appear in the summary
- Assignees can be objects (with name property) or strings
- The component handles both cases for compatibility

## Future Enhancements

1. Add ability to create/edit time log entries directly
2. Add export to CSV/Excel functionality
3. Add chart visualization of time logs
4. Add billable hours calculation
5. Add project-level filtering
6. Add sprint-level filtering
7. Add comparison with estimated vs actual time
8. Add activity log for time log changes
