import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, computed, DoCheck, input, Optional, Self, signal, ViewChild } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormsModule, NgControl } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelect, MatSelectModule } from "@angular/material/select";

@Component({
    selector: 'io-entity-select',
    standalone: true,
    templateUrl: 'entity-select.component.html',
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule
    ]
})
export class EntitySelectComponent<T> implements ControlValueAccessor, DoCheck { 

    readonly options = input.required<T[]>();
    
    readonly labelKey = input.required<keyof T>();
    readonly valueKey = input.required<keyof T>();
    
    readonly label = input<string>('');

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
        
        setTimeout(() => {
            this.matSelect?.updateErrorState();
        });
    }
}