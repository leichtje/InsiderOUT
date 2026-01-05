import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
    /* Home */
    // Need this to point to the user selected home page, default dashboard. 
    { path: '', title: 'Home - InsiderOUT', component: HomeComponent },
    { path: 'home', title: 'Home - InsiderOUT', component: HomeComponent},

    /* Dashboard */
    { path: 'dashboard', title: 'Dashboard - InsiderOUT', component: DashboardComponent },

    /* Incidents */
    {
        path: 'incidents',
        component: IncidentsComponent,
        children: [
            { path: 'open', component: IncidentsOpenComponent},
            { path: 'open/:id', component: IncidentsDetailComponent, canDeactivate: [unsavedChangesGuard]},
            { path: 'closed', component: IncidentsClosedComponent },
            { path: 'closed/:id', component: IncidentsClosedComponent, canDeactivate: [unsavedChangesGuard]}
        ]
    },

    /* Incidents */
    {
        path: 'tokens',
        component: IncidentsComponent,
        children: [
            { path: 'documents', component: TokensDocumentsComponent},
            // { path: 'documents/:id', component: TokensDocumentsDetailComponent, canDeactivate: [unsavedChangesGuard]},
            { path: 'emails', component: TokensEmailsComponent },
            // { path: 'emails/:id', component: TokensEmailsDetailComponent, canDeactivate: [unsavedChangesGuard]}
        ]
    },

    /* Profiles */
    {
        path: 'profiles',
        component: ProfilesComponent,
        children: [
            { path: 'user/:id', component: ProfilesDetailComponent },
            { path: 'subject/:id', component: ProfilesDetailComponent }
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
