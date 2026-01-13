export type FilterValue = 'mine' | 'unassigned' | 'document' | 'email' | 'all';

export interface FilterOptionModel {
    label: string;
    value: FilterValue;
    icon: string;
}
