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

export function mapSubject(dto: SubjectDto): SubjectModel {
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

export const SubjectStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),

    withMethods((store, http = inject(HttpClient)) => {
        const apiUrl = 'https://localhost:7244/api/subjects';

        return {

            loadAll: rxMethod<void>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap(() => http.get<SubjectDto[]>(apiUrl).pipe(

                        map((dtos) => dtos.map(dto => mapSubject(dto))),

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
                        
                        const payload: Omit<SubjectDto, 'subjectId'> = {
                            subjectFirstName: newModel.firstName,
                            subjectLastName: newModel.lastName,
                            subjectEmail: newModel.email,
                            subjectPhone: newModel.phone,
                            subjectDepartment: newModel.department,
                            subjectRiskScore: newModel.riskScore,
                            subjectRole: newModel.role ?? '',
                        };

                        return http.post<SubjectDto>(apiUrl, payload).pipe(
                            
                            map((createdDto) => mapSubject(createdDto)),

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
                                users: state.subjects.filter(u => u.subjectId !== id),
                                isLoading: false
                            }));
                        })
                    ))
                )
            ),

            update: rxMethod<{ id: number; data: SubjectModel }>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap(({ id, data }) => http.put(`${apiUrl}/${id}`, data).pipe(
                        tap(() => {
                            patchState(store, (state) => ({
                                users: state.subjects.map(u => u.subjectId === id ? data : u),
                                isLoading: false
                            }));
                        })
                    ))
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
            )
        };
    }),
    withHooks({
        onInit(store) {
            store.loadAll(); 
        }
    })
);