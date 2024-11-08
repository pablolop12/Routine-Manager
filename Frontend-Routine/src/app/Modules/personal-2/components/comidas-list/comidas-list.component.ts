import { Component, OnInit } from '@angular/core';
import { ComidaService } from '../../../../Services/comida.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comidas-list',
  templateUrl: './comidas-list.component.html',
  styleUrls: ['./comidas-list.component.scss']
})
export class ComidasListComponent implements OnInit {
  comidas: any[] = [];
  filteredComidas: any[] = [];
  searchTerm: string = '';
  selectedTipoComida: string = '';
  tiposComida: string[] = ['Desayuno', 'Media Mañana', 'Comida', 'Merienda', 'Cena', 'Todos'];

  constructor(private comidaService: ComidaService, private router: Router) { }

  ngOnInit(): void {
    this.loadComidas();
  }

  loadComidas(): void {
    this.comidaService.getAllComidas().subscribe(
      (data: any[]) => {
        this.comidas = data;
        this.filteredComidas = data;
      },
      (error: any) => {
        console.error('Error loading comidas:', error);
      }
    );
  }

  filterComidas(): void {
    let comidas = this.comidas;

    if (this.searchTerm) {
      comidas = comidas.filter(comida => 
        comida.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        comida.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedTipoComida && this.selectedTipoComida !== 'Todos') {
      comidas = comidas.filter(comida => comida.tipoComida === this.selectedTipoComida);
    }

    this.filteredComidas = comidas;
  }

  editComida(id: number): void {
    this.router.navigate([`/nutricion/comidas/edit/${id}`]);
  }

  deleteComida(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.comidaService.deleteComida(id).subscribe(
          () => {
            this.loadComidas();
            Swal.fire(
              '¡Eliminada!',
              'La comida ha sido eliminada.',
              'success'
            );
          },
          (error: any) => {
            console.error('Error deleting comida:', error);
            Swal.fire(
              'Error',
              'la comida no se ha eliminado, asegúrese de no tener dietas usando esta comida.',
              'error'
            );
          }
        );
      }
    });
  }
}
