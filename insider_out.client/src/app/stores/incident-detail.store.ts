import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { IncidentModel } from "../models/incidents.model";
import { SubjectModel, UserModel } from "../models/profile.model";
import { DocumentModel, Token, TokenType } from "../models/token.model";
import { computed, effect, inject } from "@angular/core";
import { IncidentStore } from "./incident.store";
import { UserStore } from "./user.store";
import { SubjectStore } from "./subject.store";
import { DocumentStore } from "./documents.store";
import { pipe, tap } from "rxjs";
import { rxMethod } from "@ngrx/signals/rxjs-interop";

type LocalDetailState = {
    incidentId: number | null;
};

export const IncidentDetailStore = signalStore(
    withState<LocalDetailState>({ incidentId: null }),

    withComputed((
        state,
        incidentStore = inject(IncidentStore),
        userStore = inject(UserStore),
        subjectStore = inject(SubjectStore),
        documentStore = inject(DocumentStore)
    ) => {
        const incident = computed(() => incidentStore.selectedIncident());

        const assignedUser = computed(() => {
            const userId = incident()?.assignedUserId;
            return userId ? userStore.entityMap()[userId] : null; 
        });

        const tiedSubject = computed(() => {
            const subjectId = incident()?.tiedSubjectId;
            return subjectId ? subjectStore.entityMap()[subjectId] : null;
        });

        const document = computed(() => {
            const tokenId = incident()?.tokenId;
            return tokenId ? documentStore.entityMap()[tokenId] : null;
        });

        const isLoading = computed(() => 
            incidentStore.isLoading() || 
            userStore.isLoading() || 
            subjectStore.isLoading() || 
            documentStore.isLoading()
        );

        return {
            incident,
            assignedUser,
            tiedSubject,
            document,
            isLoading,
            tokenAsDocument: computed(() => document()?.type === TokenType.document ? document() as DocumentModel : null),
        };
    }),

    withMethods((
        state, 
        incidentStore = inject(IncidentStore),
        userStore = inject(UserStore),
        subjectStore = inject(SubjectStore),
        documentStore = inject(DocumentStore)
    ) => ({
        loadIncidentDetails: rxMethod<number>(
            pipe(
                tap((id) => {
                    patchState(state, { incidentId: id });
                    
                    incidentStore.selectIncident(id);
                })
            )
        ),
        
        clear: () => incidentStore.clearSelectedIncident()
    })),

    withHooks({
        onInit(store) {
            const userStore = inject(UserStore);
            const subjectStore = inject(SubjectStore);
            const documentStore = inject(DocumentStore);

            effect(() => {
                const incident = store.incident();
                if (!incident) return;

                if (incident.assignedUserId) {
                    userStore.loadUser(incident.assignedUserId);
                }
                
                if (incident.tiedSubjectId) {
                    subjectStore.loadSubject(incident.tiedSubjectId);
                }

                if (incident.tokenId) {
                    documentStore.loadDocument(incident.tokenId);
                }
            });
        },  
        onDestroy(store) {
            store.clear();
        }
    })
);