import { UserModel } from "./profile.model";

export enum ActivityScope {
    Incident = 'INCIDENT',
}

export interface ActivityModel {
    activityId: number;
    content: string;
    date: Date;
    entityId: number;
    entityType: ActivityScope;
    userId: UserModel["userId"] | null;
}

export interface ActivityDto {
    activityId: number;
    content: string;
    date: string;
    entityId: number;
    entityType: string;
    userId: number | null;
}