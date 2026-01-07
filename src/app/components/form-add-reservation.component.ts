import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { NgFor, NgIf } from '@angular/common';

import { UtilisateurService } from '../services/utilisateur.service';
import { VeloService } from '../services/velo.service';
import { Utilisateur } from '../models/utilisateurDTO';
import { Velo } from '../models/veloDTO';

@Component({
  selector: 'app-form-add-reservation',
  standalone: true,
  template: `
    <h1 mat-dialog-title>Ajouter une réservation</h1>

    <div mat-dialog-content>
      <form [formGroup]="form" class="form-container">

        <!-- Utilisateur -->
        <mat-form-field class="full-width">
          <mat-label>Utilisateur</mat-label>
          <mat-select formControlName="utilisateurId">
            <mat-option *ngFor="let u of utilisateurs" [value]="u.id">
              {{ u.username }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Vélo -->
        <mat-form-field class="full-width">
          <mat-label>Vélo</mat-label>
          <mat-select formControlName="veloId">
            <mat-option *ngFor="let v of velos" [value]="v.id">
              {{ v.nom }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Quantité -->
        <mat-form-field class="full-width">
          <mat-label>Quantité</mat-label>
          <input matInput type="number" formControlName="reservation">
        </mat-form-field>

      </form>
    </div>

    <div mat-dialog-actions class="actions-container">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-button color="primary" [disabled]="form.invalid" (click)="onSubmit()">
        Ajouter
      </button>
    </div>
  `,
  styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .full-width {
      width: 100%;
    }
    .actions-container {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 8px 16px 16px;
    }
  `],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    NgFor,
    NgIf
  ]
})
export class FormAddReservationComponent implements OnInit {

  form!: FormGroup;

  utilisateurs: Utilisateur[] = [];
  velos: Velo[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FormAddReservationComponent>,
    private utilisateurService: UtilisateurService,
    private veloService: VeloService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      utilisateurId: ['', Validators.required],
      veloId: ['', Validators.required],
      reservation: [1, [Validators.required, Validators.min(1)]]
    });

    this.loadData();
  }

  loadData() {
    this.utilisateurService.getUtilisateurs().subscribe(data => {
      this.utilisateurs = data;
    });

    this.veloService.getVelos().subscribe(data => {
      this.velos = data;
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
