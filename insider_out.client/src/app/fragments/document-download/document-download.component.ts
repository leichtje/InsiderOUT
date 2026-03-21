import { Component, input } from "@angular/core";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: 'io-document-download',
    standalone: true,
    imports: [MatIcon],
    templateUrl: './document-download.component.html',
}) 
export class DocumentDownloadComponent {
    readonly fileName$ = input<string | undefined>('', {alias: 'fileName'});

}