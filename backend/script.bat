@echo off

:: Création des dossiers
mkdir backend\src\config
mkdir backend\src\controllers
mkdir backend\src\models
mkdir backend\src\routes
mkdir backend\src\middlewares
mkdir backend\src\services

:: Création des fichiers de configuration
echo. > backend\src\config\db.js

:: Création des contrôleurs
echo. > backend\src\controllers\utilisateurController.js
echo. > backend\src\controllers\classeController.js
echo. > backend\src\controllers\sujetController.js
echo. > backend\src\controllers\copieController.js
echo. > backend\src\controllers\correctionController.js
echo. > backend\src\controllers\plagiatController.js

:: Création des modèles
echo. > backend\src\models\utilisateurModel.js
echo. > backend\src\models\classeModel.js
echo. > backend\src\models\sujetModel.js
echo. > backend\src\models\copieModel.js
echo. > backend\src\models\correctionModel.js
echo. > backend\src\models\plagiatModel.js

:: Création des routes
echo. > backend\src\routes\utilisateurRoutes.js
echo. > backend\src\routes\classeRoutes.js
echo. > backend\src\routes\sujetRoutes.js
echo. > backend\src\routes\copieRoutes.js
echo. > backend\src\routes\correctionRoutes.js
echo. > backend\src\routes\plagiatRoutes.js

:: Création des middlewares
echo. > backend\src\middlewares\authMiddleware.js

:: Création des services
echo. > backend\src\services\utilisateurService.js
echo. > backend\src\services\notificationService.js

:: Création du point d'entrée du serveur
echo. > backend\src\server.js

:: Message de confirmation
echo Arborescence du projet backend créée avec succès !