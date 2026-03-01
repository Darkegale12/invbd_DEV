export type UserRole = 'pcmc' | 'dbt' | 'nashik';

export interface AppUser {
  username: string;
  passcode: string;
  role: UserRole;
  displayName: string;
  organization: string;
}

export const APP_USERS: AppUser[] = [
  {
    username: 'pcmcadmin',
    passcode: 'pcmc123',
    role: 'pcmc',
    displayName: 'PCMC Administrator',
    organization: 'Pimpri-Chinchwad Municipal Corporation',
  },
  {
    username: 'dbtadmin',
    passcode: 'dbt123',
    role: 'dbt',
    displayName: 'DBT Field Officer',
    organization: 'DBT – Lotus Pond / MMCOE Hill',
  },
  {
    username: 'nashikadmin',
    passcode: 'nashik123',
    role: 'nashik',
    displayName: 'Nashik Administrator',
    organization: 'Nashik Municipal Corporation',
  },
];

export function authenticate(username: string, passcode: string): AppUser | null {
  return APP_USERS.find(u => u.username === username && u.passcode === passcode) ?? null;
}
