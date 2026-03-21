import { Component, input, signal, computed, Self, Optional, ChangeDetectorRef, DoCheck, ViewChild, output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'io-entity-select',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatButtonModule,
        FormsModule
    ],
    templateUrl: './entity-select.component.html',
})
export class EntitySelectComponent<T> implements ControlValueAccessor, DoCheck { 

    readonly options = input.required<T[]>();
    readonly labelKey = input.required<keyof T>();
    readonly valueKey = input.required<keyof T>();
    
    readonly label = input<string>('');
    readonly labelIcon = input<string>('');

    readonly selectionChanged = output<any>(); 

    value = signal<any>(null);
    isDisabled = signal(false);

    private _touched = false;
    private _invalid = false;

    onChange = (value: any) => {};
    onTouched = () => {};

    @ViewChild(MatSelect) matSelect!: MatSelect;

    constructor(
        @Self() @Optional() public ngControl: NgControl,
        private cdr: ChangeDetectorRef
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    selectedEntityLabel = computed(() => {
        const currentVal = this.value();
        if (currentVal === null || currentVal === undefined) return '';
        
        const selectedItem = this.options().find(item => item[this.valueKey()] === currentVal);
        return selectedItem ? String(selectedItem[this.labelKey()]) : '';
    });

    ngDoCheck(): void {
        const isTouched = this.ngControl?.touched || false;
        const isInvalid = this.ngControl?.invalid || false;

        if (isTouched !== this._touched || isInvalid !== this._invalid) {
            this._touched = isTouched;
            this._invalid = isInvalid;
            
            this.matSelect?.updateErrorState();
            this.cdr.markForCheck();
        }
    }

    required = computed(() => {
        const control = this.ngControl?.control;
        if (!control || !control.validator) return false;
        const validationResult = control.validator({} as AbstractControl);
        return !!(validationResult && validationResult['required']);
    });

    matcher = new class implements ErrorStateMatcher {
        constructor(private parent: EntitySelectComponent<T>) {}
        isErrorState(): boolean {
            return !!(this.parent.ngControl?.invalid && this.parent.ngControl?.touched);
        }
    }(this);

    writeValue(obj: any): void {
        this.value.set(obj);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled.set(isDisabled);
    }

    onSelectionChange(event: any) {
        this.value.set(event.value);
        this.onChange(event.value);
        this.onTouched();
        
        this.selectionChanged.emit(event.value); 

        setTimeout(() => {
            this.matSelect?.updateErrorState();
        });
    }

    clearSelection(event: Event) {
        event.stopPropagation();
        
        this.value.set(null);
        this.onChange(null); 
        this.onTouched();
        
        this.selectionChanged.emit(null); 

        setTimeout(() => {
            this.matSelect?.updateErrorState();
        });
    }
    
}