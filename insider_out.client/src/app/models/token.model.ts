export enum TokenType {
    document,
    email
}

export interface TokenModel {
    tokenId: number;
    updated: Date;
    type: TokenType;
    sensitivity: TokenSensitivity;
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


export enum TokenSensitivity {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}


export interface DocumentDto {
    documentId: number;
    tokenId: number;
    name: string;
    location: string;
    tokenType: string; 
    tokenSensitivity: string;
}