import { Component, input } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { DocumentDownloadComponent } from "../document-download/document-download.component";

@Component({
    selector: 'io-document-preview',
    templateUrl: './document-preview.component.html',
    styleUrl: './document-preview.component.scss',
    standalone: true,
    imports: [
    MatIcon,
    DocumentDownloadComponent
],
})
export class DocumentPreviewComponent {

    readonly header$ = input.required<string | undefined>({alias: 'header'});
    readonly content$ = input.required<string | undefined>({alias: 'content'});
    readonly fileName$ = input<string | undefined>('', {alias: 'fileName'});


}