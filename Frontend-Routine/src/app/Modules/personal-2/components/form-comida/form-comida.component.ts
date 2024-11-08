import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComidaService } from '../../../../Services/comida.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-comida',
  templateUrl: './form-comida.component.html',
  styleUrls: ['./form-comida.component.scss']
})
export class FormComidaComponent implements OnInit {
  comidaForm: FormGroup;
  isEditMode: boolean = false;
  comidaId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private comidaService: ComidaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.comidaForm = this.fb.group({
      tipoComida: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      calorias: ['', Validators.required],
      imagenUrl: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.comidaId = +id;
        this.loadComida(this.comidaId);
      }
    });
  }

  loadComida(id: number): void {
    this.comidaService.getComidaById(id).subscribe(
      (data: any) => {
        this.comidaForm.patchValue(data);
      },
      (error: any) => {
        console.error('Error loading comida:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.comidaForm.invalid) {
      return;
    }

    const comidaData = this.comidaForm.value;

    if (this.isEditMode && this.comidaId !== null) {
      this.comidaService.updateComida(this.comidaId, comidaData).subscribe(
        (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Comida actualizada',
            text: 'La comida se ha actualizado correctamente',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            window.location.reload();
          });

        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar la comida',
            showConfirmButton: true
          });
        }
      );
    } else {
      this.comidaService.createComida(comidaData).subscribe(
        (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Comida creada',
            text: 'La comida se ha creado correctamente',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            window.location.reload();
          });
       
        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al crear la comida',
            showConfirmButton: true
          });
        }
      );
    }
  }
}
