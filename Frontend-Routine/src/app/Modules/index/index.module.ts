import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: IndexComponent },
];

@NgModule({
  declarations: [IndexComponent],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class IndexModule { 

  
}
