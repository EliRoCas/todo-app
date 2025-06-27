import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, forwardRef, inject, input, model } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { filter } from 'rxjs';

export type InputTypes = "text" | "datetime" | 'checkbox' | 'textarea' | 'button-toogle';
export type InputSize = "s" | "m" | 'l';

@Component({
  selector: 'app-input',
  imports: [FormsModule, NgTemplateOutlet],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => Input),
      multi: true
    }
  ]
})
export class Input<T> implements ControlValueAccessor, Validator {

  datePipe = inject(DatePipe);

  label = input('');
  id = input(crypto.randomUUID());
  placeholder = input('');
  type = input.required<InputTypes>();
  size = input<InputSize>('m');
  value = model<T>();
  option = input<T>();
  disabled = model(false);
  required = model(false);

  private onChange: (value: any) => void = () => { };
  onTouched: () => void = () => { };

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
    this.disabled.set(isDisabled);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (['button-toogle', 'checkbox'].includes(this.type())) {
      control?.valueChanges
        .pipe(
          filter(x => x !== this.value())
        )
        .subscribe(v => {
          this.value.set(v);
        });
    }

    this.required.set(control.hasValidator(Validators.required))
    return null;
  }

  registerOnValidatorChange?(fn: () => void): void {
    // throw new Error('Method not implemented.');
  }

  inputChanged(value: T) {
    this.onTouched();

    switch (this.type()) {
      case 'datetime':
        this.value.set(value
          ? new Date(value.toString()) as any
          : undefined);
        break;

      case 'checkbox':

        if (this.checkBoxValue.includes(this.option())) {
          this.value.set(this.checkBoxValue.filter(x => x !== value) as any);
        } else {
          this.value.set([...this.checkBoxValue, value] as any);
        }

        break;

      default:
        this.value.set(value);
    }

    this.onChange(this.value());
  }

  get inputValue(): any {
    switch (this.type()) {
      case 'datetime':
        if (this.value()
          && this.value() instanceof Date
          && !isNaN(new Date(this.value()!.toString()).getTime())) {

          return this.datePipe.transform(this.value() as Date, 'yyyy-MM-ddTHH:mm');

        } else {
          return '';
        }

      case 'checkbox':
        return this.checkBoxValue.includes(this.option());

      default:
        return this.value();

    }
  }

  get checkBoxValue(): Array<T | undefined> {
    if (Array.isArray(this.value())) {
      return this.value() as Array<T>;
    } else if (this.option()) {
      return [this.option()!];
    }

    return [];
  }
}
