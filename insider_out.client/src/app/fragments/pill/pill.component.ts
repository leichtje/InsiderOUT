import { Component, HostBinding, computed, input } from "@angular/core";

@Component({
    selector: 'io-pill',
    standalone: true,
    templateUrl: 'pill.component.html',
    styleUrl: 'pill.component.scss'
})
export class PillComponent<T> {
    readonly varMap$ = input.required<Map<T, string>>({alias: 'varMap'});
    readonly textMap$ = input.required<Map<T, string>>({alias: 'textMap'});
    
    value = input<T | null | undefined>(null, { alias: 'pill' });

    backgroundColor = computed(() => {
        const val = this.value();
        if (val === null || val === undefined) return 'var(--color-gray-2)';
        return this.varMap$().get(val) ?? 'var(--color-gray-2)';
    });

    displayText = computed(() => {
        const val = this.value();
        if (val === null || val === undefined) return 'Unknown';
        return this.textMap$().get(val) ?? 'Unknown';
    });

    @HostBinding('style.--background-color')
    get bindBackgroundColor() {
        return this.backgroundColor();
    }   
}