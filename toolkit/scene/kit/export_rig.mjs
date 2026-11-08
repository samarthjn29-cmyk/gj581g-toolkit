// Writes the kit rig as JSON for the validator (the .mjs stays the single source).
import fs from 'fs'; import {RIG} from './librarian.mjs';
fs.writeFileSync(new URL('./librarian_rig.json', import.meta.url), JSON.stringify(RIG, null, 1)); console.log('ok', RIG.parts.length);
