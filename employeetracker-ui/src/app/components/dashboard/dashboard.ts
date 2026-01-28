import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user';
import { User } from '../../models/user';
import { DEPARTMENTS, Department } from '../../constants/constants';
import { RouterModule } from '@angular/router';

type Role = 'USER' | 'MANAGER' | 'ADMIN';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
  readonly departments = DEPARTMENTS;

  me = signal<User | null>(null);
  users = signal<User[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // selected tab (admin)
  selectedDept = signal<Department>('HR');

  role = computed<Role>(() => (this.me()?.role as Role) ?? 'USER');
  myDept = computed(() => (this.me()?.department || '') as Department | string);

  // what dept(s) this dashboard should show
  visibleDepartments = computed<Department[]>(() => {
    if (this.role() === 'ADMIN') return [...this.departments];
    if (this.role() === 'MANAGER') {
      const dept = this.myDept();
      return this.departments.includes(dept as Department) ? [dept as Department] : [];
    }
    return [];
  });

  // filtered list for the selected tab (admin) OR manager dept (only one)
  filteredUsers = computed(() => {
    const all = this.users();
    const r = this.role();

    if (r === 'ADMIN') {
      return all.filter(
        (u) => (u.department || '').toLowerCase() === this.selectedDept().toLowerCase(),
      );
    }

    if (r === 'MANAGER') {
      const dept = this.myDept();
      return all.filter((u) => (u.department || '').toLowerCase() === String(dept).toLowerCase());
    }

    return [];
  });

  constructor(private userService: UserService) {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    // Step 1: get me
    this.userService.getMe().subscribe({
      next: (me) => {
        this.me.set(me);

        // USER shouldn't even be here (they should be routed to /profile),
        // but in case they land here, we just stop.
        if ((me.role as Role) === 'USER') {
          this.loading.set(false);
          return;
        }

        // Step 2: load all users (admin/manager)
        this.userService.getAllUsers().subscribe({
          next: (users) => {
            this.users.set(users);

            // manager: auto-select their department if valid
            if ((me.role as Role) === 'MANAGER') {
              const dept = (me.department || '') as Department;
              if (this.departments.includes(dept)) this.selectedDept.set(dept);
            }

            // admin: pick first dept tab with people, otherwise default
            if ((me.role as Role) === 'ADMIN') {
              const firstWithPeople = this.departments.find((d) =>
                users.some((u) => (u.department || '').toLowerCase() === d.toLowerCase()),
              );
              if (firstWithPeople) this.selectedDept.set(firstWithPeople);
            }

            this.loading.set(false);
          },
          error: (err) => {
            this.error.set('Failed to load users.');
            this.loading.set(false);
          },
        });
      },
      error: (err) => {
        this.error.set('Failed to load your profile.');
        this.loading.set(false);
      },
    });
  }

  selectDept(d: Department) {
    this.selectedDept.set(d);
  }

  // optional helpers for UI
  deptCount(d: Department) {
    return this.users().filter((u) => (u.department || '').toLowerCase() === d.toLowerCase())
      .length;
  }

  fullName(u: User) {
    return `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email;
  }
}
