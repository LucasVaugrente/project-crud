import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../services/Auth.service";
import { Router } from "@angular/router";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <h2>Se connecter</h2>

        <form (ngSubmit)="login()">
          <div class="form-group">
            <label for="mail">Adresse mail</label>
            <div class="input-icon">
              <span class="material-icons">email</span>
              <input id="mail" [(ngModel)]="mail" name="mail" placeholder="Votre mail" required>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <div class="input-icon">
              <span class="material-icons">lock</span>
              <input id="password" [(ngModel)]="password" name="password" type="password" placeholder="Mot de passe" required>
            </div>
          </div>

          <div class="options">
            <label class="remember">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe">
              Se souvenir de moi
            </label>
          </div>

          <button type="submit">Connexion</button>
        </form>

        <p *ngIf="error" class="error">Mail ou Mot de passe incorrect</p>
      </div>
    </div>
  `,
  styles: [`

    .login-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #2c3e50, #4c5b6b);
      padding: 10px 10px 170px 10px;
      box-sizing: border-box;
    }

    .login-card {
      background: white;
      padding: 40px 30px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }

    h2 {
      margin-bottom: 30px;
      color: #333;
    }

    .form-group {
      margin-bottom: 20px;
      text-align: left;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
    }

    .input-icon {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon .material-icons {
      margin-right: 10px;
      color: #999;
      font-size: 20px;
    }

    input {
      width: 100%;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
      box-sizing: border-box;
      font-size: 14px;
      flex: 1;
    }


    .options {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      font-size: 14px;
    }

    .options .remember {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    button {
      width: 100%;
      padding: 12px;
      background-color: #2c3e50;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s;
      margin-bottom: 10px;
    }

    button:hover {
      background-color: #4c5b6b;
    }


    .forgot {
      display: block;
      text-align: center;
      color: #2c3e50;
      text-decoration: none;
      font-size: 14px;
      margin-top: 5px;
    }

    .forgot:hover {
      text-decoration: underline;
    }


    .error {
      color: red;
      margin-top: 15px;
      font-weight: bold;
      text-align: center;
    }

    @media (max-width: 500px) {
      .login-card {
        padding: 30px 20px;
      }
    }
  `]
})
export class LoginComponent {
  mail = '';
  password = '';
  rememberMe = false;
  error = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.mail, this.password).subscribe(res => {
      if (res.success) {
        this.auth.setLogged();
        if (this.rememberMe && this.auth.rememberMe) {
          this.auth.rememberMe();
        }
        this.router.navigate(['/']);
      } else {
        this.error = true;
      }
    });
  }
}
