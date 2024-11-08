import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './Guards/auth.guard';
import { GuestGuard } from './Guards/guest.guard';
import { AdminGuard } from './Guards/admin.guard';
import { EmpleadoGuard } from './Guards/empleado.guard';
import { ResetPasswordComponent } from './Modules/auth/components/reset-password/reset-password.component';


const routes: Routes = [
  {path: "", loadChildren: () => import('./Modules/index/index.module').then(m => m.IndexModule), canActivate:[]},
  {path: "auth", loadChildren: () => import('./Modules/auth/auth.module').then(m => m.AuthModule), canActivate:[GuestGuard]},
  {path: "profile", loadChildren: () => import('./Modules/profile/profile.module').then(m => m.ProfileModule), canActivate:[AuthGuard]},
  {path: "entrenamiento", loadChildren: () => import('./Modules/personal/personal.module').then(m => m.PersonalModule), canActivate:[AuthGuard]},
  {path: "nutricion", loadChildren: () => import('./Modules/personal-2/personal-2.module').then(m => m.Personal2Module), canActivate:[AuthGuard]},
  {path: "gestion", loadChildren: () => import('./Modules/gestion/gestion.module').then(m => m.GestionModule), canActivate:[AuthGuard, EmpleadoGuard]},
  {path: "admin", loadChildren: () => import('./Modules/admin/admin.module').then(m => m.AdminModule), canActivate:[AuthGuard, AdminGuard]},
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }//REDIRECT SI LA PAGINA NO EXISTE

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 