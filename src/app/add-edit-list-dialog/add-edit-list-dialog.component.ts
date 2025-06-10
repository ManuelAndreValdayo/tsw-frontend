import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

export interface AddEditListData {
  action: 'create' | 'edit';
  currentName?: string;
}

@Component({
  standalone: true,
  selector: 'app-add-edit-list-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>{{data.action === 'create' ? 'Añadir Lista' : 'Modificar Lista'}}</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill" style="width:100%">
          <mat-label>Nombre de la lista</mat-label>
          <input matInput formControlName="nombre" maxlength="50" />
          <mat-error *ngIf="form.get('nombre')?.hasError('required')">
            El nombre es obligatorio
          </mat-error>
          <mat-error *ngIf="form.get('nombre')?.hasError('maxlength')">
            Máximo 50 caracteres
          </mat-error>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          {{data.action === 'create' ? 'Añadir' : 'Modificar'}}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class AddEditListDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddEditListData
  ) {
    this.form = this.fb.group({
      nombre: [data.currentName || '', [Validators.required, Validators.maxLength(50)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close({ nombre: this.form.value.nombre });
    }
  }
}
