import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { UserService } from '../../services/user';
import { User } from '../../models/user';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search.html',
  styleUrls: ['./search.scss'],
})
export class Search {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  loading = signal(false);
  error = signal<string | null>(null);
  results = signal<User[]>([]);

  query = signal<string>('');

  title = computed(() => {
    const q = this.query();
    return q ? `Search results for "${q}"` : 'Search';
  });

  constructor() {
    // react to URL query changes: /search?q=...
    this.route.queryParamMap.subscribe((params) => {
      const q = (params.get('q') ?? '').trim();
      this.query.set(q);
      this.runSearch(q);
    });
  }

  private runSearch(q: string) {
    this.error.set(null);
    this.results.set([]);

    if (!q) return;

    this.loading.set(true);

    this.userService
      .searchUsers(q)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (users) => this.results.set(users),
        error: () => this.error.set('Search failed. Try again.'),
      });
  }

  fullName(u: User) {
    return `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email;
  }
}
