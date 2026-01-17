# Configuration PostgreSQL pour le Backend

## Option 1: Utiliser PostgreSQL sans mot de passe (Développement local)

### Modifier pg_hba.conf pour autoriser les connexions locales sans mot de passe

```bash
# Trouver le fichier pg_hba.conf
sudo find /etc -name pg_hba.conf

# Éditer le fichier (généralement /etc/postgresql/12/main/pg_hba.conf)
sudo nano /etc/postgresql/12/main/pg_hba.conf

# Modifier la ligne pour localhost:
# Remplacer:
# local   all             postgres                                peer
# Par:
# local   all             postgres                                trust

# Et:
# host    all             all             127.0.0.1/32            scram-sha-256
# Par:
# host    all             all             127.0.0.1/32            trust

# Redémarrer PostgreSQL
sudo systemctl restart postgresql
```

### Modifier application.properties

```properties
spring.datasource.password=
```

## Option 2: Définir un mot de passe pour PostgreSQL (Recommandé)

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Définir un mot de passe
ALTER USER postgres WITH PASSWORD 'votre_mot_de_passe';

# Quitter
\q
```

### Modifier application.properties

```properties
spring.datasource.password=votre_mot_de_passe
```

## Option 3: Utiliser des variables d'environnement

```bash
# Définir les variables d'environnement
export DB_USERNAME=postgres
export DB_PASSWORD=votre_mot_de_passe

# Démarrer l'application
cd demo
mvn spring-boot:run
```

## Vérification de la connexion

```bash
# Tester la connexion PostgreSQL
psql -h localhost -U postgres -d comite_ethique -c "SELECT version();"
```

## Configuration actuelle

Le fichier `application.properties` est configuré avec:
- Username: postgres
- Password: postgres (par défaut)

Si vous utilisez un mot de passe différent, modifiez le fichier ou utilisez des variables d'environnement.