import { UserModel } from "./profile.model";

export interface ActivityModel {
    activityId: number;
    content: string;
    date: Date;
    entityId: number;
    entityType: ActivityScope;
    userId: UserModel["userId"] | null;
}

export enum ActivityScope {
    Incident = 'INCIDENT',
}