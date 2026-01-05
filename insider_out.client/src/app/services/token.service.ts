import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { DocumentModel, EmailModel, Token, TokenSeverity, TokenType } from '../models/token.model';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    private documents = signal<DocumentModel[]>([
        {
            type: TokenType.document,
            documentId: 123,
            name: 'MFA Password Enrollment',
            location: 'Server A',
            severity: TokenSeverity.Medium,
        },
        {
            type: TokenType.document,
            documentId: 132,
            name: 'Secret Business Plans',
            location: 'Server A',
            severity: TokenSeverity.High,
        },
        {
            type: TokenType.document,
            documentId: 143,
            name: 'Payroll Incentives 2026',
            location: 'Server B',
            severity: TokenSeverity.Low,
        },
        {
            type: TokenType.document,
            documentId: 154,
            name: 'Budget 2026 - CFO',
            location: 'Server C',
            severity: TokenSeverity.High,
        }
    ]);

    private emails = signal<EmailModel[]>([
    {
        type: TokenType.email,
        emailId: 900,
        subject: 'Urgent Wire Transfer',
        severity: TokenSeverity.High,
    }
    ]);

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