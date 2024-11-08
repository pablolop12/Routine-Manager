import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EjercicioListComponent } from './components/ejercicio-list/ejercicio-list.component';
import { EjercicioFormComponent } from './components/ejercicio-form/ejercicio-form.component';
import { EditFrameComponent } from './components/edit-frame/edit-frame.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'ejercicios/create', component: EditFrameComponent },
  { path: 'ejercicios/edit/:id', component: EditFrameComponent }

]

@NgModule({
  declarations: [
    DashboardComponent,
    EjercicioListComponent,
    EjercicioFormComponent,
    EditFrameComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class GestionModule { }
