# ChatApp

Ukázková chatovací aplikace postavená na **React** frontendu a **.NET 9 Web API**.
Pro komunikaci v reálném čase je využita technologie **SignalR**.

---

## Požadavky pro spuštění projektu

### 1. Konfigurace prostředí

Pro správné fungování API je nutné vytvořit ve složce **`Chat.Backend`** soubor **`.env`**, který bude obsahovat následující proměnné:

```
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
PGADMIN_DEFAULT_EMAIL=
PGADMIN_DEFAULT_PASSWORD=
JWT_AUDIENCE=
JWT_ISSUER=
JWT_SECRET_KEY=
FILE_STORAGE_PATH=
```

---

### 2. Spuštění kontejnerů

Aplikaci lze spustit pomocí příkazu:

```bash
docker compose up
```

Při prvním spuštění se automaticky vytvoří databáze a kontejnery.
K databázi je možné se připojit prostřednictvím **pgAdmin** s přihlašovacími údaji z `.env` souboru.

---

### 3. Vytvoření a aplikace migrací

Pro inicializaci databázového schématu je nutné vytvořit migraci.
V projektu **`Chat.Backend/Chat.API`** musí být v souboru `appsettings.json` nastaven connection string s adresou `localhost`.

#### Vytvoření migrace

```bash
dotnet ef migrations add ProfilePictures --project Chat.Infrastructure --startup-project Chat.API
```

Tímto příkazem se v infrastrukturní vrstvě vytvoří složka **Migrations** obsahující SQL skripty.

#### Aplikace migrací do databáze

```bash
dotnet ef database update --project Chat.Infrastructure --startup-project Chat.API
```

---

### 4. Úprava connection stringu pro Docker

Po úspěšném vytvoření databáze je nutné upravit connection string tak,
aby místo `localhost` používal adresu **`chatapp-db`**, což je název databázového kontejneru v rámci Docker sítě.

---

### 5. Další kroky

Projekt lze znovu sestavit a spustit pomocí:

```bash
docker compose up --build
```

Alternativně je možné kontejnery odstranit a projekt spustit přímo z IDE.
Data zůstanou zachována, protože jsou uložena v Docker volume.

---

## Technologie

* Frontend: React
* Backend: .NET 9 Web API
* Realtime komunikace: SignalR
* Databáze: PostgreSQL
* Správa databáze: pgAdmin
* Kontejnerizace: Docker
