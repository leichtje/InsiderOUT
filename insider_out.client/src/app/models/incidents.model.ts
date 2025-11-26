import { SubjectModel, UserModel } from "./profile.model";
import { Token, TokenType } from "./token.model";

export interface IncidentModel {
    incidentId: number;
    title: string;
    desc: string;
    date: Date;
    updated: Date;
    agent: string;
    tokenId: number;
    tokenType: TokenType;
    status: IncidentStatus;
    assignedUserId: UserModel["userId"] | null;
    tiedSubjectId: SubjectModel["subjectId"] | null;
}


export interface IncidentViewModel {
    incident: IncidentModel;
    token: Token | null;
    subject: SubjectModel | null;
    user: UserModel | null;
}

export enum IncidentStatus {
    New = 'New',
    inProgress = 'inProgress',
    Resolved = 'Resolved',
    Closed = 'Closed'
}