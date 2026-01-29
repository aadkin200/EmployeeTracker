// src/app/components/profile/profile.ts
// import { Component, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { finalize } from 'rxjs';

// import { UserService } from '../../services/user';
// import { User } from '../../models/user';

// @Component({
//   selector: 'app-profile',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './profile.html',
//   styleUrls: ['./profile.scss'],
// })
// export class Profile {
//   private fb = inject(NonNullableFormBuilder);
//   private userService = inject(UserService);

//   loading = false;
//   saving = false;

//   errorMsg: string | null = null;
//   successMsg: string | null = null;

//   me: User | null = null;

//   // Editable fields = personal info only
//   readonly form = this.fb.group({
//     firstName: ['', [Validators.required, Validators.maxLength(80)]],
//     lastName: ['', [Validators.required, Validators.maxLength(80)]],
//     phone: ['', [Validators.maxLength(30)]],
//   });

//   ngOnInit() {
//     this.load();
//   }

//   private load() {
//     this.loading = true;
//     this.errorMsg = null;
//     this.successMsg = null;

//     this.userService
//       .getMe()
//       .pipe(finalize(() => (this.loading = false)))
//       .subscribe({
//         next: (me) => {
//           this.me = me;

//           // populate editable fields only
//           this.form.patchValue({
//             firstName: me.firstName ?? '',
//             lastName: me.lastName ?? '',
//             phone: (me.phone as any) ?? '', // in case backend uses phone/phoneNumber mismatch
//           });

//           this.form.markAsPristine();
//         },
//         error: () => {
//           this.errorMsg = 'Failed to load your profile. Make sure you are logged in.';
//         },
//       });
//   }

//   save() {
//     this.errorMsg = null;
//     this.successMsg = null;

//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }
//     if (!this.me) return;

//     const { firstName, lastName, phone } = this.form.getRawValue();

//     // Only send allowed changes
//     const payload: Partial<User> = {
//       firstName: firstName.trim(),
//       lastName: lastName.trim(),
//       phone: phone?.trim() ?? '',
//     };

//     this.saving = true;

//     this.userService
//       .updateMe(payload)
//       .pipe(finalize(() => (this.saving = false)))
//       .subscribe({
//         next: (updated) => {
//           this.me = updated;
//           this.form.markAsPristine();
//           this.successMsg = 'Profile updated.';
//         },
//         error: () => {
//           this.errorMsg = 'Update failed. Try again.';
//         },
//       });
//   }
// }

// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { catchError, finalize, of, take } from 'rxjs';

// import { UserService } from '../../services/user';
// import { User } from '../../models/user';

// @Component({
//   selector: 'app-profile',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './profile.html',
//   styleUrls: ['./profile.scss'],
// })
// export class Profile implements OnInit {
//   private fb = inject(NonNullableFormBuilder);
//   private userService = inject(UserService);

//   loading = false;
//   saving = false;

//   errorMsg: string | null = null;
//   successMsg: string | null = null;

//   me: User | null = null;

//   readonly form = this.fb.group({
//     firstName: ['', [Validators.required, Validators.maxLength(80)]],
//     lastName: ['', [Validators.required, Validators.maxLength(80)]],
//     phone: ['', [Validators.maxLength(30)]],
//   });

//   ngOnInit(): void {
//     this.load();
//   }

//   private load(): void {
//     this.loading = true;
//     this.errorMsg = null;
//     this.successMsg = null;

//     this.userService
//       .getMe()
//       .pipe(
//         take(1), // ⬅️ prevents hanging / multi-emit streams
//         catchError((err) => {
//           console.error('getMe() failed:', err);
//           this.errorMsg = 'Failed to load your profile. Please make sure you are logged in.';
//           return of(null);
//         }),
//         finalize(() => {
//           this.loading = false; // ⬅️ always turns off loading
//         }),
//       )
//       .subscribe((me) => {
//         if (!me) {
//           this.me = null;
//           return;
//         }

//         this.me = me;

//         this.form.patchValue({
//           firstName: me.firstName ?? '',
//           lastName: me.lastName ?? '',
//           phone: (me.phone as any) ?? '',
//         });

//         this.form.markAsPristine();
//       });
//   }

//   save(): void {
//     if (!this.me || this.form.invalid) {
//       return;
//     }

//     this.saving = true;
//     this.errorMsg = null;
//     this.successMsg = null;

//     const payload = {
//       ...this.me,
//       ...this.form.getRawValue(),
//     };

//     this.userService
//       .updateMe(payload)
//       .pipe(
//         take(1),
//         catchError((err) => {
//           console.error('updateMe() failed:', err);
//           this.errorMsg = 'Failed to save your profile.';
//           return of(null);
//         }),
//         finalize(() => {
//           this.saving = false;
//         }),
//       )
//       .subscribe((updated) => {
//         if (!updated) {
//           return;
//         }

//         this.me = updated;
//         this.form.markAsPristine();
//         this.successMsg = 'Profile updated successfully.';
//       });
//   }
// }

// src/app/components/profile/profile.ts
import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { UserService } from '../../services/user';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile {
  private fb = inject(NonNullableFormBuilder);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  saving = false;

  errorMsg: string | null = null;
  successMsg: string | null = null;

  me: User | null = null;

  // Editable fields = personal info only
  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.maxLength(80)]],
    phone: ['', [Validators.maxLength(30)]],
  });

  ngOnInit() {
    this.load();
  }

  private load() {
    this.loading = true;
    this.errorMsg = null;
    this.successMsg = null;
    this.cdr.detectChanges(); // render "loading" immediately (zoneless)

    this.userService
      .getMe()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges(); // ensure spinner stops (zoneless)
        }),
      )
      .subscribe({
        next: (me) => {
          this.me = me;

          // populate editable fields only
          this.form.patchValue({
            firstName: me.firstName ?? '',
            lastName: me.lastName ?? '',
            phone: (me.phone ?? '') as any, // keep if your model type is strict; otherwise remove "as any"
          });

          this.form.markAsPristine();
          this.cdr.detectChanges(); // make UI update immediately (zoneless)
        },
        error: () => {
          this.errorMsg = 'Failed to load your profile. Make sure you are logged in.';
          this.cdr.detectChanges(); // show error immediately (zoneless)
        },
      });
  }

  save() {
    this.errorMsg = null;
    this.successMsg = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.detectChanges(); // show validation immediately (zoneless)
      return;
    }
    if (!this.me) return;

    const { firstName, lastName, phone } = this.form.getRawValue();

    // Only send allowed changes
    const payload: Partial<User> = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim() ?? '',
    };

    this.saving = true;
    this.cdr.detectChanges(); // render "saving" immediately (zoneless)

    this.userService
      .updateMe(payload)
      .pipe(
        finalize(() => {
          this.saving = false;
          this.cdr.detectChanges(); // stop saving state (zoneless)
        }),
      )
      .subscribe({
        next: (updated) => {
          this.me = updated;
          this.form.patchValue({
            firstName: updated.firstName ?? '',
            lastName: updated.lastName ?? '',
            phone: (updated.phone ?? '') as any,
          });
          this.form.markAsPristine();
          this.successMsg = 'Profile updated.';
          this.cdr.detectChanges(); // show success + updated data immediately (zoneless)
        },
        error: () => {
          this.errorMsg = 'Update failed. Try again.';
          this.cdr.detectChanges(); // show error immediately (zoneless)
        },
      });
  }
}
