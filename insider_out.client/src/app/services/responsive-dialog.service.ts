import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { BreakpointService } from './breakpoint.service';

@Injectable({
    providedIn: 'root'
})
export class ResponsiveDialogService {

    private matDialog = inject(MatDialog);
    private breakpointService = inject(BreakpointService);


    open<T, D = any, R = any>(
    component: ComponentType<T>, 
    config: MatDialogConfig<D> = {}
    ): MatDialogRef<T, R> {

    const isMobile = this.breakpointService.isMobile();

    const finalConfig: MatDialogConfig<D> = isMobile 
        ? {
            ...config,
            width: '100vw',
            maxWidth: '100vw',
            height: '100vh',
            minHeight: '100vh',
            maxHeight: '100vh',
            panelClass: 'io-modal-panel',
            autoFocus: false
        }
        : {
            width: '900px',
            maxWidth: '95vw',
            minHeight: '70vh',
            panelClass: 'io-modal-panel',
            ...config 
        };

        return this.matDialog.open(component, finalConfig);
    }
}