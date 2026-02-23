import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { DocumentDto, DocumentModel, TokenSensitivity, TokenType } from "../models/token.model";
import { computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { catchError, map, pipe, switchMap, tap } from "rxjs";

type DocumentState = {
    documents: DocumentModel[];
    selectedDocument: DocumentModel | null;
    isLoading: boolean;
    error: string | null;
};

const initialState: DocumentState = {
    documents: [],
    selectedDocument: null,
    isLoading: false,
    error: null,
};

export function toDocumentModel(dto: DocumentDto): DocumentModel {
    return {
        tokenId: dto.tokenId,
        documentId: dto.documentId,
        name: dto.name,
        location: dto.location,
        type: TokenType.document, 
        sensitivity: dto.tokenSeverity.toLowerCase() as TokenSensitivity, 
        updated: new Date() // Fallback since 'updated' is missing from the JSON response
    };
}

export function toDocumentDto(model: Partial<DocumentModel>): DocumentDto {
    return {
        documentId: model.documentId ?? 0,
        tokenId: model.tokenId ?? 0,
        name: model.name || '',
        location: model.location || '',
        tokenType: 'Document', 
        tokenSeverity: model.sensitivity?.toString() || TokenSensitivity.Low.toString()
    };
}

export const DocumentStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),

    withComputed((store) => ({
        documentCount: computed(() => store.documents().length),
        hasSelectedDocument: computed(() => !!store.selectedDocument()),
        entityMap: computed(() => {
            const map: Record<number, DocumentModel> = {};
            for (const document of store.documents()) {
                map[document.documentId] = document;
            }
            return map;
        })
    })),

    withMethods((store, http = inject(HttpClient)) => {
        const apiUrl = 'https://localhost:7244/api/documents'; 

        return {
            loadAll: rxMethod<void>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, error: null })),
                    switchMap(() => http.get<DocumentDto[]>(apiUrl).pipe(
                        map((dtos) => dtos.map(toDocumentModel)),
                        tap((documents) => {
                            patchState(store, { 
                                documents, 
                                isLoading: false 
                            });
                        }),
                        catchError((err) => {
                            console.error('Failed to load documents:', err);
                            patchState(store, { isLoading: false, error: err.message });
                            return [];
                        })
                    ))
                )
            ),

            create: rxMethod<Omit<DocumentModel, 'tokenId' | 'documentId' | 'type' | 'updated'>>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, error: null })),
                    switchMap((newModel) => {
                        const payload = toDocumentDto(newModel as Partial<DocumentModel>);

                        return http.post<DocumentDto>(apiUrl, payload).pipe(
                            map(toDocumentModel),
                            tap((createdDoc) => {
                                patchState(store, (state) => ({
                                    documents: [...state.documents, createdDoc],
                                    isLoading: false
                                }));
                            }),
                            catchError((err) => {
                                console.error('Failed to create document:', err);
                                patchState(store, { isLoading: false, error: err.message });
                                return [];
                            })
                        );
                    })
                )
            ),

            delete: rxMethod<number>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, error: null })),
                    switchMap((id) => http.delete(`${apiUrl}/${id}`).pipe(
                        tap(() => {
                            patchState(store, (state) => ({
                                documents: state.documents.filter(d => d.documentId !== id),
                                selectedDocument: state.selectedDocument?.documentId === id ? null : state.selectedDocument,
                                isLoading: false
                            }));
                        }),
                        catchError((err) => {
                            console.error('Failed to delete document:', err);
                            patchState(store, { isLoading: false, error: err.message });
                            return [];
                        })
                    ))
                )
            ),

            update: rxMethod<{ id: number; data: DocumentModel }>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, error: null })),
                    switchMap(({ id, data }) => {
                        const payload = toDocumentDto(data);

                        return http.put(`${apiUrl}/${id}`, payload).pipe(
                            tap(() => {
                                patchState(store, (state) => ({
                                    documents: state.documents.map(d => d.documentId === id ? data : d),
                                    selectedDocument: state.selectedDocument?.documentId === id ? data : state.selectedDocument,
                                    isLoading: false
                                }));
                            }),
                            catchError((err) => {
                                console.error('Failed to update document:', err);
                                patchState(store, { isLoading: false, error: err.message });
                                return [];
                            })
                        );
                    })
                )
            ),

            selectDocument: rxMethod<number>(
                pipe(
                    tap(() => patchState(store, { isLoading: true, error: null })),
                    switchMap((id) => {
                        const existing = store.documents().find(d => d.documentId === id);
                        if (existing) {
                            patchState(store, { selectedDocument: existing, isLoading: false });
                            return [];
                        }

                        return http.get<DocumentDto>(`${apiUrl}/${id}`).pipe(
                            map(toDocumentModel),
                            tap(document => patchState(store, { selectedDocument: document, isLoading: false })),
                            catchError((err) => {
                                console.error('Failed to load document details:', err);
                                patchState(store, { isLoading: false, error: err.message });
                                return [];
                            })
                        );
                    })
                )
            ),
            loadDocument: rxMethod<number>(
                pipe(
                    switchMap((id) => {
                        if (store.entityMap()[id]) {
                            return []; 
                        }

                        return http.get<DocumentDto>(`${apiUrl}/${id}`).pipe(
                            map(toDocumentModel),
                            tap((document) => {
                                patchState(store, (state) => ({
                                    documents: [...state.documents, document] 
                                }));
                            }),
                            catchError((err) => {
                                console.error(`Failed to load missing document ${id}:`, err);
                                return [];
                            })
                        );
                    })
                )
            ),

            clearSelectedDocument() {
                patchState(store, { selectedDocument: null });
            }
        };
    }),
    withHooks({
        onInit(store) {
            store.loadAll(); 
        }
    })
);