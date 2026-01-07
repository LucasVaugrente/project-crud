import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Utilisateur } from '../models/utilisateurDTO';
import { UtilisateurService } from '../services/utilisateur.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog.component';
import { FormulaireMiseAJourComponent } from '../components/form-update-utilisateur.component';
import { FormulaireAjoutComponent } from '../components/form-add-utilisateur.component'; // Nouveau composant
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-utilisateur-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule],
  template: `
    <div class="container-utilisateurs">
      <div>

        <div class="block-btn">
          <button mat-raised-button color="primary" (click)="ouvrirFormulaireAjout()">+ Ajouter un utilisateur</button>
        </div>

        <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">

          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef> # </th>
            <td mat-cell *matCellDef="let utilisateur"> {{ utilisateur.id }} </td>
          </ng-container>

          <ng-container matColumnDef="nom">
            <th mat-header-cell *matHeaderCellDef> Nom </th>
            <td mat-cell *matCellDef="let utilisateur"> {{ utilisateur.nom }} </td>
          </ng-container>

          <ng-container matColumnDef="prenom">
            <th mat-header-cell *matHeaderCellDef> Prenom </th>
            <td mat-cell *matCellDef="let utilisateur"> {{ utilisateur.prenom }} </td>
          </ng-container>

          <ng-container matColumnDef="mail">
            <th mat-header-cell *matHeaderCellDef> Mail </th>
            <td mat-cell *matCellDef="let utilisateur"> {{ utilisateur.mail }} </td>
          </ng-container>

          <ng-container matColumnDef="username">
            <th mat-header-cell *matHeaderCellDef> Nom d'utilisateur </th>
            <td mat-cell *matCellDef="let utilisateur"> {{ utilisateur.username }} </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let utilisateur">
              <button class="btn-update" (click)="ouvrirFormulaireMiseAJour(utilisateur)">Mettre à jour</button>
              <button class="btn-delete" (click)="supprimerUtilisateur(utilisateur.id)">Supprimer</button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 20]"
                       showFirstLastButtons
                       aria-label="Sélectionner la page des utilisateurs">
        </mat-paginator>

      </div>
    </div>
  `,
  styles: [`
    .container-utilisateurs {
      padding-bottom: 100px;
    }

    table {
      border-radius: 5px;
      font-size: 12px;
      font-weight: normal;
      border: none;
      border-collapse: collapse;
      width: 100%;
      max-width: 100%;
      white-space: nowrap;
      background-color: white;
    }

    td, th {
      text-align: center;
      padding: 8px;
    }

    td {
      border-right: 1px solid #f8f8f8;
      font-size: 12px;
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
  `]
})

export class UtilisateurListComponent implements OnInit, AfterViewInit { // 3. Implémenter AfterViewInit

  displayedColumns: string[] = ['id', 'nom', 'prenom', 'mail', 'username', 'actions'];

  dataSource = new MatTableDataSource<Utilisateur>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog, private utilisateurService: UtilisateurService) {}

  ngOnInit() {
    this.utilisateurService.getUtilisateurs().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ouvrirFormulaireAjout(): void {
    const dialogRef = this.dialog.open(FormulaireAjoutComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((createdUser) => {
      if (createdUser) {
        this.dataSource.data = [...this.dataSource.data, createdUser];
      }
    });
  }

  ouvrirFormulaireMiseAJour(utilisateur: Utilisateur): void {
    const dialogRef = this.dialog.open(FormulaireMiseAJourComponent, {
      data: { utilisateur },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.utilisateurService.updateUtilisateur(result.id, result).subscribe({
          next: (updatedUser) => {
            const index = this.dataSource.data.findIndex(u => u.id === updatedUser.id);
            if (index !== -1) {
              this.dataSource.data[index] = updatedUser;
              this.dataSource.data = [...this.dataSource.data];
            }
          },
          error: (err) => {
            console.error("Erreur lors de la mise à jour de l'utilisateur", err);
          }
        });
      }
    });
  }

  supprimerUtilisateur(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.utilisateurService.supprimerUtilisateur(id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(utilisateur => utilisateur.id !== id);
        });
      }
    });
  }
}
