export type FilterValue = 'mine' | 'unassigned' | 'all';

export interface FilterOptionModel {
    label: string;
    value: FilterValue;
    icon: string;
}
