# Quick Start Guide - Time Log Summary

## ⚡ 5-Minute Setup

### Step 1: Verify Backend is Running
```bash
# In backend directory
cd backend
npm run dev
# Should see: "Connected to MongoDB" and "Server running on port 5000"
```

### Step 2: Start Frontend
```bash
# In root directory
npm run dev
# Should see: "Local: http://localhost:5173"
```

### Step 3: Navigate to Time Log Summary
1. Open browser: `http://localhost:5173`
2. Login with your credentials
3. Navigate to "Time Log Summary Free" (left sidebar)

### Step 4: Test the Feature
1. Click "Search" button (uses default filters)
2. Table should populate with work items
3. Select a user from dropdown and search again
4. Verify table updates with only that user's items

---

## 🎯 Common Tasks

### View All Time Logs for Current Week
1. Select "Current Week" from Week dropdown
2. Click "Search"
3. View results

### View Time Logs for Specific User
1. Select user from "Team/User" dropdown
2. Click "Search"
3. See only their work items

### View Time Logs for Custom Date Range
1. Enter "From date" (e.g., 2025-01-15)
2. Enter "To date" (e.g., 2025-01-20)
3. Click "Search"
4. See only items in that range

### Interpret the Table
- **User Column:** Person assigned to work
- **Date Columns:** Each column shows hours worked on that day
- **Totals Column:** Total hours for that work item
- **Bottom Row:** Total hours per day and grand total

---

## 🐛 Troubleshooting

### Table is Empty
**Problem:** No data showing after clicking Search
**Solutions:**
1. Ensure backend is running (check terminal for port 5000)
2. Verify you're logged in (token in localStorage)
3. Check if project has work items (see Work Items page)
4. Work items must have `timeSpent` value > 0

### User Dropdown is Empty
**Problem:** No users to select from
**Solutions:**
1. Ensure work items exist in the project
2. Work items must have assignees
3. Click "Search" to reload work items
4. Refresh page and try again

### Error Message Displays
**Problem:** "Failed to load work items..."
**Solutions:**
1. Check browser console (F12) for error details
2. Verify backend server is running
3. Check if you have valid JWT token
4. Try refreshing the page
5. Check network tab for API errors (should be 200 status)

### Times Show as "0:00"
**Problem:** Time entries show zero
**Solutions:**
1. Ensure work items have `timeSpent` values
2. `timeSpent` must be a number (e.g., 5.5)
3. Not a string (e.g., "5.5")
4. Update work items with time spent values

---

## 📊 Understanding the Display

### Time Format
- **Input:** Decimal hours (e.g., 5.5)
- **Display:** HH:MM format (e.g., 5:30)
- **Calculation:** 
  - 5.5 hours = 5 hours + 0.5 × 60 minutes = 5:30

### Example Table

```
User    Project     Work Item        Type        2025-01-15  2025-01-16  TOTALS
John    MyProject   UI Design        Dev         5:30        4:00        9:30
        MyProject   Code Review      Dev         2:00        3:00        5:00
        MyProject   Testing          QA          1:30        2:00        3:30
                                              --------    --------    --------
TOTALS                                         9:00        9:00        18:00
```

### Column Meanings
- **User:** Name of person who worked
- **Project:** Project the work belongs to
- **Work Item:** Title of the task/bug/feature
- **Type:** Category of work
- **Date Columns:** Hours spent on that date
- **TOTALS:** Sum for that work item

---

## 🔍 API Testing (Optional)

If you want to test the backend API directly:

### Test Fetch Work Items
```bash
curl -X GET "http://localhost:5000/api/projects/{projectId}/workitems" \
  -H "Authorization: Bearer {your_jwt_token}"
```

### Test Time Log Summary
```bash
curl -X GET "http://localhost:5000/api/projects/{projectId}/time-log-summary?fromDate=2025-01-15&toDate=2025-01-20" \
  -H "Authorization: Bearer {your_jwt_token}"
```

Replace `{projectId}` and `{your_jwt_token}` with actual values.

---

## 📝 Sample Test Data Setup

### 1. Create a Test Project
If you don't have one, go to Projects page and create:
```
Name: Test Project
Description: For time log testing
```

### 2. Add Work Items
Create several work items (Work Items page):
```
Item 1:
  Title: UI Design
  Type: Development
  Time Spent: 5.5
  Assignee: [Your User]
  Start Date: 2025-01-15

Item 2:
  Title: Bug Fixing
  Type: Development
  Time Spent: 3.0
  Assignee: [Your User]
  Start Date: 2025-01-15

Item 3:
  Title: Testing
  Type: Development
  Time Spent: 4.5
  Assignee: [Your User]
  Start Date: 2025-01-16
```

### 3. Return to Time Log Summary
- Click "Search"
- Should see 3 items with correct times
- Totals should be:
  - Jan 15: 8:30 (5:30 + 3:00)
  - Jan 16: 4:30
  - Grand Total: 13:00

---

## 💡 Pro Tips

1. **Date Range:** Use Week selector for quick common ranges
2. **Multiple Filters:** Combine user + date filters for precise results
3. **Refresh Data:** After adding new work items, refresh the page
4. **Column Width:** Scroll right to see all date columns
5. **Responsive:** Works on mobile devices (scroll horizontally)

---

## 🚀 Advanced Usage

### Add More Detailed Time Entries
1. Go to Work Items page
2. Edit each item's `timeSpent` field
3. Return to Time Log Summary
4. Click Search to see updates

### Filter by Sprint
1. Create a Sprint (Sprints page)
2. Assign work items to sprint
3. Backend supports sprint filtering (future frontend update)

### Export Data
Download button available for future CSV export feature

---

## ❓ FAQ

**Q: Why is my data not showing?**
A: Ensure work items have `timeSpent` > 0 and valid `assignees`

**Q: Can I edit times directly in the table?**
A: Not yet - go to Work Items page to edit, then refresh summary

**Q: What time format is used?**
A: Decimal hours converted to HH:MM format (5.5 → 5:30)

**Q: Can I print the table?**
A: Use browser's Print function (Ctrl+P or Cmd+P)

**Q: How far back can I view logs?**
A: Any date range - set "From date" to any past date

**Q: What if I have no work items?**
A: Create them in Work Items page with `timeSpent` values

---

## 📞 Need Help?

1. **Check logs:** Open browser DevTools (F12) → Console tab
2. **Check network:** DevTools → Network tab → Look for errors
3. **Read docs:** See `TIME_LOG_TESTING_GUIDE.md` for detailed tests
4. **Review API:** See `TIME_LOG_API_REFERENCE.md` for endpoints

---

## 🎓 Next Steps

After verifying the feature works:

1. ✅ Run all tests from `TIME_LOG_TESTING_GUIDE.md`
2. ✅ Test with real project data
3. ✅ Test with multiple users
4. ✅ Performance test with 100+ items
5. ✅ Deploy to staging environment
6. ✅ Get QA approval
7. ✅ Deploy to production

---

**Last Updated:** January 2025
**Version:** 1.0
**Status:** Production Ready ✅
