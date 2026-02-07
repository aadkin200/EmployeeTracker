import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UserService } from '../../services/user';
import { User } from '../../models/user';
import { DEPARTMENTS, Department } from '../../constants/constants';

type Role = 'USER' | 'MANAGER' | 'ADMIN';

type DeptRow = {
  department: Department;
  headcount: number;
  totalSalary: number;
  avgSalary: number;
};

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './report.html',
  styleUrls: ['./report.scss'],
})
export class Report {
  readonly departments = DEPARTMENTS;

  me = signal<User | null>(null);
  users = signal<User[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  role = computed<Role>(() => (this.me()?.role as Role) ?? 'USER');
  myDept = computed(() => (this.me()?.department || '') as Department | string);

  generatedAt = signal<Date | null>(null);

  visibleDepartments = computed<Department[]>(() => {
    const r = this.role();
    if (r === 'ADMIN') return [...this.departments];
    if (r === 'MANAGER') {
      const d = this.myDept();
      return this.departments.includes(d as Department) ? [d as Department] : [];
    }
    return [];
  });

  rows = computed<DeptRow[]>(() => {
    const allowed = new Set(this.visibleDepartments().map((d) => d.toLowerCase()));
    const list = this.users().filter((u) => allowed.has((u.department || '').toLowerCase()));

    return this.visibleDepartments().map((dept) => {
      const deptUsers = list.filter(
        (u) => (u.department || '').toLowerCase() === dept.toLowerCase(),
      );

      const headcount = deptUsers.length;
      const totalSalary = deptUsers.reduce((sum, u) => sum + this.parseSalary(u.salary), 0);
      const avgSalary = headcount ? totalSalary / headcount : 0;

      return { department: dept, headcount, totalSalary, avgSalary };
    });
  });

  totalHeadcount = computed(() => this.rows().reduce((s, r) => s + r.headcount, 0));
  totalSpend = computed(() => this.rows().reduce((s, r) => s + r.totalSalary, 0));

  constructor(private userService: UserService) {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.userService.getMe().subscribe({
      next: (me) => {
        this.me.set(me);

        if ((me.role as Role) === 'USER') {
          this.loading.set(false);
          this.error.set('Reports are available to MANAGER and ADMIN accounts only.');
          return;
        }

        this.userService.getAllUsers().subscribe({
          next: (users) => {
            this.users.set(users);
            this.generatedAt.set(new Date());
            this.loading.set(false);
          },
          error: () => {
            this.error.set('Failed to load users for the report.');
            this.loading.set(false);
          },
        });
      },
      error: () => {
        this.error.set('Failed to load your profile. Please login again.');
        this.loading.set(false);
      },
    });
  }

  private parseSalary(value: any): number {
    if (value == null) return 0;
    if (typeof value === 'number') return isFinite(value) ? value : 0;

    const cleaned = String(value).replace(/[$,]/g, '').trim();

    const num = Number(cleaned);
    return isFinite(num) ? num : 0;
  }

  formatMoney(n: number): string {
    return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  }
}
