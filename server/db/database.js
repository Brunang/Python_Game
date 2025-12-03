// Compatibility wrapper to support legacy imports from '../db/database.js'
// Delegates to the modern implementation in 'src/models/database.js'

import { initializeDatabase, getDatabase } from '../src/models/database.js';

export { initializeDatabase, getDatabase };
