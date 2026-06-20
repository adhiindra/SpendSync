import Dexie, { type EntityTable } from 'dexie';

export type SyncStatus = 'SYNCED' | 'PENDING_CREATE' | 'PENDING_UPDATE' | 'PENDING_DELETE';

export interface LocalInstallment {
  id: string;
  userId: string;
  name: string;
  category: string;
  totalAmount: number;
  durationMonths: number;
  monthlyPayment: number;
  startDate: Date | string; // Dates are often stored as ISO strings
  status: string;
  notes: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  syncStatus: SyncStatus;
}

export interface LocalInstallmentPayment {
  id: string;
  installmentId: string;
  amount: number;
  dueDate: Date | string;
  isPaid: boolean;
  paidDate: Date | string | null;
  syncStatus: SyncStatus;
}

const db = new Dexie('FlowSyncDB') as Dexie & {
  installments: EntityTable<LocalInstallment, 'id'>;
  installmentPayments: EntityTable<LocalInstallmentPayment, 'id'>;
};

// Define the schema. Indexed fields are specified here.
db.version(1).stores({
  installments: 'id, userId, status, syncStatus, createdAt',
  installmentPayments: 'id, installmentId, isPaid, syncStatus, dueDate'
});

export { db };
