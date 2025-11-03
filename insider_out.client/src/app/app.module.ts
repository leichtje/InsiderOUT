import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './fragments/header/header.component';
import { SidebarComponent } from "./fragments/sidebar/sidebar.component";
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { UserMenuComponent } from "./fragments/user-menu/user-menu.component";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HeaderComponent,
        HttpClientModule,
        // MatTooltipModule,
        MatIconModule,
        SidebarComponent,
        UserMenuComponent,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
