# Guide de dépannage - Afro Boutique

## Problèmes de connexion au backend

### 1. Erreurs 400 (Bad Request)

**Symptômes :**
- `GET https://back-lomou.onrender.com/api/auth/me 400 (Bad Request)`
- `POST https://back-lomou.onrender.com/api/auth/login 400 (Bad Request)`

**Causes possibles :**
- Token JWT invalide ou expiré
- Données de requête mal formatées
- Problème de configuration CORS

**Solutions :**

#### A. Vérifier les identifiants de test
Utilisez les identifiants de test fournis :
- **Email :** `client@loumo.com`
- **Mot de passe :** `password123`

#### B. Tester la connectivité
1. Allez sur la page de connexion (`/login`)
2. Cliquez sur l'icône ⚙️ (paramètres) en haut à droite
3. Utilisez le composant de test de connectivité
4. Vérifiez que le backend répond correctement

#### C. Nettoyer le cache local
```javascript
// Dans la console du navigateur
localStorage.clear();
sessionStorage.clear();
```

#### D. Vérifier les headers CORS
Le backend autorise les origines suivantes :
- `https://loumo-frontend.vercel.app`
- `http://localhost:5173`
- `http://localhost:3000`
- `http://localhost:8080`

### 2. Erreurs WebSocket

**Symptômes :**
- `WebSocket connection to 'wss://back-lomou.onrender.com/ws' failed`
- `❌ Nombre maximum de tentatives de reconnexion atteint`

**Solutions :**
- Les erreurs WebSocket n'empêchent pas le fonctionnement de l'application
- Le service WebSocket a été configuré pour gérer gracieusement les échecs
- Vérifiez votre connexion internet

### 3. Erreurs de cache produits

**Symptômes :**
- `Cannot read properties of undefined (reading 'name')`
- Erreurs lors de la sauvegarde du cache

**Solutions :**
- Le service de cache a été amélioré pour gérer les données invalides
- Les produits avec des catégories manquantes sont automatiquement filtrés
- Videz le cache si nécessaire : `localStorage.removeItem('loumo_products_cache')`

## Test de connectivité

### Utilisation du composant de test

1. **Accéder au mode debug :**
   - Allez sur `/login`
   - Cliquez sur l'icône ⚙️ en haut à droite

2. **Tester la connectivité :**
   - Cliquez sur "Tester la connexion"
   - Vérifiez les résultats :
     - ✅ Backend : Connecté
     - ✅ Authentification : OK
     - Utilisateurs : Informations sur les utilisateurs de test

3. **Tester la connexion :**
   - Utilisez les identifiants de test
   - Cliquez sur "Tester la connexion"

### Identifiants de test disponibles

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | `admin@loumo.com` | `password123` |
| Client | `client@loumo.com` | `password123` |
| Client | `marie.martin@example.com` | `password123` |
| Admin | `manager@loumo.com` | `password123` |

## Dépannage avancé

### 1. Vérifier les logs du navigateur

Ouvrez les outils de développement (F12) et vérifiez :
- **Console :** Messages d'erreur détaillés
- **Réseau :** Requêtes HTTP et leurs réponses
- **Application :** Stockage local et session

### 2. Tester les endpoints directement

```bash
# Test de connectivité
curl -X GET https://back-lomou.onrender.com/api/auth/test

# Test des utilisateurs
curl -X GET https://back-lomou.onrender.com/api/auth/test-users

# Test de connexion
curl -X POST https://back-lomou.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@loumo.com","password":"password123"}'
```

### 3. Problèmes de CORS

Si vous obtenez des erreurs CORS :
1. Vérifiez que vous utilisez une origine autorisée
2. Assurez-vous que le backend est accessible
3. Vérifiez la configuration CORS du backend

### 4. Problèmes de token JWT

Si les tokens JWT sont invalides :
1. Déconnectez-vous et reconnectez-vous
2. Videz le stockage local
3. Vérifiez que l'heure du système est correcte

## Support

Si les problèmes persistent :
1. Vérifiez que le backend est en ligne
2. Testez avec les identifiants de test fournis
3. Utilisez le composant de test de connectivité
4. Consultez les logs du navigateur pour plus de détails

## Corrections récentes

### Services améliorés :
- ✅ `AuthService` : Meilleure gestion des erreurs 400
- ✅ `WebSocketService` : Gestion gracieuse des échecs de connexion
- ✅ `ProductCacheService` : Validation des données avant sauvegarde
- ✅ `ErrorBoundary` : Capture des erreurs React
- ✅ `PaymentService` : Service de paiement créé

### Configuration améliorée :
- ✅ Timeouts sur les requêtes fetch
- ✅ Gestion des erreurs réseau
- ✅ Validation des données
- ✅ Composant de test de connectivité 