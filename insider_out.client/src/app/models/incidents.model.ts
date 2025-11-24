import { SubjectModel, UserModel } from "./profile.model";
import { Token } from "./token.model";

export interface IncidentModel {
    incidentId: number;
    title: string;
    date: Date;
    token: Token;
    status: IncidentStatus;
    assignedUserId: UserModel["userId"] | null;
    tiedSubjectId: SubjectModel["subjectId"] | null;
    tiedSubjectAgent: string;
}


export interface IncidentViewModel {
    incident: IncidentModel;
    subject: SubjectModel | null;
    user: UserModel | null;
}

export enum IncidentStatus {
    New = 'New',
    inProgress = 'inProgress',
    Resolved = 'Resolved',
    Closed = 'Closed'
}