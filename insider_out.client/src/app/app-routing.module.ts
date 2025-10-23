import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/notfound/notfound.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
    /* Home */
    // Need this to point to the user selected home page, default dashboard. 
    { path: '', title: 'Home - InsiderOUT', component: HomeComponent },
    { path: 'home', title: 'Home - InsiderOUT', component: HomeComponent },

    /* Dashboard */
    { path: 'dashboard', title: 'Dashboard - InsiderOUT', component: DashboardComponent },

    // Wildcard route for a 404 page - MUST be the last route
    { path: '**', component: NotFoundComponent } 
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
