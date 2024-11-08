import { Component, OnInit } from '@angular/core';
import { RouteVisibilityService } from './Services/route-visibility.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showNavbar = true;

  constructor(private routeVisibilityService: RouteVisibilityService) {}

  ngOnInit(): void {
    this.routeVisibilityService.showNavbar$.subscribe(show => {
      this.showNavbar = show;
    });
  }
}
