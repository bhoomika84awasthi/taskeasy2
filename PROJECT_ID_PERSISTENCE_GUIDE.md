# Project ID Management - System-Wide Implementation

## Overview
Project ID is now maintained throughout the entire application, preventing the "Project ID not available" error. The implementation uses:
1. **useProject Hook** - Primary source of project ID
2. **localStorage.currentProjectId** - Persistent backup
3. **Query Parameters** - For direct navigation
4. **Location State** - For redirect navigation

---

## Architecture

### Project ID Flow
```
useProject Hook
    ↓
Returns: projectId
    ↓
Used in Page Components
    ↓
Fallback to: localStorage.currentProjectId
    ↓
Component Operations
    ↓
Save to: localStorage.currentProjectId
```

### Data Sources (in order of precedence)
1. **location.state.project** - From navigation with state
2. **Query parameter ?projectId=** - From URL
3. **localStorage.currentProjectId** - Persistent storage
4. **Fetch from API** - If only ID is available

---

## Implementation Details

### 1. useProject Hook (`src/hooks/useProject.js`)

**What it does:**
- Extracts projectId from navigation state
- Extracts projectId from URL query parameters
- Falls back to localStorage.currentProjectId
- Fetches full project data if only ID available
- **Saves projectId to localStorage.currentProjectId** ✅

**Key Features:**
```javascript
// Saves to localStorage on successful project fetch
localStorage.setItem('currentProjectId', projectId);

// Returns projectId for component use
return {
  project,
  projectName,
  projectInitial,
  projectId,  // ← Always available
  loading,
  error,
};
```

### 2. Page Components

**Time Log Summary** (`src/pages/timelogsummary.jsx`)
```javascript
const { projectName, projectId } = useProject();

// Fallback to localStorage if hook doesn't return projectId
const pId = projectId || localStorage.getItem('currentProjectId');

if (pId) {
  fetchTimeLogData(pId, dates);
}
```

**Delivery Page** (`src/pages/deliverypage.jsx`)
```javascript
const { projectName, projectInitial, projectId } = useProject();

// Uses same fallback pattern
const storedProjectId = projectId || localStorage.getItem('currentProjectId');
```

### 3. Sub-Components

**Sprint Component** (`src/components/project/boardSubitem/Sprint.jsx`)
```javascript
// Saves projectId when fetched
const projId = res.data.projects[0]._id;
setSelectedProjectId(projId);
localStorage.setItem('currentProjectId', projId);  // ← Updated to new key
```

---

## Storage Keys

### Old Key (Deprecated)
- `localStorage.selectedProjectId` - ❌ No longer used

### New Key (Current)
- `localStorage.currentProjectId` - ✅ Used throughout

**Migration:** All components updated to use `currentProjectId`

---

## Usage Pattern

### In Any Page Component:
```javascript
import { useProject } from '../hooks/useProject';

export default function MyPage() {
  const { projectId } = useProject();
  
  // Always get projectId with fallback
  const pId = projectId || localStorage.getItem('currentProjectId');
  
  if (!pId) {
    return <div>Project ID not available</div>;
  }
  
  // Use pId for API calls
  api.get(`/projects/${pId}/data`);
}
```

### In Navigation:
```javascript
// Option 1: With state (recommended)
navigate('/timelogsummary', {
  state: { project: { _id: projectId, name: projectName } }
});

// Option 2: With query parameter
navigate(`/timelogsummary?projectId=${projectId}`);

// Option 3: Using localStorage (automatic via hook)
// No need to pass anything - hook will get it
```

---

## Files Updated

| File | Changes | Status |
|------|---------|--------|
| `src/hooks/useProject.js` | Added localStorage persistence | ✅ Done |
| `src/pages/timelogsummary.jsx` | Uses projectId with fallback | ✅ Done |
| `src/pages/deliverypage.jsx` | Updated to use currentProjectId | ✅ Done |
| `src/components/project/boardSubitem/Sprint.jsx` | Saves as currentProjectId | ✅ Done |

---

## How Project ID Persists

### Scenario 1: Navigate from Project List
```
1. User on Projects page
2. Clicks "Time Log Summary"
3. Navigation includes state with project
4. useProject extracts and saves projectId
5. localStorage.currentProjectId = projectId
6. Page loads with project data
```

### Scenario 2: Direct URL Navigation
```
1. User navigates to /timelogsummary?projectId=123
2. useProject extracts from query param
3. Saves to localStorage.currentProjectId
4. Page loads with projectId from localStorage
```

### Scenario 3: Page Refresh
```
1. User on /timelogsummary with active project
2. Refreshes page
3. useProject has no location state
4. Reads from localStorage.currentProjectId
5. Page loads with same projectId
6. No error displayed
```

### Scenario 4: Browser Back/Forward
```
1. User navigates back to home
2. Returns to /timelogsummary
3. useProject restores from localStorage
4. Same project remains active
5. Seamless experience
```

---

## Error Prevention

### Before (Old Implementation)
```
❌ No project ID on page refresh
❌ No project ID on direct navigation
❌ No project ID on back button
❌ "Project ID not available" error
```

### After (New Implementation)
```
✅ projectId saved to localStorage
✅ projectId restored on any navigation
✅ projectId persists across sessions
✅ All pages have access to projectId
```

---

## Testing the Implementation

### Test 1: Navigate and Refresh
1. Click project → Time Log Summary
2. Page loads ✅
3. Refresh page
4. Data still loads ✅

### Test 2: Direct URL
1. Go to `/timelogsummary?projectId=<id>`
2. Page loads with data ✅
3. Refresh
4. Data still loads ✅

### Test 3: Browser Back
1. Navigate to project
2. Go to Time Log Summary
3. Click back button
4. Go forward button
5. Page loads with data ✅

### Test 4: Multiple Projects
1. Switch to Project A
2. Go to Time Log Summary
3. Switch to Project B
4. Go to Time Log Summary
5. Each shows correct data ✅

---

## Best Practices

### ✅ DO:
- Use `useProject()` hook first
- Always have fallback to localStorage
- Store projectId when it changes
- Validate projectId before API calls

### ❌ DON'T:
- Rely solely on URL parameters
- Assume projectId will always be in props
- Use old localStorage.selectedProjectId
- Skip the fallback pattern

---

## Code Examples

### Example 1: API Call with Fallback
```javascript
const { projectId } = useProject();
const pId = projectId || localStorage.getItem('currentProjectId');

useEffect(() => {
  if (!pId) {
    setError('Project ID not available');
    return;
  }
  
  fetch(`/api/projects/${pId}/data`)
    .then(res => res.json())
    .then(data => setData(data));
}, [pId]);
```

### Example 2: Navigation with Project
```javascript
const handleNavigate = (projectId) => {
  localStorage.setItem('currentProjectId', projectId);
  navigate('/timelogsummary', {
    state: { project: { _id: projectId } }
  });
};
```

### Example 3: Component with Multiple Projects
```javascript
const [projects, setProjects] = useState([]);
const { projectId: activeProjectId } = useProject();

const handleSelectProject = (projectId) => {
  localStorage.setItem('currentProjectId', projectId);
  setSelectedProjectId(projectId);
  // Fetch data for this project
};
```

---

## localStorage Keys Reference

### Current Keys Used:
```javascript
localStorage.getItem('token')           // User authentication
localStorage.getItem('user')            // User info
localStorage.getItem('currentProjectId') // Current project ← NEW
```

### Deprecated Keys:
```javascript
localStorage.getItem('selectedProjectId') // OLD - Don't use
```

---

## Troubleshooting

### Issue: "Project ID not available"

**Check:**
1. Is useProject hook being used?
   ```javascript
   const { projectId } = useProject();
   ```

2. Is there a fallback?
   ```javascript
   const pId = projectId || localStorage.getItem('currentProjectId');
   ```

3. Is projectId being saved?
   ```javascript
   localStorage.setItem('currentProjectId', projectId);
   ```

4. Check localStorage in DevTools
   ```javascript
   // Console: localStorage.currentProjectId
   ```

### Solution:
- Ensure component uses useProject hook
- Add localStorage fallback
- Save projectId when it changes
- Test with localStorage cleared (refresh)

---

## Summary

**The project ID system now:**
- ✅ Persists across navigation
- ✅ Survives page refresh
- ✅ Works with direct URLs
- ✅ Handles browser back/forward
- ✅ Available on all pages
- ✅ Has proper fallbacks
- ✅ Prevents errors

**All pages can now:** Safely access projectId without checking multiple sources or encountering "Project ID not available" errors.

---

## Migration Checklist

For any new pages that need project ID:

- [ ] Import useProject hook
- [ ] Extract projectId from hook
- [ ] Add localStorage fallback
- [ ] Display error if no projectId
- [ ] Use pId for API calls
- [ ] Save projectId on change
- [ ] Test refresh
- [ ] Test direct navigation
- [ ] Test back button

---

**Status**: ✅ Fully Implemented and Tested
**Last Updated**: January 2025
