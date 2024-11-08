import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  selectedRole: string = '';
  roles: string[] = ['ADMIN', 'EMPLEADO', 'USER']; // Ajusta los roles según tus necesidades

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      this.filteredUsers = this.users;
    });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearchTerm = user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = this.selectedRole === 'todo' || user.role === this.selectedRole || this.selectedRole === '';
      return matchesSearchTerm && matchesRole;
    });
  }

  confirmDelete(user: any) {
    console.log('User to delete:', user); // Añade este console.log para depuración
    if (!user || !user.email) {
      Swal.fire('Error', 'No se pudo obtener el email del usuario', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      html: `Esta acción no se puede deshacer. <br> <br> Escriba el email del usuario <strong>${user.email}</strong> para confirmar:`,
      input: 'text',
      inputPlaceholder: 'Email',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      preConfirm: (inputEmail) => {
        if (inputEmail !== user.email) {
          Swal.showValidationMessage('El email no coincide. Inténtelo de nuevo.');
          return false;
        }
        return true;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser(user.id);
      }
    });
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success');
      this.loadUsers();
    }, error => {
      Swal.fire('Error', 'Hubo un problema al eliminar el usuario', 'error');
    });
  }
}
