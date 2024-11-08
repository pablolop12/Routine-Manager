import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DietaService } from '../../../../Services/dieta.service';
import { ComidaService } from '../../../../Services/comida.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-dieta',
  templateUrl: './new-dieta.component.html',
  styleUrls: ['./new-dieta.component.scss']
})
export class NewDietaComponent implements OnInit {
  dietaForm: FormGroup;
  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  comidas: any[] = [];
  tiposComida = ['Desayuno', 'Media Mañana', 'Comida', 'Merienda', 'Cena'];
  filteredComidas: { [key: number]: any[] } = {};

  constructor(
    private fb: FormBuilder,
    private dietaService: DietaService,
    private comidaService: ComidaService,
    private router: Router
  ) {
    this.dietaForm = this.fb.group({
      nombreDieta: ['', Validators.required],
      descripcion: ['', Validators.required],
      dietaComidas: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addDietaComida();
    this.loadComidas();
  }

  get dietaComidas(): FormArray {
    return this.dietaForm.get('dietaComidas') as FormArray;
  }

  getComidasControls(index: number): FormArray {
    return (this.dietaComidas.at(index) as FormGroup).get('comidas') as FormArray;
  }

  createComida(): FormGroup {
    return this.fb.group({
      tipoComida: ['', Validators.required],
      comidaId: ['', Validators.required],
      cantidad: ['', Validators.required]
    });
  }

  addDietaComida() {
    if (this.dietaComidas.length < 7) {
      const dietaComida = this.fb.group({
        dia: ['', Validators.required],
        nombreDia: ['', Validators.required],
        comidas: this.fb.array([this.createComida()])
      });
      this.dietaComidas.push(dietaComida);
    }
  }

  addComida(index: number) {
    this.getComidasControls(index).push(this.createComida());
  }

  removeComida(dayIndex: number, comidaIndex: number) {
    this.getComidasControls(dayIndex).removeAt(comidaIndex);
  }

  confirmRemoveDietaComida(index: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, bórralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.removeDietaComida(index);
      }
    });
  }

  removeDietaComida(index: number) {
    this.dietaComidas.removeAt(index);
    this.updateDisabledOptions();
  }

  isDaySelected(day: string): boolean {
    return this.dietaComidas.controls.some(control => control.get('dia')?.value === day);
  }

  updateDisabledOptions() {
    this.dietaComidas.controls.forEach(control => {
      const selectedDay = control.get('dia')?.value;
      this.days.forEach(day => {
        if (day === selectedDay) {
          control.get('dia')?.setValue(selectedDay);
        }
      });
    });
  }

  loadComidas() {
    this.comidaService.getAllComidas().subscribe(data => {
      this.comidas = data;
    });
  }

  onTipoComidaChange(dayIndex: number, comidaIndex: number) {
    const tipoComida = this.getComidasControls(dayIndex).at(comidaIndex).get('tipoComida')?.value;
    this.filteredComidas[comidaIndex] = this.comidas.filter(comida => comida.tipoComida === tipoComida);
  }

  onSubmit() {
    if (this.dietaForm.invalid) {
      return;
    }

    const formValue = this.dietaForm.value;
    const dietaComidas: any[] = [];

    formValue.dietaComidas.forEach((day: any) => {
      day.comidas.forEach((comida: any) => {
        dietaComidas.push({
          dia: day.dia,
          nombreDia: day.nombreDia,
          ...comida
        });
      });
    });

    const dietaData = {
      nombreDieta: formValue.nombreDieta,
      descripcion: formValue.descripcion,
      dietaComidas
    };

    this.dietaService.createDieta(dietaData).subscribe(
      response => {
        this.dietaForm.reset();
        this.dietaComidas.clear();
        this.addDietaComida();
      
        Swal.fire('Éxito', 'Dieta creada correctamente', 'success').then(() => {
          window.location.reload();
        });
        
      },
      error => {
        Swal.fire('Error', 'Hubo un problema al crear la dieta', 'error');
      }
    );
  }
}
