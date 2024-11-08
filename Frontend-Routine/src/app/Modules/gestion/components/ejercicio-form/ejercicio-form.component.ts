import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EjercicioService } from '../../../../Services/ejercicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ejercicio-form',
  templateUrl: './ejercicio-form.component.html',
  styleUrls: ['./ejercicio-form.component.scss']
})
export class EjercicioFormComponent implements OnInit {
  ejercicioForm: FormGroup;
  categorias: string[] = ['Brazos', 'Pecho', 'Abdominales', 'Espalda', 'Piernas'];
  isEditMode = false;
  ejercicioId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private ejercicioService: EjercicioService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.ejercicioForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      imagenUrl: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.ejercicioId = +id;
        this.loadEjercicio(this.ejercicioId);
      }
    });
  }

  loadEjercicio(id: number): void {
    this.ejercicioService.getEjercicioById(id).subscribe(ejercicio => {
      this.ejercicioForm.patchValue(ejercicio);
    });
  }

  onSubmit(): void {
    if (this.ejercicioForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      this.ejercicioService.updateEjercicio(this.ejercicioId!, this.ejercicioForm.value).subscribe(() => {
        Swal.fire('Actualizado', 'El ejercicio se ha actualizado correctamente', 'success');
        this.router.navigate(['/gestion/dashboard']);
      });
    } else {
      this.ejercicioService.createEjercicio(this.ejercicioForm.value).subscribe(() => {
        Swal.fire('Creado', 'El ejercicio se ha creado correctamente', 'success');
        this.router.navigate(['/gestion/dashboard']);
      });
    }
  }
}
