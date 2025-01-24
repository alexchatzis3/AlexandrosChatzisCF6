import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbar, MatCard, MatCardTitle, MatCardContent]
})
export class DashboardComponent implements OnInit {
  username: string = '';
  role: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.role = this.authService.getUserRole();
    console.log("Username: ", this.username);
    console.log("Role: ", this.role);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
