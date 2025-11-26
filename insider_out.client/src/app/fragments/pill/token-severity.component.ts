import { Component } from "@angular/core";
import { BasePillComponent } from "./pill.component";
import { TokenSeverity } from "../../models/token.model";

@Component({
    selector: 'io-token-severity',
    templateUrl: './pill.component.html',
    styleUrl: './pill.component.scss',
    standalone: true
})
export class tokenComponent extends BasePillComponent<TokenSeverity> {

    pillVarMap = new Map<TokenSeverity, string>([
        [TokenSeverity.High, 'var(--severity-high)'],
        [TokenSeverity.Medium, 'var(--severity-medium)'],
        [TokenSeverity.Low, 'var(--severity-low)'],
    ]);

    pillText = new Map<TokenSeverity, string>([
        [TokenSeverity.High, 'High'],
        [TokenSeverity.Medium, 'Medium'],
        [TokenSeverity.Low, 'Low'],
    ]);

}