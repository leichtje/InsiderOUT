import { SubjectModel, UserModel } from "./profile.model";

export interface IncidentsModel {
    incidentId: number;
    title: string;
    assignedUserId: UserModel["userId"];
    tiedSubjectId: SubjectModel["subjectId"];
}
