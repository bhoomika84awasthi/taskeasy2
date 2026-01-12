# Time Log Summary - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Backend running: `cd backend && npm run dev`
- Frontend running: `npm run dev`
- Logged in to the application

### Step 1: Navigate to Time Log Summary
1. Click on your project
2. Go to **Boards** → **Time Log Summary Free** in the sidebar
3. Page loads automatically with last 30 days of data

### Step 2: View Your Time Logs
- **Table displays**: User name, Project, Work Items, Type, Time spent per date
- **Automatic calculations**: Totals per date and per user
- **Time format**: Hours:Minutes (e.g., 8:30 means 8 hours 30 minutes)

### Step 3: Filter Data (Optional)
1. **By Date Range**: Set "From date" and "To date", click Search
2. **By User**: Select user from dropdown, click Search
3. **By Week**: Select "Current Week" or "Last Week"
4. **Combination**: Use multiple filters together

### Step 4: Understanding the Table

```
┌─────────────┬─────────┬──────────────────┬──────┬────────┐
│ User        │ Project │ Work Item        │ Type │ Hours  │
├─────────────┼─────────┼──────────────────┼──────┼────────┤
│ John Doe    │ MyApp   │ API Integration  │ Task │ 8:30   │
│             │         │ Bug Fix          │ Bug  │ 4:00   │
│ Jane Smith  │ MyApp   │ UI Design        │ Task │ 6:00   │
│             │         │                  │      │        │
│ TOTALS      │         │                  │      │ 18:30  │
└─────────────┴─────────┴──────────────────┴──────┴────────┘
```

- **User column**: Groups all work items by user
- **Hours per date**: Shows time logged for each day
- **Totals row**: Grand total across all users and dates

## 🔧 Key Features

### Auto-Load
✅ On page open, automatically fetches last 30 days

### Dynamic Filtering
✅ Select filters and click Search to update

### Quick Selections
✅ Current Week / Last Week buttons for quick access

### Real-time Calculations
✅ Totals update instantly when data changes

### Error Handling
✅ Clear error messages if something goes wrong

## 📊 Understanding Your Data

### Example: Reading the Table

If you see:
```
John Doe | MyApp | Design API | Task | 2025-01-15: 4:00 | 2025-01-16: 4:30
```

**This means:**
- John Doe worked on "Design API" task
- Task type is "Task"
- Spent 4 hours on Jan 15
- Spent 4 hours 30 minutes on Jan 16
- Total for this item: 8:30 hours

### Totals Calculation
```
John Doe (2 items):
  - API Integration: 8:30
  - Bug Fix: 4:00
  User Total: 12:30

Jane Smith (1 item):
  - UI Design: 6:00
  User Total: 6:00

GRAND TOTAL: 18:30 hours
```

## 🐛 Troubleshooting

### Q: No data showing?
**A:** 
1. Make sure work items have `timeSpent` value
2. Check if date range includes the work items
3. Try selecting "Current Week" to see recent items
4. Check browser console for errors

### Q: Wrong dates showing?
**A:**
1. Verify date fields are set correctly
2. Try clearing filters and clicking Search
3. Check that work items have proper start dates

### Q: User not in dropdown?
**A:**
1. Work item must have assignees
2. Assignee must have a name in database
3. Try different date range

### Q: "No time logs found" message?
**A:**
1. Adjust date range to include more days
2. Verify work items exist in this project
3. Make sure work items are assigned to someone
4. Check that timeSpent > 0

## 📝 Common Tasks

### Task: View all work from last week
1. Click on "Last Week" button
2. Search results update automatically
3. View the table with last week's data

### Task: Check one person's time log
1. Select person from "Team/User" dropdown
2. Click Search
3. See only that person's work items

### Task: Find work done in specific date range
1. Enter "From date": 2025-01-01
2. Enter "To date": 2025-01-31
3. Click Search
4. See only January's work

### Task: Calculate total hours for a project
1. Set date range
2. View "TOTALS" row in table
3. Right-most column shows total hours

## 💡 Pro Tips

1. **Time Format**: Hover over hours to see breakdown
   - 8:30 = 8 hours 30 minutes
   - 0:45 = 45 minutes
   - 24:00 = 24 hours (1 full day)

2. **Quick Filters**: Use week selection for fast access
   - Current Week: This week's data
   - Last Week: Previous week's data
   - Custom Range: Any date range you want

3. **Column Sorting**: Data is grouped by user automatically
   - Users listed alphabetically
   - Dates shown in chronological order

4. **Updates**: Click Search to refresh data
   - Picks up new work items
   - Updates time spent values
   - Applies new filters

## 📱 Mobile View

- Table scrolls horizontally on small screens
- All features work on mobile
- Filters remain visible and functional
- Time calculations same as desktop

## 🔐 Security Notes

- Data filtered by your project access
- Time logs only show your own work
- Backend validates all queries
- Authentication required on all API calls

## 📞 Need Help?

Check these files for more information:
- **Implementation Details**: `TIME_LOG_COMPLETE_IMPLEMENTATION.md`
- **Verification**: `VERIFICATION_CHECKLIST.md`
- **API Reference**: `TIME_LOG_API_REFERENCE.md` (if available)

---

**That's it!** You're now ready to use Time Log Summary to track and analyze team work patterns.
