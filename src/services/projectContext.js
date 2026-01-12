// Minimal projectContext service: keeps in-memory value + localStorage
const KEY_ID = 'activeProjectId';
const KEY_NAME = 'activeProjectName';

const projectContext = {
  getActiveProjectId() {
    try { return localStorage.getItem(KEY_ID); } catch { return null; }
  },
  setActiveProjectId(id) {
    try { localStorage.setItem(KEY_ID, id); } catch {}
  },
  getActiveProjectName() {
    try { return localStorage.getItem(KEY_NAME); } catch { return null; }
  },
  setActiveProjectName(name) {
    try { if (name) localStorage.setItem(KEY_NAME, name); else localStorage.removeItem(KEY_NAME); } catch {}
  },
  clearActiveProject() {
    try { localStorage.removeItem(KEY_ID); localStorage.removeItem(KEY_NAME); } catch {}
  }
};

export default projectContext;
