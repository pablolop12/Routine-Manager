import { Component, OnInit } from '@angular/core';
import { RutinaService } from '../../../../../Services/rutina.service';
import { EjercicioService } from '../../../../../Services/ejercicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rutina-manager',
  templateUrl: './rutina-manager.component.html',
  styleUrls: ['./rutina-manager.component.scss']
})
export class RutinaManagerComponent implements OnInit {
  rutinas: any[] = [];
  currentRutinas: any[] = [];
  pages: number[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 3;
  ejercicios: any[] = [];
  daysOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  constructor(private rutinaService: RutinaService, private ejercicioService: EjercicioService) { }

  ngOnInit(): void {
    this.loadRutinas();
    this.loadEjercicios();
  }

  loadRutinas() {
    this.rutinaService.getRutinasByUser().subscribe(data => {
      this.rutinas = data;
      this.sortRutinas(); // Ordenar rutinas para que la activa esté primero
      this.setupPagination();
      this.updateCurrentRutinas();
    });
  }

  loadEjercicios() {
    this.ejercicioService.getEjercicios().subscribe(data => {
      this.ejercicios = data;
    });
  }

  sortRutinas() {
    this.rutinas.sort((a, b) => b.active - a.active);
  }

  setupPagination() {
    const numberOfPages = Math.ceil(this.rutinas.length / this.itemsPerPage);
    this.pages = Array.from({ length: numberOfPages }, (_, i) => i);
  }

  updateCurrentRutinas() {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.currentRutinas = this.rutinas.slice(start, end);
  }

  setPage(page: number) {
    this.currentPage = page;
    this.updateCurrentRutinas();
  }

  activateRutina(rutinaId: number) {
    this.rutinaService.activateRutina(rutinaId).subscribe(() => {
      Swal.fire({
        title: "¡Rutina Activada!",
        text: "La rutina ha sido activada exitosamente.",
        icon: "success"
      });
      this.loadRutinas(); // Reload rutinas to reflect the changes
    });
  }

  deleteRutina(rutinaId: number) {
    Swal.fire({
      title: 'Eliminar rutina',
      text: "¿Estás seguro de que quieres eliminar esta rutina?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rutinaService.deleteRutina(rutinaId).subscribe(() => {
          Swal.fire(
            '¡Eliminado!',
            'La rutina ha sido eliminada.',
            'success'
          );
          this.loadRutinas(); // Reload rutinas to reflect the changes
        });
      }
    });
  }

  getDiasConEjercicios(rutinaEjercicios: any[]): any[] {
    const diasMap: { [key: string]: any } = {};

    rutinaEjercicios.forEach(ejercicio => {
      if (!diasMap[ejercicio.dia]) {
        diasMap[ejercicio.dia] = {
          dia: ejercicio.dia,
          nombreDia: ejercicio.nombreDia,
          ejercicios: [],
          dayIndex: this.daysOrder.indexOf(ejercicio.dia)
        };
      }
      const ejercicioData = this.ejercicios.find(e => e.id === ejercicio.ejercicioId);
      diasMap[ejercicio.dia].ejercicios.push({
        nombre: ejercicioData ? ejercicioData.nombre : 'Ejercicio no encontrado',
        peso: ejercicio.peso
      });
    });

    const diasArray = Object.values(diasMap);
    diasArray.sort((a, b) => a.dayIndex - b.dayIndex);

    return diasArray;
  }
}
