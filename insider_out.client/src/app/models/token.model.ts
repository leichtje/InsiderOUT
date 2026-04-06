export enum TokenType {
    document,
    email
}

export interface TokenModel {
    tokenId: string;
    updated: Date;
    created: Date;
    type: TokenType;
    sensitivity: TokenSensitivity;
}

export interface DocumentModel extends TokenModel {
    type: TokenType.document;
    documentId: number;
    tokenId: string;
    name: string;
    location: string;
    department: string;
    content: string;
    header: string;
    fileName: string;
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
    tokenId: string;
    documentName: string;
    documentLocation: string;
    tokenType: string; 
    tokenSeverity: string;
    updatedDate: Date;
    createdDate: Date;
    documentDepartment: string;
    documentContent: string;
    documentHeader: string;
    documentFilepath: string;
}

export interface documentGenerationData {
    content: string;
    header: string;
    fileName: string; 
    tokenId: string;
}