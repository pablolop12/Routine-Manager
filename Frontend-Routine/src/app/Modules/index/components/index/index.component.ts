import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../Services/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  isLoggedIn = false;
  user: any = {};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user) => {
      this.isLoggedIn = !!user;
      this.user = user;
    });
  }
}
