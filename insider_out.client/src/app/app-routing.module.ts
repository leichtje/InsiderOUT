import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router'; // <-- Added ActivatedRouteSnapshot
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/notfound/notfound.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IncidentsComponent } from './pages/incidents/incidents.component';
import { ProfilesDetailComponent } from './pages/profiles/profiles-view/profiles-detail/profiles-detail.component';
import { ProfilesComponent } from './pages/profiles/profiles.component';
import { IncidentsClosedComponent } from './pages/incidents/incidents-closed/incidents-closed.component';
import { IncidentsOpenComponent } from './pages/incidents/incidents-open/incidents-open.component';
import { IncidentsDetailComponent } from './pages/incidents/incidents-detail/incidents-detail.component';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';
import { TokensDocumentsComponent } from './pages/tokens/tokens-documents/tokens-documents.component';
import { TokensEmailsComponent } from './pages/tokens/tokens-emails/tokens-emails.component';
import { TokensDocumentsDetailComponent } from './pages/tokens/tokens-documents/tokens-documents-detail/tokens-documents-detail.component';
import { DepartmentComponent } from './pages/department/department.component';

const routes: Routes = [
    /* Home */
    { path: '', title: 'Home - InsiderOUT', component: HomeComponent },
    { path: 'home', title: 'Home - InsiderOUT', component: HomeComponent},

    /* Dashboard */
    { path: 'dashboard', title: 'Dashboard - InsiderOUT', component: DashboardComponent },

    /* Incidents */
    {
        path: 'incidents',
        component: IncidentsComponent,
        children: [
            { path: 'open', title: 'Open Incidents - InsiderOUT', component: IncidentsOpenComponent},
            { 
                path: 'open/:id', 
                title: (route: ActivatedRouteSnapshot) => `Incident #${route.paramMap.get('id')} - InsiderOUT`, 
                component: IncidentsDetailComponent, 
                canDeactivate: [unsavedChangesGuard]
            },
            { path: 'closed', title: 'Closed Incidents - InsiderOUT', component: IncidentsClosedComponent },
            { 
                path: 'closed/:id', 
                title: (route: ActivatedRouteSnapshot) => `Incident #${route.paramMap.get('id')} - InsiderOUT`, 
                component: IncidentsDetailComponent, 
                canDeactivate: [unsavedChangesGuard]
            }
        ]
    },

    /* Tokens */
    {
        path: 'tokens',
        children: [
            { path: 'documents', title: 'Documents - InsiderOUT', component: TokensDocumentsComponent},
            { 
                path: 'documents/:id', 
                title: (route: ActivatedRouteSnapshot) => `Document #${route.paramMap.get('id')} - InsiderOUT`,
                component: TokensDocumentsDetailComponent, 
                canDeactivate: [unsavedChangesGuard]
            },
            { path: 'emails', title: 'Emails - InsiderOUT', component: TokensEmailsComponent },
        ]
    },

    /* Settings */
    {
        path: 'settings',
        children: [
            { 
                path: 'profiles', 
                title: 'Profiles - InsiderOUT',
                component: ProfilesComponent,
                children: [
                    { 
                        path: 'user/:id', 
                        title: (route: ActivatedRouteSnapshot) => `User Profile ${route.paramMap.get('id')} - InsiderOUT`,
                        component: ProfilesDetailComponent 
                    },
                    { 
                        path: 'subject/:id', 
                        title: (route: ActivatedRouteSnapshot) => `Subject Profile ${route.paramMap.get('id')} - InsiderOUT`,
                        component: ProfilesDetailComponent 
                    }
                ] 
            },
            { path: 'departments', title: 'Departments - InsiderOUT', component: DepartmentComponent },
        ]
    },

    // Wildcard route for a 404 page
    { path: '**', title: 'Page Not Found - InsiderOUT', component: NotFoundComponent } 
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }