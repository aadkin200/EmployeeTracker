import { Component, inject } from '@angular/core';
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

    this.auth
      .login(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.userService.getMe().subscribe({
            next: (me) => {
              // ✅ store current user so navbar can react
              this.userService.setMe(me);

              const role = (me.role as Role) ?? 'USER';
              this.router.navigate([
                role === 'ADMIN' || role === 'MANAGER' ? '/dashboard' : '/profile',
              ]);
            },
            error: () => {
              this.errorMsg =
                'Logged in, but failed to load profile. Check JWT interceptor and /user/me.';
            },
          });
        },
        error: () => {
          this.errorMsg = 'Invalid email or password.';
        },
      });
  }
}
