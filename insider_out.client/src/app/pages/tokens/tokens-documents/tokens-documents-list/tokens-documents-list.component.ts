import { Component, input, output } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { DocumentModel, TokenSensitivity } from "../../../../models/token.model";
import { DatePipe, NgTemplateOutlet } from "@angular/common";
import { PillComponent } from "../../../../fragments/pill/pill.component";
import { sensitivity_colors, sensitivity_text } from "../../../../fragments/pill/token-sensitivity-constants";

@Component({
    selector: 'io-tokens-documents-list',
    templateUrl: './tokens-documents-list.component.html',
    styleUrl: './tokens-documents-list.component.scss',
    standalone: true,
    imports: [
    MatIcon,
    DatePipe,
    PillComponent,
    NgTemplateOutlet
]
})
export class TokensDocumentsListComponent {

    readonly documents$ = input.required<DocumentModel[]>({alias:"documents"})
    readonly isLoading = input<boolean>(false, {alias: "isLoading"});

    readonly documentSelected = output<DocumentModel>();

    sensitivityColors = sensitivity_colors;
    sensitivityText = sensitivity_text;
    sensitivityOptions = Object.values(TokenSensitivity);

    onDocumentClicked(document: DocumentModel) {
        this.documentSelected.emit(document);
    }
}