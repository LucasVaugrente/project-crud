import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { ReservationService } from '../services/reservation.service';
import { ReservationResponse } from '../models/reservation-responseDTO';
import { FormAddReservationComponent } from '../components/form-add-reservation.component';
import { FormUpdateReservationComponent } from '../components/form-update-reservation.component';
import { ConfirmationReserDialogComponent } from '../components/confirmation-reser-dialog.component';
import { InfoDialogComponent } from '../components/info-dialog.component';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <div class="container-reservations">

      <div class="block-btn">
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          + Ajouter une réservation
        </button>
      </div>

      <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">

        <!-- # -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef> # </th>
          <td mat-cell *matCellDef="let r; let i = index">
            {{ i + 1 }}
          </td>
        </ng-container>

        <!-- Utilisateur -->
        <ng-container matColumnDef="utilisateur">
          <th mat-header-cell *matHeaderCellDef> Utilisateur </th>
          <td mat-cell *matCellDef="let r">
            {{ r.utilisateurUsername }}
          </td>
        </ng-container>

        <!-- Vélo -->
        <ng-container matColumnDef="velo">
          <th mat-header-cell *matHeaderCellDef> Vélo </th>
          <td mat-cell *matCellDef="let r">
            {{ r.veloNom }}
          </td>
        </ng-container>

        <!-- Quantité -->
        <ng-container matColumnDef="quantite">
          <th mat-header-cell *matHeaderCellDef> Quantité </th>
          <td mat-cell *matCellDef="let r">
            {{ r.reservation }}
          </td>
        </ng-container>

        <!-- Actions -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let r">
            <button class="btn-update" (click)="openEditDialog(r)">
              Mettre à jour
            </button>
            <button class="btn-delete" (click)="confirmDelete(r)">
              Supprimer
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

      </table>

      <mat-paginator
        [pageSizeOptions]="[5, 10, 20]"
        showFirstLastButtons>
      </mat-paginator>

    </div>
  `,
  styles: [`
    .container-reservations {
      padding-bottom: 100px;
    }

    table {
      border-radius: 5px;
      font-size: 12px;
      border-collapse: collapse;
      width: 100%;
      background-color: white;
    }

    td, th {
      text-align: center;
      padding: 8px;
    }

    thead th {
      color: #ffffff;
      background: #324960;
    }

    tr:nth-child(even) {
      background: #F8F8F8;
    }

    .block-btn {
      margin: 20px;
    }

    .btn-update {
      background-color: #3984ac;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 12px;
      margin-right: 10px;
    }

    .btn-update:hover {
      background-color: #2e6f91;
    }

    .btn-delete {
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 12px;
    }

    .btn-delete:hover {
      background-color: #d32f2f;
    }
  `]
})
export class ReservationComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'utilisateur', 'velo', 'quantite', 'actions'];
  dataSource = new MatTableDataSource<ReservationResponse>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private reservationService: ReservationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadReservations(): void {
    this.reservationService.getAll().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  openAddDialog(): void {
    this.dialog.open(FormAddReservationComponent, {
      width: '500px'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.reservationService.create(result).subscribe({
        next: () => this.loadReservations(),
        error: err => {
          if (err.status === 400 && err.error?.message) {
            this.dialog.open(InfoDialogComponent, {
              width: '400px',
              data: { message: err.error.message }
            });
          }
        }
      });
    }
  });
}


  openEditDialog(r: ReservationResponse): void {
    this.dialog.open(FormUpdateReservationComponent, {
    data: r,
    width: '600px'
  }).afterClosed().subscribe(result => {

    if (!result) return;

    this.reservationService.update(
      r.utilisateurId,
      r.veloId,
      {
        utilisateurId: r.utilisateurId,
        veloId: r.veloId,
        reservation: result.reservation
      }
    ).subscribe({
      next: () => {
        this.loadReservations();
      },
      error: err => {
        console.log('ERREUR BACKEND:', err);

        if (err.status === 400 && err.error?.message) {
          this.dialog.open(InfoDialogComponent, {
            width: '400px',
            data: { message: err.error.message }
          });
        }
      }
    });

  });
  }


  confirmDelete(r: ReservationResponse): void {
    const dialogRef = this.dialog.open(ConfirmationReserDialogComponent, {
      width: '400px',
      data: { message: 'Êtes-vous sûr de vouloir supprimer cette réservation ?' }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.reservationService
          .delete(r.utilisateurId, r.veloId)
          .subscribe(() => this.loadReservations());
      }
    });
  }
}
