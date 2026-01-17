#!/bin/bash

echo "=== Configuration du Backend Comité d'Éthique ==="

# Vérification de PostgreSQL
echo "1. Vérification de PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL est installé"
    
    # Test de connexion
    if psql -h localhost -U postgres -d postgres -c "SELECT version();" &> /dev/null; then
        echo "✅ Connexion PostgreSQL réussie"
    else
        echo "❌ Impossible de se connecter à PostgreSQL"
        echo "Vérifiez que PostgreSQL est démarré et que les identifiants sont corrects"
    fi
else
    echo "❌ PostgreSQL n'est pas installé"
    echo "Installation requise: sudo apt install postgresql postgresql-contrib"
fi

# Vérification de Java
echo "2. Vérification de Java..."
if command -v java &> /dev/null; then
    java_version=$(java -version 2>&1 | head -n 1)
    echo "✅ Java installé: $java_version"
else
    echo "❌ Java n'est pas installé"
fi

# Vérification de Maven
echo "3. Vérification de Maven..."
if command -v mvn &> /dev/null; then
    mvn_version=$(mvn -version | head -n 1)
    echo "✅ Maven installé: $mvn_version"
else
    echo "❌ Maven n'est pas installé"
fi

# Configuration de la base de données
echo "4. Configuration de la base de données..."
echo "Exécution du script SQL..."

# Exécution du script SQL
if psql -h localhost -U postgres -f database_setup.sql; then
    echo "✅ Base de données configurée avec succès"
else
    echo "❌ Erreur lors de la configuration de la base de données"
fi

# Compilation et démarrage du backend
echo "5. Compilation du backend..."
cd demo

if mvn clean compile; then
    echo "✅ Compilation réussie"
    
    echo "6. Démarrage du backend..."
    echo "Le backend va démarrer sur le port 8081..."
    echo "Endpoints disponibles:"
    echo "  - GET  /api/researcher/test"
    echo "  - GET  /api/researcher/protocols/{id}"
    echo "  - PUT  /api/researcher/protocols/{id}/update"
    echo "  - GET  /api/secretary/protocols"
    echo ""
    
    mvn spring-boot:run
else
    echo "❌ Erreur lors de la compilation"
fi