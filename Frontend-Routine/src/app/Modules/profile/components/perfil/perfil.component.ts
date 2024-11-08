import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../Services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.user = this.authService.currentUserValue;
  }
}
