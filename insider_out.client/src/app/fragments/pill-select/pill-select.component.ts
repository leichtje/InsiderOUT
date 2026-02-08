import { Component, input, signal, computed, Self, Optional, ChangeDetectorRef, DoCheck, ViewChild } from '@angular/core';

import { AbstractControl, ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { PillComponent } from '../pill/pill.component';
import { MatIconModule } from '@angular/material/icon';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
    selector: 'io-pill-select',
    standalone: true,
    imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    PillComponent
],
    templateUrl: './pill-select.component.html',
})
export class PillSelectComponent<T> implements ControlValueAccessor, DoCheck { 

    options = input.required<T[]>();
    varMap = input.required<Map<T, string>>();
    textMap = input.required<Map<T, string>>();
    label = input<string>('');
    labelIcon = input<string>('');

    value = signal<T | null>(null);
    isDisabled = signal(false);

    private _touched = false;
    private _invalid = false;

    onChange = (value: T | null) => {};
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
        constructor(private parent: PillSelectComponent<T>) {}
        isErrorState(): boolean {
            return !!(this.parent.ngControl?.invalid && this.parent.ngControl?.touched);
        }
    }(this);

    writeValue(obj: T | null): void {
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