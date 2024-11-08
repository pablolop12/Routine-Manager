import { Component, OnInit } from '@angular/core';
import { EjercicioService } from '../../../../Services/ejercicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ejercicio-list',
  templateUrl: './ejercicio-list.component.html',
  styleUrls: ['./ejercicio-list.component.scss']
})
export class EjercicioListComponent implements OnInit {
  ejercicios: any[] = [];
  filteredEjercicios: any[] = [];
  searchTerm: string = '';
  selectedCategoria: string = '';
  categorias: string[] = ['Brazos', 'Pecho', 'Abdominales', 'Espalda', 'Piernas'];

  constructor(private ejercicioService: EjercicioService) { }

  ngOnInit(): void {
    this.loadEjercicios();
  }

  loadEjercicios() {
    this.ejercicioService.getEjercicios().subscribe(data => {
      this.ejercicios = data;
      this.filteredEjercicios = data;
    }, error => {
      Swal.fire('Error', 'Hubo un problema al cargar los ejercicios', 'error');
    });
  }

  filterEjercicios() {
    this.filteredEjercicios = this.ejercicios.filter(ejercicio =>
      ejercicio.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.selectedCategoria === 'todo' || this.selectedCategoria === '' || ejercicio.categoria === this.selectedCategoria)
    );
  }

  confirmDeleteEjercicio(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteEjercicio(id);
      }
    });
  }

  deleteEjercicio(id: number) {
    this.ejercicioService.deleteEjercicio(id).subscribe(() => {
      this.loadEjercicios();
      Swal.fire('Eliminado', 'El ejercicio ha sido eliminado', 'success');
    }, error => {
      Swal.fire('Error', 'El ejercicio no se ha eliminado, asegúrese de que no haya rutinas con este ejercicio', 'error');
    });
  }

}
