/*
Script: repair_project_isolation.js
Purpose: Scan core collections for documents missing projectId (null/undefined) and optionally delete them.
Usage:
  node backend/scripts/repair_project_isolation.js --list
  node backend/scripts/repair_project_isolation.js --delete

Notes:
- Reads MONGODB_URI from environment.
- Does NOT assign orphaned records to any project automatically. It reports and can delete when --delete provided.
- Run in maintenance window. Backup DB before deletion.
*/

const mongoose = require('mongoose');
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const models = {
  WorkItem: require('../models/WorkItem'),
  Sprint: require('../models/Sprint'),
  DeliveryPlan: require('../models/DeliveryPlan'),
  Board: require('../models/Board'),
  Pipeline: require('../models/Pipeline'),
  WikiPage: require('../models/WikiPage'),
};

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in environment');
    process.exit(1);
  }

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const report = {};

  for (const [name, Model] of Object.entries(models)) {
    // Count documents where projectId is null, missing or not an ObjectId
    const orphans = await Model.find({ $or: [{ projectId: { $exists: false } }, { projectId: null }] }).lean();
    report[name] = orphans.length;
    console.log(`Model ${name}: found ${orphans.length} orphaned documents`);
    if (orphans.length && argv.delete) {
      const ids = orphans.map(d => d._id);
      const res = await Model.deleteMany({ _id: { $in: ids } });
      console.log(`Deleted ${res.deletedCount} documents from ${name}`);
    }
  }

  console.log('Scan complete. Summary:', report);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error during repair script:', err);
  process.exit(1);
});
