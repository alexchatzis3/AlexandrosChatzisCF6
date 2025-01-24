import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [MatToolbar, MatCard, MatCardContent]
})
export class HomeComponent {}
