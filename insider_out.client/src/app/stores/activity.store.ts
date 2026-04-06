import { computed, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { HttpClient } from "@angular/common/http";
import { catchError, map, pipe, switchMap, tap } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivityDto, ActivityModel, ActivityScope } from "../models/activity.model";

type ActivityState = {
    activities: ActivityModel[];
    isLoading: boolean;
    error: string | null;
};

const initialState: ActivityState = {
    activities: [],
    isLoading: false,
    error: null,
};

export function toActivityModel(dto: ActivityDto): ActivityModel {
    return {
        activityId: dto.activityId,
        content: dto.content,
        date: new Date(dto.date),
        entityId: dto.entityId,
        entityType: dto.entityType as ActivityScope,
        userId: dto.userId === 0 ? null : dto.userId
    };
}

export function toActivityDto(model: Partial<ActivityModel>): ActivityDto {
    return {
        activityId: model.activityId ?? 0,
        content: model.content || '',
        date: model.date ? model.date.toISOString() : new Date().toISOString(),
        entityId: model.entityId ?? 0,
        entityType: model.entityType?.toString() || ActivityScope.Incident,
        userId: model.userId ?? 0 
    };
}

export const ActivityStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),

    withComputed((store) => ({
        activityCount: computed(() => store.activities().length)
    })),

    withMethods((store, http = inject(HttpClient), snackBar = inject(MatSnackBar)) => {
        const apiUrl = 'https://localhost:7244/api/Activities'; 

        return {
            loadAll: rxMethod<void>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, error: null })),
                    switchMap(() => http.get<ActivityDto[]>(apiUrl).pipe(
                        map((dtos) => dtos.map(toActivityModel)),
                        tap((activities) => {
                            patchState(store, { 
                                activities, 
                                isLoading: false 
                            });
                        }),
                        catchError((err) => {
                            console.error('Failed to load activities:', err);
                            patchState(store, { isLoading: false, error: err.message });
                            return [];
                        })
                    ))
                )
            ),

            create: rxMethod<Omit<ActivityModel, 'activityId' | 'date'>>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, error: null })),
                    switchMap((newModel) => {
                        const payload = toActivityDto(newModel);

                        return http.post<ActivityDto>(apiUrl, payload).pipe(
                            map(toActivityModel),
                            tap((createdActivity) => {
                                patchState(store, (state) => ({
                                    activities: [createdActivity, ...state.activities],
                                    isLoading: false
                                }));
                                snackBar.open('Activity added', 'Close', { duration: 3000 });
                            }),
                            catchError((err) => {
                                console.error('Failed to create activity:', err);
                                patchState(store, { isLoading: false, error: err.message });
                                snackBar.open('Failed to add activity', 'Retry', { duration: 3000 });
                                return [];
                            })
                        );
                    })
                )
            )
        };
    }),
    withHooks({
        onInit(store) {
            store.loadAll(); 
        }
    })
);