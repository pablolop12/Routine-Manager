import { Component, OnInit } from '@angular/core';
import { RutinaService } from '../../../../Services/rutina.service';
import { EjercicioService } from '../../../../Services/ejercicio.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-entrenamiento-hoy',
  templateUrl: './entrenamiento-hoy.component.html',
  styleUrls: ['./entrenamiento-hoy.component.scss']
})
export class EntrenamientoHoyComponent implements OnInit {
  ejerciciosHoy: any[] = [];
  filteredEjercicios: any[] = [];
  diaSemana: string = '';
  nombreDia: string = '';
  fechaHoy: string = '';
  rutinaActual: any;
  searchTerm: string = '';
  showNoEjerciciosAlert: boolean = false;
  showNoRutinaAlert: boolean = false;

  constructor(private rutinaService: RutinaService, private ejercicioService: EjercicioService) { }

  ngOnInit(): void {
    this.loadEjercicios();
    this.setFechaHoy();
  }

  setFechaHoy() {
    const hoy = new Date();
    const options: Intl.DateTimeFormatOptions = {  year: 'numeric', month: 'long', day: 'numeric' };
    this.fechaHoy = hoy.toLocaleDateString('es-ES', options);
  }

  toggleCompletion(ejercicio: any) {
    ejercicio.completado = !ejercicio.completado;
  }

  toggleAllCompletion() {
    const allCompleted = this.ejerciciosHoy.every(ejercicio => ejercicio.completado);
    this.ejerciciosHoy.forEach(ejercicio => ejercicio.completado = !allCompleted);
    this.filteredEjercicios = this.ejerciciosHoy;
  }

  loadEjercicios() {
    this.ejercicioService.getEjercicios().subscribe(data => {
      this.getEjerciciosHoy(data);
    });
  }

  getEjerciciosHoy(ejercicios: any[]) {
    const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long' });
    this.diaSemana = hoy.charAt(0).toUpperCase() + hoy.slice(1);
  
    this.rutinaService.getActiveRutina().subscribe(
      rutina => {
        this.rutinaActual = rutina;
        const ejerciciosHoy = rutina.rutinaEjercicios.filter((ejercicio: any) => ejercicio.dia.toLowerCase() === hoy.toLowerCase());
        if (ejerciciosHoy.length > 0) {
          this.nombreDia = ejerciciosHoy[0].nombreDia;
          this.ejerciciosHoy = ejerciciosHoy.map((ejercicio: any) => {
            const ejercicioData = ejercicios.find(e => e.id === ejercicio.ejercicioId);
            return {
              ...ejercicio,
              nombre: ejercicioData ? ejercicioData.nombre : 'Ejercicio no encontrado',
              imagenUrl: ejercicioData ? ejercicioData.imagenUrl : 'URL no encontrada',
              descripcion: ejercicioData ? ejercicioData.descripcion : 'Descripción no encontrada',
              categoria: ejercicioData ? ejercicioData.categoria : 'Categoría no encontrada'
            };
          });
          this.filteredEjercicios = this.ejerciciosHoy; // Initialize the filtered list
          this.showNoEjerciciosAlert = false; // Hide the alert
        } else {
          this.nombreDia = 'No hay ejercicios programados para hoy';
          this.filteredEjercicios = []; // No exercises for today
          this.showNoEjerciciosAlert = true; // Show the alert
        }
      },
      error => {
        this.showNoRutinaAlert = true; // Show the alert
      }
    );
  }
  

  updateValues(ejercicio: any) {
    Swal.fire({
      title: 'Actualizar valores',
      html: `
      <div>
        <label for="peso">Peso:</label>
        <input id="peso" class="swal2-input" type="number" value="${ejercicio.peso}">
      </div>
      <div>
        <label for="repeticiones">Reps:</label>
        <input id="repeticiones" class="swal2-input" type="number" value="${ejercicio.repeticiones}">
      </div>
      <div>
        <label for="series">Series:</label>
        <input id="series" class="swal2-input" type="number" value="${ejercicio.series}">
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const peso = (document.getElementById('peso') as HTMLInputElement).value;
        const repeticiones = (document.getElementById('repeticiones') as HTMLInputElement).value;
        const series = (document.getElementById('series') as HTMLInputElement).value;
        return { peso, repeticiones, series };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { peso, repeticiones, series } = result.value!;
        ejercicio.peso = +peso;
        ejercicio.repeticiones = +repeticiones;
        ejercicio.series = +series;

        // Actualizar solo el ejercicio específico en la rutina actual
        const updatedRutina = { ...this.rutinaActual };
        updatedRutina.rutinaEjercicios = updatedRutina.rutinaEjercicios.map((ej: any) => {
          if (ej.id === ejercicio.id) {
            return { ...ej, peso, repeticiones, series };
          }
          return ej;
        });

        this.rutinaService.updateRutina(this.rutinaActual.id, updatedRutina).subscribe(
          () => {
            // Actualizar la vista con los nuevos valores
            this.ejerciciosHoy = this.ejerciciosHoy.map((ej: any) => {
              if (ej.id === ejercicio.id) {
                return { ...ej, peso, repeticiones, series };
              }
              return ej;
            });
            this.filteredEjercicios = this.ejerciciosHoy;
            Swal.fire('Actualizado', 'Los valores del ejercicio se han actualizado', 'success');
          },
          error => {
            Swal.fire('Error', 'Hubo un problema al actualizar los valores del ejercicio', 'error');
          }
        );
      }
    });
  }

  filterEjercicios() {
    this.filteredEjercicios = this.ejerciciosHoy.filter(ejercicio => 
      ejercicio.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  generatePDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Entrenamiento de Hoy', 11, 8);
    doc.setFontSize(12);
    doc.text(`Día: ${this.diaSemana} - ${this.nombreDia}`, 11, 14);
    doc.setFontSize(10);
    doc.text('Detalles del Entrenamiento:', 11, 26);

    let y = 36;
    this.ejerciciosHoy.forEach(ejercicio => {
      doc.setFontSize(12);
      doc.text(`Ejercicio: ${ejercicio.nombre}`, 11, y);
      y += 6;
      doc.setFontSize(10);
      doc.text(`Categoría: ${ejercicio.categoria}`, 11, y);
      y += 6;
      doc.text(`Descripción: ${ejercicio.descripcion}`, 11, y);
      y += 6;
      doc.text(`Peso: ${ejercicio.peso} kg`, 11, y);
      y += 6;
      doc.text(`Repeticiones: ${ejercicio.repeticiones}`, 11, y);
      y += 6;
      doc.text(`Series: ${ejercicio.series}`, 11, y);
      y += 10; // espacio entre ejercicios
    });

    doc.save('ejercicios_hoy.pdf');
  }
}
