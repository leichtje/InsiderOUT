import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { DocumentModel, EmailModel, Token, TokenSensitivity, TokenType } from '../models/token.model';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    private documentsSignal = signal<DocumentModel[]>([
        {
            tokenId: 123,
            updated: new Date("2025-11-24T09:12:00Z"),
            created: new Date("2025-11-24T09:12:00Z"),
            type: TokenType.document,
            documentId: 123,
            name: 'MFA Password Enrollment',
            location: 'Server A',
            sensitivity: TokenSensitivity.Medium,
        },
        {
            tokenId: 124,
            updated: new Date("2025-11-24T09:13:00Z"),
            created: new Date("2025-11-24T09:12:00Z"),
            type: TokenType.document,
            documentId: 132,
            name: 'Secret Business Plans',
            location: 'Server A',
            sensitivity: TokenSensitivity.High,
        },
        {
            tokenId: 125,
            updated: new Date("2025-11-24T09:14:00Z"),
            created: new Date("2025-11-24T09:12:00Z"),
            type: TokenType.document,
            documentId: 143,
            name: 'Payroll Incentives 2026',
            location: 'Server B',
            sensitivity: TokenSensitivity.Low,
        },
        {
            tokenId: 126,
            updated: new Date("2025-11-24T09:15:00Z"),
            created: new Date("2025-11-24T09:12:00Z"),
            type: TokenType.document,
            documentId: 154,
            name: 'Budget 2026 - CFO',
            location: 'Server C',
            sensitivity: TokenSensitivity.High,
        }
    ]);

    public documents = this.documentsSignal.asReadonly();


    private emailsSignal = signal<EmailModel[]>([
    {
        tokenId: 127,
        updated: new Date("2025-11-24T09:16:00Z"),
        created: new Date("2025-11-24T09:12:00Z"),
        type: TokenType.email,
        emailId: 900,
        subject: 'Urgent Wire Transfer',
        sensitivity: TokenSensitivity.High,
    }
    ]);

    public emails = this.emailsSignal.asReadonly();

    getToken(id: number, type: TokenType): Observable<Token | null> {
        
        if (type === TokenType.document) {
        const doc = this.documents().find(d => d.documentId === id);
        return of(doc || null);
        } 
        
        if (type === TokenType.email) {
        const mail = this.emails().find(e => e.emailId === id);
        return of(mail || null);
        }

        return of(null);
    }
}