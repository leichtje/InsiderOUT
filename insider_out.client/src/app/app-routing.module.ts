import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/notfound/notfound.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IncidentsComponent } from './pages/incidents/incidents.component';
import { IncidentsOpenViewComponent } from './pages/incidents/incidents-open-view/incidents-open-view.component';
import { ProfilesDetailComponent } from './pages/profiles/profiles-view/profiles-detail/profiles-detail.component';
import { ProfilesComponent } from './pages/profiles/profiles.component';

const routes: Routes = [
    /* Home */
    // Need this to point to the user selected home page, default dashboard. 
    { path: '', title: 'Home - InsiderOUT', component: HomeComponent },
    { path: 'home', title: 'Home - InsiderOUT', component: HomeComponent },

    /* User */
    {
        path: 'profiles',
        component: ProfilesComponent,
        children: [
            { path: 'user/:id', component: ProfilesDetailComponent },
            { path: 'subject/:id', component: ProfilesDetailComponent }
        ]
    },

    /* Dashboard */
    { path: 'dashboard', title: 'Dashboard - InsiderOUT', component: DashboardComponent },

    /* Incidents */
    {
        path: 'incidents',
        component: IncidentsComponent,
        children: [
            { path: 'open', component: IncidentsOpenViewComponent },
            { path: 'open/:id', component: IncidentsOpenViewComponent },
            { path: 'closed', component: IncidentsOpenViewComponent },
            { path: 'closed/:id', component: IncidentsOpenViewComponent }
        ]
    },

    // Wildcard route for a 404 page - MUST be the last route
    { path: '**', component: NotFoundComponent } 
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
