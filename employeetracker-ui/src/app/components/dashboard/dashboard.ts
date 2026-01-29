import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { UserService } from '../../services/user';
import { User } from '../../models/user';
import { DEPARTMENTS, Department } from '../../constants/constants';
import { AuthService } from '../../services/auth';

type Role = 'USER' | 'MANAGER' | 'ADMIN';

type UserUpsert = Partial<User> & {
  email?: string;
  password?: string; // only used for create
};

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

  // Admin UI state
  showCreate = signal(false);
  showEdit = signal(false);
  saving = signal(false);
  actionError = signal<string | null>(null);

  createDraft = signal<UserUpsert>({
    role: 'USER',
    department: 'HR',
    salary: '',
    title: '',
    phone: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  editTarget = signal<User | null>(null);
  editDraft = signal<UserUpsert>({});

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

  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {
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
          return;
        }

        this.userService.getAllUsers().subscribe({
          next: (users) => {
            this.users.set(users);

            if ((me.role as Role) === 'MANAGER') {
              const dept = (me.department || '') as Department;
              if (this.departments.includes(dept)) this.selectedDept.set(dept);
            }

            if ((me.role as Role) === 'ADMIN') {
              const firstWithPeople = this.departments.find((d) =>
                users.some((u) => (u.department || '').toLowerCase() === d.toLowerCase()),
              );
              if (firstWithPeople) this.selectedDept.set(firstWithPeople);
            }

            this.loading.set(false);
          },
          error: () => {
            this.error.set('Failed to load users.');
            this.loading.set(false);
          },
        });
      },
      error: () => {
        this.error.set('Failed to load your profile.');
        this.loading.set(false);
      },
    });
  }

  selectDept(d: Department) {
    this.selectedDept.set(d);
  }

  deptCount(d: Department) {
    return this.users().filter((u) => (u.department || '').toLowerCase() === d.toLowerCase())
      .length;
  }

  fullName(u: User) {
    return `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email;
  }

  // ---------- ADMIN: CREATE ----------
  openCreate() {
    this.actionError.set(null);
    this.createDraft.set({
      role: 'USER',
      department: this.selectedDept(),
      salary: '',
      title: '',
      phone: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
    this.showCreate.set(true);
  }

  closeCreate() {
    if (this.saving()) return;
    this.showCreate.set(false);
  }

  setCreateField<K extends keyof UserUpsert>(key: K, value: UserUpsert[K]) {
    this.createDraft.update((d) => ({ ...d, [key]: value }));
  }

  createUser() {
    if (this.role() !== 'ADMIN') return;

    const draft = this.createDraft();
    const email = (draft.email || '').trim().toLowerCase();
    const password = draft.password || '';

    if (!email || !password) {
      this.actionError.set('Email and password are required.');
      return;
    }

    this.saving.set(true);
    this.actionError.set(null);

    // IMPORTANT: adjust this method/endpoint in your UserService.
    this.authService
      .createUser({
        ...draft,
        email,
        password,
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (created) => {
          // add to list
          this.users.update((list) => [created, ...list]);
          // keep tabs consistent
          this.selectedDept.set((created.department || this.selectedDept()) as Department);
          this.showCreate.set(false);
        },
        error: () => {
          this.actionError.set(
            'Failed to create user. Check backend /auth/register and validation.',
          );
        },
      });
  }

  // ---------- ADMIN: EDIT ----------
  openEdit(u: User) {
    if (this.role() !== 'ADMIN') return;

    this.actionError.set(null);
    this.editTarget.set(u);
    this.editDraft.set({
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      department: u.department,
      role: (u.role as Role) ?? 'USER',
      title: u.title,
      salary: u.salary,
      phone: u.phone,
    });
    this.showEdit.set(true);
  }

  closeEdit() {
    if (this.saving()) return;
    this.showEdit.set(false);
    this.editTarget.set(null);
  }

  setEditField<K extends keyof UserUpsert>(key: K, value: UserUpsert[K]) {
    this.editDraft.update((d) => ({ ...d, [key]: value }));
  }

  saveEdit() {
    if (this.role() !== 'ADMIN') return;

    const target = this.editTarget();
    if (!target?.id) return;

    const payload = this.editDraft();
    const safeEmail = (payload.email || '').trim().toLowerCase();

    this.saving.set(true);
    this.actionError.set(null);

    this.userService
      .updateUserById(target.id, { ...payload, email: safeEmail })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (updated) => {
          this.users.update((list) => list.map((u) => (u.id === updated.id ? updated : u)));
          this.showEdit.set(false);
          this.editTarget.set(null);
        },
        error: () => {
          this.actionError.set('Failed to update user.');
        },
      });
  }

  // ---------- ADMIN: DELETE ----------
  deleteUser(u: User) {
    if (this.role() !== 'ADMIN') return;
    if (!u?.id) return;

    const ok = confirm(`Delete ${u.email}? This cannot be undone.`);
    if (!ok) return;

    this.saving.set(true);
    this.actionError.set(null);

    this.userService
      .deleteUserById(u.id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.users.update((list) => list.filter((x) => x.id !== u.id));
        },
        error: () => {
          this.actionError.set('Failed to delete user.');
        },
      });
  }
}
