import { Component, input } from "@angular/core";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: 'io-preview-document',
    templateUrl: './preview-document.component.html',
    styleUrl: './preview-document.component.scss',
    standalone: true,
    imports: [
    MatIcon
],
})
export class PreviewDocumentsDialogComponent {

    readonly header$ = input.required<string | undefined>({alias: 'header'});
    readonly content$ = input.required<string | undefined>({alias: 'content'});
    readonly fileName$ = input<string | undefined>('', {alias: 'fileName'});


}