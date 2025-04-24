# API d'Adresses et Risques - Test Technique Klaire

Cette API permet d'enregistrer des adresses et de consulter les risques associés à ces adresses via l'API Géorisques.

## Technologies utilisées

- NestJS (TypeScript)
- TypeORM avec SQLite
- Docker et Docker Compose

## Prérequis

- Docker et Docker Compose installés sur votre machine

## Installation et démarrage

1. **Cloner le dépôt**

```bash
git clone [URL_DU_DEPOT]
cd .\Klaire-test-technique\  
```

2. **Configuration des variables d'environnement**

Copiez le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
```

3. **Lancement avec Docker Compose**

```bash
docker compose up -d --build
```

L'application sera accessible à l'adresse : http://localhost:{PORT}/api

## API Endpoints

### 1. Enregistrer une adresse

**Endpoint** : `POST /api/addresses/`

**Payload** :
```json
{
  "q": "chaîne de recherche d'adresse"
}
```

**Réponse en cas de succès (200 OK)** :
```json
{
  "id": 1,
  "label": "8 bd du Port, 56170 Sarzeau",
  "housenumber": "8",
  "street": "bd du Port",
  "postcode": "56170",
  "citycode": "56242",
  "latitude": 47.58234,
  "longitude": -2.73745
}
```

**Réponse en cas d'erreur (400 Bad Request)** :
```json
{
  "error": "Le champ 'q' est requis et doit être une chaîne non vide."
}
```

**Réponse en cas d'adresse non trouvée (404 Not Found)** :
```json
{
  "error": "Adresse non trouvée. Aucun résultat ne correspond à votre recherche."
}
```

**Réponse en cas d'erreur serveur (500 Internal Server Error)** :
```json
{
  "error": "Erreur serveur : impossible de contacter l'API externe."
}
```

### 2. Consulter les risques d'une adresse

**Endpoint** : `GET /api/addresses/{id}/risks/`

**Paramètre** :
- `id` : Identifiant de l'adresse en base de données

**Réponse en cas de succès (200 OK)** :
```json
{
  // JSON complet de l'API Géorisques
}
```

**Réponse en cas d'adresse non trouvée (404 Not Found)** :
```json
{
  "error": "Adresse non trouvée."
}
```

**Réponse en cas d'erreur serveur (500 Internal Server Error)** :
```json
{
  "error": "Erreur serveur : échec de la récupération des données de Géorisques."
}
```

## Fonctionnalité de cache des risques

Pour optimiser les performances et réduire la charge sur l'API Géorisques, l'application implémente un système de cache :

- Lors de la première requête pour les risques d'une adresse, l'API contacte Géorisques et stocke les résultats en base de données
- Les requêtes suivantes pour la même adresse récupèrent les données depuis le cache sans contacter l'API externe
- Le cache a une durée de validité configurable (par défaut 30 jours)
- Une fois le cache expiré, une nouvelle requête à l'API Géorisques est effectuée

Cette approche permet de :
- Réduire le temps de réponse pour les adresses déjà consultées
- Limiter les appels à l'API externe et respecter d'éventuelles limites de rate-limiting
- Assurer la disponibilité des données même en cas d'indisponibilité temporaire de l'API Géorisques

### Implémentation technique

Le cache des risques a été implémenté en utilisant une entité dédiée `AddressRisk` liée à l'entité `Address` :

1. Une entité `AddressRisk` stocke :
   - Une référence à l'adresse concernée
   - Les données de risque sérialisées en JSON 
   - Une date d'expiration configurable via la variable d'environnement `RISK_CACHE_DURATION_DAYS`

2. Le processus fonctionne comme suit :
   - Vérification de l'existence d'une entrée de cache valide pour l'adresse demandée
   - Si le cache est valide, retour immédiat des données sans appel externe
   - Si le cache est absent ou expiré, appel à l'API Géorisques puis mise en cache du résultat
   - Retour des données au client

3. Cette approche offre plusieurs avantages :
   - Transparence totale pour le client qui reçoit toujours des données à jour
   - Réduction significative des temps de réponse pour les requêtes répétées
   - Diminution de la charge sur l'API externe et respect des limites d'utilisation

## Variables d'environnement

| Variable | Description | Valeur par défaut |
| --- | --- | --- |
| `TYPEORM_CONNECTION` | Type de connexion à la base de données | `sqlite` |
| `TYPEORM_DATABASE` | Chemin vers le fichier SQLite | `/data/db.sqlite` |
| `PORT` | Port sur lequel l'API est exposée | `8000` |
| `API_TIMEOUT` | Timeout pour les appels aux API externes (en ms) | `5000` |
| `RISK_CACHE_DURATION_DAYS` | Durée de validité du cache des risques (en jours) | `30` |

## Structure du projet

```
klaire-address-risk-api/
├── src/
│   ├── main.ts                  # Point d'entrée de l'application
│   ├── app.module.ts            # Module principal
│   ├── addresses/               # Module des adresses
│   │   ├── addresses.module.ts
│   │   ├── addresses.controller.ts
│   │   ├── addresses.service.ts
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── entities/            # Entités TypeORM
│   │   └── interfaces/          # Interfaces TypeScript
│   └── risks/                   # Module des risques
│       ├── risks.module.ts
│       ├── risks.service.ts
│       └── entities/            # Entités pour le cache des risques
├── test/                        # Tests unitaires et e2e
├── Dockerfile                   # Configuration Docker
├── docker-compose.yml           # Configuration Docker Compose
└── README.md                    # Documentation
```

## Tests

Pour exécuter les tests unitaires :

```bash
# Dans le conteneur Docker
docker exec -it [container_id] npm run test

# En local après installation des dépendances
npm run test
```

## Développement

Pour développer localement sans Docker :

```bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run start:dev
```

## Sécurité

L'API implémente plusieurs mesures de sécurité :
- Timeouts pour les appels API externes
- Validation des entrées avec class-validator
- Gestion des erreurs pour éviter les fuites d'informations
- Mise en cache pour limiter la dépendance aux services externes