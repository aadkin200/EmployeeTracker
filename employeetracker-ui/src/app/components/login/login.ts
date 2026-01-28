import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';

type Role = 'USER' | 'MANAGER' | 'ADMIN';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  private fb = inject(NonNullableFormBuilder);
  private auth = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  errorMsg: string | null = null;

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit() {
    this.errorMsg = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    const payload = { email: email.trim().toLowerCase(), password };

    this.loading = true;
    this.cdr.markForCheck();

    this.auth
      .login(payload)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => {
          // token saved — now try /user/me
          this.userService.getMe().subscribe({
            next: (me) => {
              const role = (me.role as Role) ?? 'USER';
              this.router.navigate([
                role === 'ADMIN' || role === 'MANAGER' ? '/dashboard' : '/profile',
              ]);
            },
            error: () => {
              this.errorMsg =
                'Login succeeded, but /user/me returned 403. Token not being accepted.';
              this.cdr.markForCheck();
            },
          });
        },
        error: () => {
          this.errorMsg = 'Invalid email or password.';
          this.cdr.markForCheck();
        },
      });
  }
}
