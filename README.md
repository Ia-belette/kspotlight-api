# kspotlight-api

Cette API propose une liste simple et organisée de films soigneusement sélectionnés et de séries "clean", sans scènes gênantes ou inappropriées. Idéale pour ceux qui recherchent du contenu adapté à tous, elle permet de naviguer facilement par catégories, de découvrir des recommandations, et d'explorer des contenus similaires.

### Documentation

[Consultez la documentation complète de l'API](https://api.kspotlight.fr)

### À faire

* [ ] Mettre en place un cache Redis :
    * [ ] `GET /v1/content` : Ajouter un cache pour la liste des contenus.
    * [ ] `GET /v1/content/{tmdbId}` : Mettre en cache les détails d’un contenu spécifique.
    * [ ] `GET /v1/content/recommended` : Ajouter un cache court pour les contenus recommandés.
    * [ ] `GET /v1/category` : Mettre en cache la liste des catégories.
    * [ ] `GET /v1/category/{categoryId}` : Ajouter un cache pour les détails des catégories.
* [ ] Optimiser les réponses API :
    * Retourner uniquement les éléments nécessaires dans les réponses.
* [ ] Améliorer la documentation Swagger :
    * Ajouter des exemples détaillés et pertinents pour les réponses des API.