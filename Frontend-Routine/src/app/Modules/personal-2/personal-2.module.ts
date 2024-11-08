import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComidasHoyComponent } from './components/comidas-hoy/comidas-hoy.component';
import { DietaManagerComponent } from './components/dieta-manager/dieta-manager.component';
import { NewDietaComponent } from './components/new-dieta/new-dieta.component';
import { EditDietaComponent } from './components/edit-dieta/edit-dieta.component';
import { ComidasListComponent } from './components/comidas-list/comidas-list.component';
import { FormComidaComponent } from './components/form-comida/form-comida.component';
import { EditFrameComponent } from './components/edit-frame/edit-frame.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'comidas', component: ComidasListComponent },
  { path: 'comidas/new', component: FormComidaComponent },
  { path: 'comidas/edit/:id', component: FormComidaComponent },
  { path: 'edit-dieta/:id', component: EditFrameComponent }
]

@NgModule({
  declarations: [
    DashboardComponent,
    ComidasHoyComponent,
    DietaManagerComponent,
    NewDietaComponent,
    EditDietaComponent,
    ComidasListComponent,
    FormComidaComponent,
    EditFrameComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class Personal2Module { }
