import { Component, OnInit } from '@angular/core';
import { DietaService } from '../../../../Services/dieta.service';
import { ComidaService } from '../../../../Services/comida.service';
import Swal from 'sweetalert2';

interface DietaComida {
  id: number;
  comidaId: number;
  dia: string;
  nombreDia: string;
  tipoComida: string;
  cantidad: number;
}

interface Comida {
  id: number;
  nombre: string;
  [key: string]: any;
}

@Component({
  selector: 'app-dieta-manager',
  templateUrl: './dieta-manager.component.html',
  styleUrls: ['./dieta-manager.component.scss']
})
export class DietaManagerComponent implements OnInit {
  dietas: any[] = [];
  currentDietas: any[] = [];
  pages: number[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 3;
  comidas: { [key: number]: Comida } = {};

  constructor(private dietaService: DietaService, private comidaService: ComidaService) { }

  ngOnInit(): void {
    this.loadDietas();
    this.loadComidas();
  }

  loadDietas() {
    this.dietaService.getDietasByUser().subscribe((data: any) => {
      this.dietas = data;
      this.sortDietas();
      this.setupPagination();
      this.updateCurrentDietas();
    });
  }

  loadComidas() {
    this.comidaService.getAllComidas().subscribe((data: Comida[]) => {
      data.forEach((comida: Comida) => {
        this.comidas[comida.id] = comida;
      });
    });
  }

  sortDietas() {
    this.dietas.sort((a, b) => b.active - a.active);
  }

  setupPagination() {
    const numberOfPages = Math.ceil(this.dietas.length / this.itemsPerPage);
    this.pages = Array.from({ length: numberOfPages }, (_, i) => i);
  }

  updateCurrentDietas() {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.currentDietas = this.dietas.slice(start, end);
  }

  setPage(page: number) {
    this.currentPage = page;
    this.updateCurrentDietas();
  }

  activateDieta(dietaId: number) {
    this.dietaService.activateDieta(dietaId).subscribe(() => {
      Swal.fire({
        title: "¡Dieta Activada!",
        text: "La dieta ha sido activada exitosamente.",
        icon: "success"
      });
      this.loadDietas();
    });
  }

  deleteDieta(dietaId: number) {
    Swal.fire({
      title: 'Eliminar dieta',
      text: "¿Estás seguro de que quieres eliminar esta dieta?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dietaService.deleteDieta(dietaId).subscribe(() => {
          Swal.fire(
            '¡Eliminado!',
            'La dieta ha sido eliminada.',
            'success'
          );
          this.loadDietas();
        });
      }
    });
  }

  getDiasConComidas(dietaComidas: DietaComida[]): any[] {
    const diasMap: { [key: string]: any } = {};

    dietaComidas.forEach((dietaComida: DietaComida) => {
      if (!diasMap[dietaComida.dia]) {
        diasMap[dietaComida.dia] = {
          dia: dietaComida.dia,
          nombreDia: dietaComida.nombreDia,
          comidas: []
        };
      }
      diasMap[dietaComida.dia].comidas.push({
        nombre: this.comidas[dietaComida.comidaId]?.nombre || 'Comida no encontrada',
        cantidad: dietaComida.cantidad
      });
    });

    return Object.values(diasMap);
  }
}
