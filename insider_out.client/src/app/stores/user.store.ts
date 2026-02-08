import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { patchState, signalStore, withMethods, withState, withComputed, withHooks } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { computed } from '@angular/core';
import { SubjectModel, UserModel } from '../models/profile.model';

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

export const UserStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),

    withComputed((store) => ({
        isAuthenticated: computed(() => !!store.currentUser()),
        userCount: computed(() => store.users().length),
    })),

    withMethods((store, http = inject(HttpClient)) => {
        const apiUrl = 'https://localhost:7000/api/users';

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
                    switchMap(() => http.get<UserModel[]>('https://localhost:7000/api/users').pipe(
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

            create: rxMethod<Omit<UserModel, 'userId'>>(
                pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap((newUser) => http.post<UserModel>(apiUrl, newUser).pipe(
                        tap((createdUser) => {
                            patchState(store, (state) => ({
                                users: [...state.users, createdUser],
                                isLoading: false
                            }));
                        })
                    ))
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
                    tap((id) => console.log('Store: selectUser called with ID:', id)), // <--- Debug Log 1
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap((id) => {
                        const existing = store.users().find(u => u.userId === id);
                        if (existing) {
                            patchState(store, { selectedUser: existing, isLoading: false });
                            return [];
                        }

                    return http.get<UserModel>(`https://localhost:7000/api/users/${id}`).pipe(
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