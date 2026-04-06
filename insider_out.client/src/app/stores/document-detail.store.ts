import { computed, effect, inject } from "@angular/core";
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { IncidentStore } from "./incident.store";
import { DocumentStore } from "./documents.store";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, tap } from "rxjs";
import { TokenType } from "../models/token.model";

type LocalDetailState = {
    tokenId: string | null;
};

export const DocumentDetailStore = signalStore(
    withState<LocalDetailState>({ tokenId: null }),

    withComputed((
        state,
        documentStore = inject(DocumentStore),
        incidentStore = inject(IncidentStore),
    ) => {
        const document = computed(() => documentStore.selectedDocument());

        const relatedIncidents = computed(() => {
            const docId = document()?.tokenId;
            if (!docId) return [];

            return incidentStore.incidents().filter(inc => 
                inc.tokenId === docId && inc.tokenType === TokenType.document
            );
        });

        const isLoading = computed(() => 
            incidentStore.isLoading() || 
            documentStore.isLoading()
        );

        return {
            document,
            relatedIncidents,
            isLoading,
        };
    }),

    withMethods((
        state, 
        incidentStore = inject(IncidentStore),
        documentStore = inject(DocumentStore)
    ) => ({
        loadDocumentDetails: rxMethod<string>(
            pipe(
                tap((id) => {
                    patchState(state, { tokenId: id });
                    
                    documentStore.selectDocument(id);
                })
            )
        ),
        
        clear: () => documentStore.clearSelectedDocument()
    })),

    withHooks({
        onInit(store) {
            const incidentStore = inject(IncidentStore);

            effect(() => {
                const document = store.document();
                if (!document) return;
            });
        },  
        onDestroy(store) {
            store.clear();
        }
    })
);