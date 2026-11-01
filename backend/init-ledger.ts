import {initializeLedger} from './ledger';
import {budgetMicros} from './server';
// Explicit operator command only. Never runs during boot or build; no API calls.
initializeLedger(process.env.REVIEW_LEDGER_PATH||'',budgetMicros(process.env.REVIEW_BUDGET_USD)).then(()=>console.log('Created a new capped review ledger. Existing ledgers are never overwritten.')).catch(()=>{console.error('Ledger not initialized. Verify explicit budget/path, existing state and directory permissions.');process.exitCode=1});
