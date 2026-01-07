import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatIconModule, RouterModule],
  template: `
    <div class="home-container">
      <div class="intro-card">
        <div>
          <h1>Bienvenue sur l'application de réservation de vélos 🚲</h1>
          <p>
            Gérez facilement les utilisateurs, les vélos et les réservations,
            et visualisez les emplacements sur la carte.
          </p>
        </div>
      </div>

      <div class="cards-grid">
        <mat-card class="nav-card" routerLink="/users">
          <mat-icon>group</mat-icon>
          <h3>Utilisateurs</h3>
          <p>Gérer les comptes utilisateurs</p>
        </mat-card>

        <mat-card class="nav-card" routerLink="/reservations">
          <mat-icon>event</mat-icon>
          <h3>Réservations</h3>
          <p>Gérer les réservations</p>
        </mat-card>

        <mat-card class="nav-card" routerLink="/velos">
          <mat-icon>pedal_bike</mat-icon>
          <h3>Vélos</h3>
          <p>Gérer les vélos</p>
        </mat-card>

        <mat-card class="nav-card" routerLink="/map">
          <mat-icon>map</mat-icon>
          <h3>Carte</h3>
          <p>Voir les vélos sur la carte</p>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1000px;
      margin: 2rem auto;
      padding: 1rem;
      text-align: center;
      padding-bottom: 100px;
    }

    .intro-card {
      margin-bottom: 2rem;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      padding-top: 20px;
    }

    .nav-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      cursor: pointer;
      border: solid 3px black;
      border-radius: 10px;
      transition: all 0.2s ease;
    }

    .nav-card:hover {
      transform: translateY(-5px);
      background-color: rgba(52, 152, 219, 0.38);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.28);
    }

    mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 0.5rem;
      color: #3f51b5;
    }
  `]
})
export class HomeComponent {}
