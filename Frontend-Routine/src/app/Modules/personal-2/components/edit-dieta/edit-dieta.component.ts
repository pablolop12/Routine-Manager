import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { DietaService } from '../../../../Services/dieta.service';
import { ComidaService } from '../../../../Services/comida.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-dieta',
  templateUrl: './edit-dieta.component.html',
  styleUrls: ['./edit-dieta.component.scss']
})
export class EditDietaComponent implements OnInit {
  dietaForm: FormGroup;
  comidas: any[] = [];
  dietaId: number = 0;
  diasDisponibles: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  diasOptions: { dia: string; disabled: boolean; }[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dietaService: DietaService,
    private comidaService: ComidaService
  ) {
    this.dietaForm = this.fb.group({
      nombreDieta: ['', Validators.required],
      descripcion: ['', Validators.required],
      active: [false],  // Mantener el campo active
      dias: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dietaId = +id;
      this.loadDieta();
    }
    this.loadComidas();
  }

  get dias(): FormArray {
    return this.dietaForm.get('dias') as FormArray;
  }

  getComidas(dia: AbstractControl): FormArray {
    return dia.get('comidas') as FormArray;
  }

  newDia(): FormGroup {
    const diaFormGroup = this.fb.group({
      dia: ['', Validators.required],
      nombreDia: ['', Validators.required],
      comidas: this.fb.array([this.newComida()])
    });
    diaFormGroup.get('dia')?.valueChanges.subscribe(() => {
      this.updateDiasDisponibles();
    });
    return diaFormGroup;
  }

  newComida(): FormGroup {
    const comidaFormGroup = this.fb.group({
      comidaId: [{ value: null, disabled: true }, Validators.required],
      tipoComida: ['', Validators.required],
      cantidad: [0, Validators.required],
      filteredComidas: [[]]
    });

    comidaFormGroup.get('tipoComida')?.valueChanges.subscribe(tipoComida => {
      if (tipoComida) {
        this.updateFilteredComidas(comidaFormGroup, tipoComida);
        comidaFormGroup.get('comidaId')?.enable();
      } else {
        comidaFormGroup.get('comidaId')?.disable();
        comidaFormGroup.get('comidaId')?.reset();
      }
    });

    return comidaFormGroup;
  }

  addDia(): void {
    this.dias.push(this.newDia());
    this.updateDiasDisponibles();
  }

  removeDia(index: number): void {
    this.dias.removeAt(index);
    this.updateDiasDisponibles();
  }

  addComida(diaIndex: number): void {
    const comidas = this.getComidas(this.dias.at(diaIndex));
    comidas.push(this.newComida());
  }

  removeComida(diaIndex: number, comidaIndex: number): void {
    const comidas = this.getComidas(this.dias.at(diaIndex));
    comidas.removeAt(comidaIndex);
  }

  loadDieta(): void {
    this.dietaService.getDietaById(this.dietaId).subscribe(
      data => {
        this.dietaForm.patchValue({
          nombreDieta: data.nombreDieta,
          descripcion: data.descripcion,
          active: data.active // Cargar el estado del checkbox, aunque no sea visible en el formulario
        });

        const diaGroups = data.dietaComidas.reduce((groups: { [key: string]: any[] }, comida: any) => {
          if (!groups[comida.dia]) {
            groups[comida.dia] = [];
          }
          groups[comida.dia].push(comida);
          return groups;
        }, {});

        for (const dia in diaGroups) {
          const diaGroup = this.fb.group({
            dia: [dia, Validators.required],
            nombreDia: [diaGroups[dia][0].nombreDia, Validators.required],
            comidas: this.fb.array([])
          });
          const comidas = this.getComidas(diaGroup);
          diaGroups[dia].forEach((comida: any) => {
            const comidaForm = this.newComida();
            comidaForm.patchValue(comida);
            comidas.push(comidaForm);
            this.updateFilteredComidas(comidaForm, comida.tipoComida);
            comidaForm.get('comidaId')?.enable();
          });
          this.dias.push(diaGroup);
        }

        this.updateDiasDisponibles();
      },
      error => {
        Swal.fire('Error', 'Error al cargar la dieta', 'error');
      }
    );
  }

  loadComidas(): void {
    this.comidaService.getAllComidas().subscribe(
      data => {
        this.comidas = data;
      },
      error => {
        Swal.fire('Error', 'Error al cargar las comidas', 'error');
      }
    );
  }

  updateFilteredComidas(comidaFormGroup: FormGroup, tipoComida: string): void {
    const filtered = this.comidas.filter(comida => comida.tipoComida === tipoComida);
    comidaFormGroup.get('filteredComidas')?.setValue(filtered);
    if (filtered.length > 0) {
      comidaFormGroup.get('comidaId')?.enable();
    } else {
      comidaFormGroup.get('comidaId')?.disable();
    }
  }

  saveDieta(): void {
    if (this.dietaForm.valid) {
      const dieta = this.transformFormData(this.dietaForm.value);

      this.dietaService.updateDieta(this.dietaId, dieta).subscribe(
        () => {
          Swal.fire('Éxito', 'Dieta actualizada correctamente', 'success');
          this.router.navigate(['/nutricion/dashboard']);
        },
        error => {
          Swal.fire('Error', 'Error al actualizar la dieta', 'error');
        }
      );
    }
  }

  private transformFormData(formData: any): any {
    const transformedData: any = {
      id: this.dietaId,
      nombreDieta: formData.nombreDieta,
      descripcion: formData.descripcion,
      active: formData.active, // Mantener el valor del campo active al enviar el formulario
      dietaComidas: []
    };

    formData.dias.forEach((dia: any) => {
      dia.comidas.forEach((comida: any) => {
        transformedData.dietaComidas.push({
          ...comida,
          dia: dia.dia,
          nombreDia: dia.nombreDia
        });
      });
    });

    return transformedData;
  }

  private updateDiasDisponibles(): void {
    const selectedDias = this.dias.controls.map(dia => dia.get('dia')?.value).filter(value => value);
    this.diasOptions = this.diasDisponibles.map(dia => ({
      dia,
      disabled: selectedDias.includes(dia) ? true : false
    }));
  }

  isDiaDisabled(dia: string): boolean {
    const selectedDias = this.dias.controls.map(dia => dia.get('dia')?.value).filter(value => value);
    return selectedDias.includes(dia);
  }
}
