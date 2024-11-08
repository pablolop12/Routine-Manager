import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.userId = +id;
        this.loadUser(this.userId);
      }
    });
  }

  loadUser(id: number) {
    this.userService.getUserById(id).subscribe(user => {
      this.userForm.patchValue(user);
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    if (this.userId) {
      this.userService.updateUser(this.userId, this.userForm.value).subscribe(() => {
        Swal.fire('Actualizado', 'El usuario ha sido actualizado correctamente', 'success');
        this.router.navigate(['/gestion/users']);
      }, error => {
        Swal.fire('Error', 'Hubo un problema al actualizar el usuario', 'error');
      });
    } else {
      // Lógica para crear un usuario nuevo si es necesario
    }
  }
}
