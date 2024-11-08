import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { RutinaService } from '../../../../Services/rutina.service';
import { EjercicioService } from '../../../../Services/ejercicio.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-rutina',
  templateUrl: './new-rutina.component.html',
  styleUrls: ['./new-rutina.component.scss']
})
export class NewRutinaComponent implements OnInit {
  rutinaForm: FormGroup;
  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  ejercicios: any[] = [];

  constructor(private fb: FormBuilder, private rutinaService: RutinaService, private ejercicioService: EjercicioService, private router: Router) {
    this.rutinaForm = this.fb.group({
      nombreRutina: ['', Validators.required],
      descripcion: ['', Validators.required],
      isActive: [false],
      startDate: [new Date().toISOString().substring(0, 10)], // Default to today's date
      rutinaEjercicios: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addRutinaEjercicio(); // Start with one day
    this.loadEjercicios();
  }

  get rutinaEjercicios(): FormArray {
    return this.rutinaForm.get('rutinaEjercicios') as FormArray;
  }

  getEjerciciosControls(index: number): FormArray {
    return (this.rutinaEjercicios.at(index) as FormGroup).get('ejercicios') as FormArray;
  }

  createEjercicio(): FormGroup {
    return this.fb.group({
      ejercicioId: ['', Validators.required],
      repeticiones: ['', Validators.required],
      series: ['', Validators.required],
      peso: ['', Validators.required]
    });
  }

  addRutinaEjercicio() {
    if (this.rutinaEjercicios.length < 7) {
      const rutinaEjercicio = this.fb.group({
        dia: ['', Validators.required],
        nombreDia: ['', Validators.required],
        ejercicios: this.fb.array([this.createEjercicio()])
      });
      this.rutinaEjercicios.push(rutinaEjercicio);
    }
  }

  addEjercicio(index: number) {
    this.getEjerciciosControls(index).push(this.createEjercicio());
  }

  removeEjercicio(dayIndex: number, ejercicioIndex: number) {
    this.getEjerciciosControls(dayIndex).removeAt(ejercicioIndex);
  }

  confirmRemoveRutinaEjercicio(index: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, bórralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeRutinaEjercicio(index);
      }
    });
  }

  removeRutinaEjercicio(index: number) {
    this.rutinaEjercicios.removeAt(index);
    this.updateDisabledOptions();
  }

  isDaySelected(day: string): boolean {
    return this.rutinaEjercicios.controls.some(control => control.get('dia')?.value === day);
  }

  updateDisabledOptions() {
    this.rutinaEjercicios.controls.forEach(control => {
      const selectedDay = control.get('dia')?.value;
      this.days.forEach(day => {
        if (day === selectedDay) {
          control.get('dia')?.setValue(selectedDay);
        }
      });
    });
  }

  loadEjercicios() {
    this.ejercicioService.getEjercicios().subscribe(data => {
      this.ejercicios = data;
    });
  }

  onSubmit() {
    if (this.rutinaForm.invalid) {
      return;
    }

    const formValue = this.rutinaForm.value;
    const rutinaEjercicios: any[] = [];

    formValue.rutinaEjercicios.forEach((day: any) => {
      day.ejercicios.forEach((ejercicio: any) => {
        rutinaEjercicios.push({
          dia: day.dia,
          nombreDia: day.nombreDia,
          ...ejercicio
        });
      });
    });

    const rutinaData = {
      nombreRutina: formValue.nombreRutina,
      descripcion: formValue.descripcion,
      isActive: formValue.isActive,
      startDate: formValue.startDate,
      rutinaEjercicios
    };

    this.rutinaService.createRutina(rutinaData).subscribe(
      response => {
        this.rutinaForm.reset();
        this.rutinaEjercicios.clear();
        this.addRutinaEjercicio(); 
        Swal.fire('Éxito', 'Rutina creada correctamente', 'success').then(() => {
          window.location.reload();
        });
        
      },
      error => {
        Swal.fire('Error', 'Hubo un problema al crear la rutina', 'error');
      }
    );
  }
}
