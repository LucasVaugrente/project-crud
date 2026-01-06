# Application Vélo - Frontend

## Installation

You have to have Angular installed with theses commands

```bash
npm install -g @angular/cli
```

Run this command to install all dependencies.

```bash
npm install
```

## Launch Web Server

Run this command for a dev server.
```bash
ng serve --proxy-config proxy.conf.json
```

Navigate to `http://localhost:4200/`.

### ⚠️ You have to create a user before using the application.

```bash
curl -X POST -H "Content-Type: application/json" -d '{"nom":"Dupont","prenom":"Jean","mail":"dupont@example.com","username":"dupontj","password":"monSuperMDP"}' http://localhost:8080/api/utilisateurs
```

When you arrive in the application to log in, you can log in using:
- `dupont@example.com` as email
- `monSuperMDP` as password.

# 🙎‍♂️ Contributors
* [Lucas Vaugrente](https://github.com/LucasVaugrente "Compte GitHub")
* [Salma Mansouri](https://github.com/Salma-msr "Compte GitHub")
* [Imane Abdou](https://github.com/VimaneAb "Compte GitHub")
