import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RutinaService } from '../../../../Services/rutina.service';
import { EjercicioService } from '../../../../Services/ejercicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-rutina',
  templateUrl: './edit-rutina.component.html',
  styleUrls: ['./edit-rutina.component.scss']
})
export class EditRutinaComponent implements OnInit {
  id: number = 0;
  rutina: any = {
    rutinaEjercicios: []
  };
  ejerciciosAgrupados: any[] = [];
  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  ejercicios: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rutinaService: RutinaService,
    private ejercicioService: EjercicioService
  ) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.rutinaService.getRutinaById(this.id).subscribe(data => {
      this.rutina = data;
      this.agruparEjercicios();
    }, error => console.log(error));
    this.loadEjercicios();
  }

  loadEjercicios(): void {
    this.ejercicioService.getEjercicios().subscribe(data => {
      this.ejercicios = data;
    }, error => console.log(error));
  }

  onSubmit(): void {
    this.desagruparEjercicios();
    this.eliminarEjerciciosDuplicados();
    this.rutinaService.updateRutina(this.id, this.rutina).subscribe(data => {
      Swal.fire({
        title: 'Éxito',
        text: 'Rutina actualizada exitosamente',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/entrenamiento/dashboard']);
      });
    }, error => console.log(error));
  }

  addExercise(index: number): void {
    const newExercise = {
      id: null,
      ejercicioId: null,
      dia: this.ejerciciosAgrupados[index].dia,
      nombreDia: this.ejerciciosAgrupados[index].nombreDia,
      repeticiones: null,
      series: null,
      peso: null
    };
    this.ejerciciosAgrupados[index].ejercicios.push(newExercise);
  }

  removeExercise(groupIndex: number, exerciseIndex: number): void {
    this.ejerciciosAgrupados[groupIndex].ejercicios.splice(exerciseIndex, 1);
  }

  addDia(): void {
    if (this.ejerciciosAgrupados.length < 7) {
      this.ejerciciosAgrupados.push({
        dia: '',
        nombreDia: '',
        ejercicios: []
      });
      // Añadir un primer ejercicio al nuevo bloque día
      this.addExercise(this.ejerciciosAgrupados.length - 1);
    }
  }

  removeDia(index: number): void {
    this.ejerciciosAgrupados.splice(index, 1);
  }

  updateDiaNombreDia(index: number, field: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.ejerciciosAgrupados[index][field] = value;
    this.ejerciciosAgrupados[index].ejercicios.forEach((ejercicio: any) => {
      ejercicio[field] = value;
    });
    this.ordenarEjerciciosAgrupados();
  }

  isDaySelected(day: string): boolean {
    return this.ejerciciosAgrupados.some(grupo => grupo.dia === day);
  }

  agruparEjercicios(): void {
    const grouped: { [key: string]: any } = {};
    this.rutina.rutinaEjercicios.forEach((ejercicio: any) => {
      const key = `${ejercicio.dia}-${ejercicio.nombreDia}`;
      if (!grouped[key]) {
        grouped[key] = {
          dia: ejercicio.dia,
          nombreDia: ejercicio.nombreDia,
          ejercicios: []
        };
      }
      grouped[key].ejercicios.push(ejercicio);
    });

    this.ejerciciosAgrupados = Object.values(grouped);
    this.ordenarEjerciciosAgrupados();
  }

  desagruparEjercicios(): void {
    this.rutina.rutinaEjercicios = [];
    this.ejerciciosAgrupados.forEach((grupo: any) => {
      grupo.ejercicios.forEach((ejercicio: any) => {
        this.rutina.rutinaEjercicios.push(ejercicio);
      });
    });
  }

  eliminarEjerciciosDuplicados(): void {
    const uniqueExercises = new Map<string, any>();
    this.rutina.rutinaEjercicios.forEach((ejercicio: any) => {
      const key = `${ejercicio.ejercicioId}-${ejercicio.dia}-${ejercicio.nombreDia}-${ejercicio.repeticiones}-${ejercicio.series}-${ejercicio.peso}`;
      if (!uniqueExercises.has(key)) {
        uniqueExercises.set(key, ejercicio);
      }
    });
    this.rutina.rutinaEjercicios = Array.from(uniqueExercises.values());
  }

  ordenarEjerciciosAgrupados(): void {
    this.ejerciciosAgrupados.sort((a, b) => this.days.indexOf(a.dia) - this.days.indexOf(b.dia));
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
