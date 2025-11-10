import { UserModel } from "./profile.model";

export interface IncidentsModel {
    incidentId: number;
    title: string;
    assignedUserId: UserModel["userId"];
}
