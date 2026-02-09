import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { patchState, signalStore, withMethods, withState, withComputed, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe } from 'rxjs';
import { tap, switchMap, catchError, map } from 'rxjs/operators';
import { computed } from '@angular/core';
import { SubjectModel, UserDto, UserModel } from '../models/profile.model';

type UserState = {
    users: UserModel[];
    currentUser: UserModel | null;
    selectedUser: UserModel | null;
    isLoading: boolean;
    error: string | null;
};

    const initialState: UserState = {
    users: [],
    currentUser: null,
    selectedUser: null,
    isLoading: false,
    error: null,
};

export function mapUser(dto: UserDto): UserModel {
    return {
        userId: dto.userId,
        firstName: dto.userFirstName, 
        lastName: dto.userLastName,
        email: dto.userEmail,
        phone: dto.userPhone,
        department: dto.userDepartment
    };
}

export const UserStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),

    withComputed((store) => ({
        isAuthenticated: computed(() => !!store.currentUser()),
        userCount: computed(() => store.users().length),
    })),

    withMethods((store, http = inject(HttpClient)) => {
        const apiUrl = 'https://localhost:7244/api/users';

        return {
            
            setCurrentUser(user: UserModel) {
                patchState(store, { currentUser: user });
            },

            isCurrentUser(profileOrId: number | UserModel | SubjectModel): boolean {
                const current = store.currentUser();
                if (!current) return false;

                if (typeof profileOrId === 'number') {
                    return current.userId === profileOrId;
                }

                if ('userId' in profileOrId) {
                    return current.userId === profileOrId.userId;
                }

                return false;
            },

            loadAll: rxMethod<void>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap(() => http.get<UserDto[]>(apiUrl).pipe(

                        map((dtos) => dtos.map(dto => mapUser(dto))),

                        tap((users) => {
                            const defaultUser = users.find(u => u.userId === 1) || null;

                            patchState(store, { 
                                users, 
                                currentUser: defaultUser, 
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

            create: rxMethod<Omit<UserModel, 'subjectId'>>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap((newModel) => {
                        
                        const payload: Omit<UserDto, 'userId'> = {
                            userFirstName: newModel.firstName,
                            userLastName: newModel.lastName,
                            userEmail: newModel.email,
                            userPhone: newModel.phone,
                            userDepartment: newModel.department,
                        };

                        return http.post<UserDto>(apiUrl, payload).pipe(
                            
                            map((createdDto) => mapUser(createdDto)),

                            tap((createdUser) => {
                                patchState(store, (state) => ({
                                    subjects: [...state.users, createdUser], 
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
                                users: state.users.filter(u => u.userId !== id),
                                isLoading: false
                            }));
                        })
                    ))
                )
            ),

            update: rxMethod<{ id: number; data: UserModel }>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap(({ id, data }) => http.put(`${apiUrl}/${id}`, data).pipe(
                        tap(() => {
                            patchState(store, (state) => ({
                            users: state.users.map(u => u.userId === id ? data : u),
                            currentUser: state.currentUser?.userId === id ? data : state.currentUser,
                            isLoading: false
                            }));
                        })
                    ))
                )
            ),

            selectUser: rxMethod<number>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap((id) => {
                        const existing = store.users().find(u => u.userId === id);
                        if (existing) {
                            patchState(store, { selectedUser: existing, isLoading: false });
                            return [];
                        }

                    return http.get<UserModel>(`${apiUrl}/${id}`).pipe(
                            tap(user => patchState(store, { selectedUser: user, isLoading: false }))
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