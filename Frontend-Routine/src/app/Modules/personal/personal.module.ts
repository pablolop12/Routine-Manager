import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './components/dashboard-full/dashboard/dashboard.component';
import { EntrenamientoHoyComponent } from './components/entrenamiento-hoy/entrenamiento-hoy.component';


import { NewRutinaComponent } from './components/new-rutina/new-rutina.component';

import { ManagerComponent } from './components/manager/manager/manager.component';
import { RutinaManagerComponent } from './components/manager/rutina-manager/rutina-manager.component';
import { EditRutinaComponent } from './components/edit-rutina/edit-rutina.component';
import { EditFrameComponent } from './components/edit-frame/edit-frame.component';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },

  //ELIMINAR CUANDO CUANDO SE HAYA TERMINADO
  { path: 'entrenamiento-hoy', component: EntrenamientoHoyComponent },
  { path: 'new-rutina', component: NewRutinaComponent },
  { path: 'edit-rutina/:id', component: EditFrameComponent },
]


@NgModule({
  declarations: [


    DashboardComponent,
    EntrenamientoHoyComponent,

    NewRutinaComponent,

    EntrenamientoHoyComponent,
    EditRutinaComponent,

    ManagerComponent,
    RutinaManagerComponent,
    EditFrameComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PersonalModule { }
