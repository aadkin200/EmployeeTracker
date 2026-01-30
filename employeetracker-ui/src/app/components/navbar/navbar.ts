import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  constructor(
    public auth: AuthService,
    private router: Router,
    public userService: UserService,
  ) {}

  logout() {
    this.auth.logout();
    this.userService.clearMe();
    this.router.navigate(['/login']);
  }

  onSearchEnter(value: string) {
    const q = value.trim();
    if (!q) return;
    this.router.navigate(['/search'], { queryParams: { q } });
  }
}
