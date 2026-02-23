import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { patchState, signalStore, withMethods, withState, withComputed, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe } from 'rxjs';
import { tap, switchMap, catchError, map } from 'rxjs/operators';
import { computed } from '@angular/core';
import { SubjectDto, SubjectModel, UserDto, UserModel } from '../models/profile.model';

type SubjectState = {
    subjects: SubjectModel[];
    selectedSubject: SubjectModel | null;
    isLoading: boolean;
    error: string | null;
};

    const initialState: SubjectState = {
    subjects: [],
    selectedSubject: null,
    isLoading: false,
    error: null,
};

export function toSubjectModel(dto: SubjectDto): SubjectModel {
    return {
        subjectId: dto.subjectId,
        firstName: dto.subjectFirstName, 
        lastName: dto.subjectLastName,
        email: dto.subjectEmail,
        phone: dto.subjectPhone,
        department: dto.subjectDepartment,
        riskScore: dto.subjectRiskScore,
        role: dto.subjectRole,
    };
}

export function toSubjectDto(model: Partial<SubjectModel>): SubjectDto {
    return {
        subjectId: model.subjectId || 0,
        subjectFirstName: model.firstName || '',
        subjectLastName: model.lastName || '',
        subjectEmail: model.email || '',
        subjectPhone: model.phone,
        subjectDepartment: model.department,
        subjectRiskScore: model.riskScore || 0,
        subjectRole: model.role || '',
    };
}

export const SubjectStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),

    withComputed((store) => ({
        entityMap: computed(() => {
            const map: Record<number, SubjectModel> = {};
            for (const subject of store.subjects()) {
                map[subject.subjectId] = subject;
            }
            return map;
        })
    })),

    withMethods((store, http = inject(HttpClient)) => {
        const apiUrl = 'https://localhost:7244/api/subjects';

        return {

            loadAll: rxMethod<void>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap(() => http.get<SubjectDto[]>(apiUrl).pipe(
                        map((dtos) => dtos.map(toSubjectModel)),
                        tap((subjects) => {
                            patchState(store, { 
                                subjects, 
                                isLoading: false 
                            });
                        }),
                        catchError((err) => {
                            console.error(err);
                            patchState(store, { isLoading: false });
                            return []; 
                        })
                    ))
                )
            ),

            create: rxMethod<Omit<SubjectModel, 'subjectId'>>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap((newModel) => {
                        const payload = toSubjectDto(newModel); 

                        return http.post<SubjectDto>(apiUrl, payload).pipe(
                            map(toSubjectModel),
                            tap((createdSubject) => {
                                patchState(store, (state) => ({
                                    subjects: [...state.subjects, createdSubject], 
                                    isLoading: false
                                }));
                            })
                        );
                    })
                )
            ),

            delete: rxMethod<number>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap((id) => http.delete(`${apiUrl}/${id}`).pipe(
                        tap(() => {
                            patchState(store, (state) => ({
                                subjects: state.subjects.filter(u => u.subjectId !== id),
                                isLoading: false
                            }));
                        })
                    ))
                )
            ),

            update: rxMethod<{ id: number; data: SubjectModel }>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap(({ id, data }) => {
                        const payload = toSubjectDto(data);
                        
                        return http.put(`${apiUrl}/${id}`, payload).pipe(
                            tap(() => {
                                patchState(store, (state) => ({
                                    subjects: state.subjects.map(u => u.subjectId === id ? data : u),
                                    isLoading: false
                                }));
                            })
                        )
                    })
                )
            ),

            selectSubject: rxMethod<number>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap((id) => {
                        const existing = store.subjects().find(u => u.subjectId === id);
                        if (existing) {
                            patchState(store, { selectedSubject: existing, isLoading: false });
                            return [];
                        }

                    return http.get<SubjectModel>(`${apiUrl}/${id}`).pipe(
                            tap(subject => patchState(store, { selectedSubject: subject, isLoading: false }))
                        );
                    })
                )
            ),
            loadSubject: rxMethod<number>(
                pipe(
                    switchMap((id) => {
                        if (store.entityMap()[id]) {
                            return []; 
                        }

                        return http.get<SubjectDto>(`${apiUrl}/${id}`).pipe(
                            map(toSubjectModel),
                            tap((subject) => {
                                patchState(store, (state) => ({
                                    subjects: [...state.subjects, subject] 
                                }));
                            }),
                            catchError((err) => {
                                console.error(`Failed to load missing subject ${id}:`, err);
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