import { SubjectModel, UserModel } from "./profile.model";
import { Token } from "./token.model";

export interface IncidentModel {
    incidentId: number;
    title: string;
    date: Date;
    token: Token;
    assignedUserId: UserModel["userId"];
    tiedSubjectId: SubjectModel["subjectId"];
    tiedSubjectAgent: string;
}

