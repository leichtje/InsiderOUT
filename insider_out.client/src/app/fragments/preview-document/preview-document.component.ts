import { Component, input } from "@angular/core";

@Component({
    selector: 'io-preview-document',
    templateUrl: './preview-document.component.html',
    styleUrl: './preview-document.component.scss',
    standalone: true,
    imports: [
    ],
})
export class PreviewDocumentsDialogComponent {

    readonly header$ = input.required<string | undefined>({alias: 'header'});
    readonly content$ = input.required<string | undefined>({alias: 'content'});


}