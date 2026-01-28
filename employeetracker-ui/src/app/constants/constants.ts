export const DEPARTMENTS = ['HR', 'IT', 'Accounting', 'Marketing', 'Sales', 'Operations'] as const;

export type Department = (typeof DEPARTMENTS)[number];
