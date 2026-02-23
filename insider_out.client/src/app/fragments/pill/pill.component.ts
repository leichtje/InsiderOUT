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

    private getMatchedKey(map: Map<T, string>, val: T | null | undefined): T | undefined {
        if (!val) return undefined;
        
        const lowerVal = String(val).toLowerCase();
        
        for (const key of map.keys()) {
            if (String(key).toLowerCase() === lowerVal) {
                return key;
            }
        }
        return undefined;
    }

    backgroundColor = computed(() => {
        const map = this.varMap$();
        const matchedKey = this.getMatchedKey(map, this.value());
        
        return matchedKey ? map.get(matchedKey) : 'var(--color-gray-2)';
    });

    displayText = computed(() => {
        const map = this.textMap$();
        const matchedKey = this.getMatchedKey(map, this.value());
        
        return matchedKey ? map.get(matchedKey) : 'Unknown';
    });

    @HostBinding('style.--background-color')
    get bindBackgroundColor() {
        return this.backgroundColor();
    }   
}