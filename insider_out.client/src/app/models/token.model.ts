export enum TokenType {
    document,
    email
}

export interface TokenModel {
    type: TokenType;
    severity: TokenSeverity;
}

export interface DocumentModel extends TokenModel {
    type: TokenType.document;
    documentId: number;
    name: string;
    location: string;
}

export interface EmailModel extends TokenModel {
    type: TokenType.email;
    emailId: number;
    subject: string;
}

export type Token = DocumentModel | EmailModel;


export enum TokenSeverity {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}