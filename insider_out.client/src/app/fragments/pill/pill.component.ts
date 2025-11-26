import { Directive, HostBinding, computed, input } from "@angular/core";

@Directive()
export abstract class BasePillComponent<T> {

    abstract pillVarMap: Map<T, string>;
    abstract pillText: Map<T, string>;

    value = input<T | null | undefined>(null, { alias: 'pill' });

    backgroundColor = computed(() => {
        const currentVal = this.value();

        if (currentVal === null || currentVal === undefined) {
            return 'var(--color-gray-2)';
        }

        return this.pillVarMap.get(currentVal) ?? 'var(--color-gray-2)';
    });

    displayText = computed(() => {
        const currentVal = this.value();

        if (currentVal === null || currentVal === undefined) {
            return 'Unknown';
        }

        return this.pillText.get(currentVal) ?? 'Unknown';
    });

    @HostBinding('style.--background-color')
    get bindBackgroundColor() {
        return this.backgroundColor();
    }
}