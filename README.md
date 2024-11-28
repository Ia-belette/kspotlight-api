# kspotlight-api

Cette API propose une liste simple et organisée de films soigneusement sélectionnés et de séries "clean", sans scènes gênantes ou inappropriées. Idéale pour ceux qui recherchent du contenu adapté à tous, elle permet de naviguer facilement par catégories, de découvrir des recommandations, et d'explorer des contenus similaires.

### Documentation des Routes API

### Table des matières

- [Base URL](#base-url)
- [Routes](#routes)
  - [Récupérer toutes les catégories](#récupérer-toutes-les-catégories)
  - [Récupérer les contenus d'une catégorie](#récupérer-les-contenus-dune-catégorie)
  - [Récupérer tous les contenus](#récupérer-tous-les-contenus)
  - [Récupérer un contenu et ses contenus similaires](#récupérer-un-contenu-et-ses-contenus-similaires)
  - [Récupérer les contenus recommandés](#récupérer-les-contenus-recommandés)
- [Authentification](#authentification)
- [Codes d'erreur communs](#codes-derreur-communs)

---

## Base URL

```
https://api.kspotlight.fr
```

---

## Routes

### Récupérer toutes les catégories

- **Méthode :** `GET`
- **Endpoint :** `/`
- **Paramètres :**
  - `pageSize` (int, optionnel) : Nombre d'éléments par page (1-100, défaut : 20).
  - `after` (string, optionnel) : Curseur pour la pagination.
- **Exemple :**
  ```http
  GET /?pageSize=10&after=cursor123
  Authorization: your-api-key
  ```
- **Réponses :**
  - **200 OK** : Liste paginée des catégories.
  - **400 Bad Request** : Paramètre `pageSize` invalide.
  - **500 Internal Server Error** : Problème serveur.

---

### Récupérer les contenus d'une catégorie

- **Méthode :** `GET`
- **Endpoint :** `/:categoryId`
- **Paramètres :**
  - `categoryId` (string, requis) : ID de la catégorie.
  - `pageSize` (int, optionnel) : Nombre d'éléments par page (1-100, défaut : 20).
  - `after` (string, optionnel) : Curseur pour la pagination.
- **Exemple :**
  ```http
  GET /123?pageSize=10&after=cursor123
  Authorization: your-api-key
  ```
- **Réponses :**
  - **200 OK** : Liste paginée des contenus.
  - **400 Bad Request** : Paramètre `categoryId` ou `pageSize` invalide.
  - **500 Internal Server Error** : Problème serveur.

---

### Récupérer tous les contenus

- **Méthode :** `GET`
- **Endpoint :** `/`
- **Paramètres :**
  - `pageSize` (int, optionnel) : Nombre d'éléments par page (1-100, défaut : 20).
  - `after` (string, optionnel) : Curseur pour la pagination.
- **Exemple :**
  ```http
  GET /?pageSize=10&after=cursor123
  Authorization: your-api-key
  ```
- **Réponses :**
  - **200 OK** : Liste paginée des contenus.
  - **400 Bad Request** : Paramètre `pageSize` invalide.
  - **500 Internal Server Error** : Problème serveur.

---

### Récupérer un contenu et ses contenus similaires

- **Méthode :** `GET`
- **Endpoint :** `/:tmdbId`
- **Paramètres :**
  - `tmdbId` (string, requis) : ID du contenu.
- **Exemple :**
  ```http
  GET /12345
  Authorization: your-api-key
  ```
- **Réponses :**
  - **200 OK** : Contenu et ses contenus similaires.
  - **400 Bad Request** : Paramètre `tmdbId` manquant ou invalide.
  - **404 Not Found** : Contenu non trouvé.
  - **500 Internal Server Error** : Problème serveur.

---

### Récupérer les contenus recommandés

- **Méthode :** `GET`
- **Endpoint :** `/recommended`
- **Paramètres :**
  - `pageSize` (int, optionnel) : Nombre d'éléments par page (1-100, défaut : 20).
  - `after` (string, optionnel) : Curseur pour la pagination.
- **Exemple :**
  ```http
  GET /recommended?pageSize=10&after=cursor123
  Authorization: your-api-key
  ```
- **Réponses :**
  - **200 OK** : Liste des contenus recommandés.
  - **400 Bad Request** : Paramètre `pageSize` invalide.
  - **500 Internal Server Error** : Problème serveur.

---

## Authentification

- Clé API requise pour toutes les routes.
- Inclure dans l'en-tête `Authorization`.
- **Exemple :**
  ```http
  Authorization: your-api-key
  ```

---

## Codes d'erreur communs

- **400 Bad Request** : Paramètres manquants ou invalides.
- **404 Not Found** : Ressource non trouvée.
- **500 Internal Server Error** : Problème interne du serveur.
