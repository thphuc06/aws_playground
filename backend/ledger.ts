export interface SpendLedger {reserve(microDollars:number):Promise<boolean>;remaining():number}

/** Per-process reservation guard. Restarts create a fresh allowance; no durable billing cap. */
export class MemoryLedger implements SpendLedger {
  private used = 0;

  constructor(private readonly budget:number) {
    if (!Number.isSafeInteger(budget) || budget <= 0 || budget > 1_000_000) {
      throw new Error('Explicit per-process budget >0 and <=1 USD required.');
    }
  }

  remaining() { return this.budget - this.used; }

  async reserve(amount:number):Promise<boolean> {
    if (!Number.isSafeInteger(amount) || amount <= 0 || amount > this.remaining()) return false;
    // No await before increment: concurrent reservations cannot spend the same balance.
    // Provider failures never refund this reservation during the process lifetime.
    this.used += amount;
    return true;
  }
}
