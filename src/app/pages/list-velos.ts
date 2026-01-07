import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Velo } from '../models/veloDTO';
import { VeloService } from '../services/velo.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog.component';
import { FormulaireMiseAJourComponent } from '../components/form-update-velo.component';
import { FormulaireAjoutComponent } from '../components/form-add-velo.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-velo-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule],
  template: `
    <div class="container-velos">
      <div>

        <div class="block-btn">
          <button mat-raised-button color="primary" (click)="ouvrirFormulaireAjout()">+ Ajouter un vélo</button>
        </div>

        <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">

          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef> # </th>
            <td mat-cell *matCellDef="let velo"> {{ velo.id }} </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef> Description </th>
            <td mat-cell *matCellDef="let velo"> {{ velo.description }} </td>
          </ng-container>

          <ng-container matColumnDef="nom">
            <th mat-header-cell *matHeaderCellDef> Nom </th>
            <td mat-cell *matCellDef="let velo"> {{ velo.nom }} </td>
          </ng-container>

          <ng-container matColumnDef="quantite">
            <th mat-header-cell *matHeaderCellDef> Quantité </th>
            <td mat-cell *matCellDef="let velo"> {{ velo.quantite }} </td>
          </ng-container>

          <ng-container matColumnDef="coordonneesId">
            <th mat-header-cell *matHeaderCellDef> ID Coordonnées </th>
            <td mat-cell *matCellDef="let velo">
<!--              {{ velo.coordonneesId }}-->
              <button class="btn-seeMap" (click)="voirSurCarte(velo)">
                Voir sur la carte
              </button>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let velo">
              <button class="btn-update" (click)="ouvrirFormulaireMiseAJour(velo)">Mettre à jour</button>
              <button class="btn-delete" (click)="supprimerVelo(velo.id)">Supprimer</button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 20]"
                       showFirstLastButtons
                       aria-label="Sélectionner la page des velos">
        </mat-paginator>

      </div>
    </div>
  `,
  styles: [`
    .container-velos {
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

    .btn-delete, .btn-update, .btn-seeMap {
      color: white;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 12px;
    }

    .btn-delete {
      background-color: #f44336;

    }

    .btn-delete:hover {
      background-color: #d32f2f;
    }

    .btn-update {
      background-color: #3984ac;
      margin-right: 10px;
    }

    .btn-update:hover {
      background-color: #2e6f91;
    }

    .btn-seeMap {
      background-color: #5cc31c;
    }

    .btn-seeMap:hover {
      background-color: #4ba116;
    }
  `]
})

export class VeloListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'description', 'nom', 'quantite', 'coordonneesId', 'actions'];

  dataSource = new MatTableDataSource<Velo>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private veloService: VeloService,
    private router: Router
  ) {}

  ngOnInit() {
    this.veloService.getVelos().subscribe(data => {
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
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.veloService.addVelo(result).subscribe(() => {
          this.ngOnInit();
        });
      }
    });
  }

  ouvrirFormulaireMiseAJour(velo: Velo): void {
    this.veloService.getVelosWithCoordonnees().subscribe(velos => {
      const veloWithCoord = velos.find(v => v.id === velo.id);
      const dialogRef = this.dialog.open(FormulaireMiseAJourComponent, {
        data: { velo: veloWithCoord },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.veloService.updateVelo(velo.id, result).subscribe(() => {
            this.veloService.getVelos().subscribe(data => {
              this.dataSource.data = data;
            });
          });
        }
      });
    });
  }

  supprimerVelo(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: 'Êtes-vous sûr de vouloir supprimer ce vélo ?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.veloService.supprimerVelo(id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(velo => velo.id !== id);
        });
      }
    });
  }

  voirSurCarte(velo: Velo): void {
    this.veloService.getVelosWithCoordonnees().subscribe(velos => {
      const veloWithCoord = velos.find(v => v.id === velo.id);
      if (veloWithCoord) {
        this.router.navigate(['/map'], {
          state: {
            latitude: veloWithCoord.latitude,
            longitude: veloWithCoord.longitude,
            nom: veloWithCoord.nom
          }
        });
      }
    });
  }
}
