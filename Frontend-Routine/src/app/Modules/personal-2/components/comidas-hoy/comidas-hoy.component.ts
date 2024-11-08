import { Component, OnInit } from '@angular/core';
import { DietaService } from '../../../../Services/dieta.service';
import { ComidaService } from '../../../../Services/comida.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

interface Comida {
  id: number;
  tipoComida: string;
  nombre: string;
  descripcion: string;
  calorias: number;
  imagenUrl: string;
  usuarioId: number;
}

interface DietaComida {
  id: number;
  comidaId: number;
  dia: string;
  nombreDia: string;
  tipoComida: string;
  cantidad: number;
  comida?: Comida;
}

@Component({
  selector: 'app-comidas-hoy',
  templateUrl: './comidas-hoy.component.html',
  styleUrls: ['./comidas-hoy.component.scss']
})
export class ComidasHoyComponent implements OnInit {
  comidasHoy: any[] = [];
  filteredComidas: any[] = [];
  diaSemana: string = '';
  fechaHoy: string = '';
  nombreDia: string = '';
  searchTerm: string = '';
  showNoComidasAlert: boolean = false;
  showNoDietaAlert: boolean = false; 

  constructor(
    private dietaService: DietaService,
    private comidaService: ComidaService
  ) { }

  ngOnInit(): void {
    this.loadComidasHoy();
    this.setFechaHoy();
  }

  setFechaHoy() {
    const hoy = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    this.fechaHoy = hoy.toLocaleDateString('es-ES', options);
  }

  getDiaSemana(date: Date): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[date.getDay()];
  }

  loadComidasHoy(): void {
    this.dietaService.getActiveDieta().subscribe(
      data => {
        if (!data || !data.dietaComidas) {
          this.showNoDietaAlert = true;
          this.showNoComidasAlert = false;
          this.filteredComidas = [];
          return;
        }
        const hoy = this.getDiaSemana(new Date());
        this.diaSemana = hoy.charAt(0).toUpperCase() + hoy.slice(1);
        const comidasHoy = data.dietaComidas.filter((comida: DietaComida) => comida.dia.toLowerCase() === hoy.toLowerCase());

        if (comidasHoy.length > 0) {
          this.nombreDia = comidasHoy[0].nombreDia;
          this.loadComidasDetails(comidasHoy);
        } else {
          this.nombreDia = 'No hay comidas programadas para hoy';
          this.filteredComidas = []; // No hay comidas para hoy
          this.showNoComidasAlert = true; // Mostrar la alerta
        }
        this.showNoDietaAlert = false;
      },
      error => {
        this.showNoDietaAlert = true;
      }
    );
  }

  loadComidasDetails(comidasHoy: DietaComida[]): void {
    this.comidaService.getAllComidas().subscribe(
      (comidas: Comida[]) => {
        this.comidasHoy = comidasHoy.map(dietaComida => {
          const comidaDetails = comidas.find((comida: Comida) => comida.id === dietaComida.comidaId);
          return {
            ...dietaComida,
            nombre: comidaDetails?.nombre || 'Nombre no encontrado',
            descripcion: comidaDetails?.descripcion || 'Descripción no encontrada',
            calorias: comidaDetails?.calorias || 0,
            imagenUrl: comidaDetails?.imagenUrl || '',
          };
        });

        this.filteredComidas = this.comidasHoy; // Inicializar la lista filtrada

        // Si después de cargar los detalles de las comidas no hay comidas para hoy, mostrar la alerta
        if (this.filteredComidas.length === 0) {
          this.showNoComidasAlert = true;
        } else {
          this.showNoComidasAlert = false;
        }
      },
      error => {
        Swal.fire('Error', 'Error al cargar los detalles de las comidas', 'error');
      }
    );
  }

  filterComidas() {
    this.filteredComidas = this.comidasHoy.filter(comida =>
      comida.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  toggleCompletion(comida: any) {
    comida.completado = !comida.completado;
  }

  markAllCompletion() {
    const allCompleted = this.comidasHoy.every(comida => comida.completado);
    this.comidasHoy.forEach(comida => comida.completado = !allCompleted);
    this.filteredComidas = this.comidasHoy;
  }

  generatePDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Comidas de Hoy', 11, 8);
    doc.setFontSize(12);
    doc.text(`Día: ${this.diaSemana} - ${this.nombreDia}`, 11, 14);
    doc.setFontSize(10);
    doc.text('Detalles de las Comidas:', 11, 26);

    let y = 36;
    this.comidasHoy.forEach(comida => {
      doc.setFontSize(12);
      doc.text(`Comida: ${comida.nombre}`, 11, y);
      y += 6;
      doc.setFontSize(10);
      doc.text(`Tipo: ${comida.tipoComida}`, 11, y);
      y += 6;
      doc.text(`Descripción: ${comida.descripcion}`, 11, y);
      y += 6;
      doc.text(`Calorías: ${comida.calorias} kcal`, 11, y);
      y += 6;
      doc.text(`Cantidad: ${comida.cantidad}`, 11, y);
      y += 10; // espacio entre comidas
    });

    doc.save('comidas_hoy.pdf');
  }
}
