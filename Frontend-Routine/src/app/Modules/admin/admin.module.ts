import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { EditFrameComponent } from './components/edit-frame/edit-frame.component';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  { path: 'users', component: UserListComponent },
  { path: 'users/edit/:id', component: EditFrameComponent }
]


@NgModule({
  declarations: [
    DashboardComponent,
    UserListComponent,
    UserFormComponent,
    EditFrameComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
