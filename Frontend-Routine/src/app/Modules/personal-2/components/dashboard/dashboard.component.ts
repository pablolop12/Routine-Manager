import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  selectedTab: string = 'dashboard'; 
  selectTab(tab: string) {
    this.selectedTab = tab;
  }

}
