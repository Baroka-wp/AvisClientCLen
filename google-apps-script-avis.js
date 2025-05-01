// Script Google Apps Script pour la gestion des avis
// Version améliorée avec gestion des erreurs et débogage

function doPost(e) {
    try {
        // Journalisation des données reçues pour débogage
        Logger.log("Données reçues:");
        Logger.log(JSON.stringify(e.parameter));

        // ID de votre Google Sheet
        const sheetID = '1ECbuOL5t6_p9fyyKGBitgWdDHrmbgurpfa7V3PTy4vQ';

        try {
            // Vérifier si on peut ouvrir le fichier
            const ss = SpreadsheetApp.openById(sheetID);
            Logger.log("Accès au fichier réussi: " + ss.getName());

            // Vérifier si la feuille "Avis" existe
            let sheet;
            try {
                sheet = ss.getSheetByName('Avis');
                if (!sheet) {
                    // Si la feuille n'existe pas, la créer
                    Logger.log("Feuille 'Avis' non trouvée, création en cours...");
                    sheet = ss.insertSheet('Avis');

                    // Ajouter les en-têtes
                    sheet.appendRow([
                        "Date",
                        "Ambiance",
                        "Nourriture",
                        "Service",
                        "Commentaire",
                        "Statut"
                    ]);
                    Logger.log("Feuille 'Avis' créée avec succès");
                } else {
                    Logger.log("Feuille 'Avis' trouvée");
                }
            } catch (sheetError) {
                Logger.log("Erreur lors de l'accès à la feuille: " + sheetError.toString());
                throw sheetError;
            }

            // Récupérer les données du formulaire
            const data = e.parameter;
            Logger.log("Données formatées pour insertion:");

            // Formater les données pour l'insertion
            const rowData = [
                data.dateInscription || new Date().toLocaleString('fr-FR'),
                data.ambiance || '',
                data.nourriture || '',
                data.service || '',
                data.commentaire || '',
                'Reçu' // Statut par défaut
            ];

            Logger.log(rowData);

            // Ajouter les données à la feuille Google Sheet
            sheet.appendRow(rowData);
            const lastRow = sheet.getLastRow();
            Logger.log("Données ajoutées à la feuille avec succès dans la ligne " + lastRow);

            // Répondre avec un succès
            return ContentService
                .createTextOutput(JSON.stringify({
                    'result': 'success',
                    'message': 'Avis enregistré avec succès',
                    'data': rowData
                }))
                .setMimeType(ContentService.MimeType.JSON);

        } catch (accessError) {
            Logger.log("Erreur d'accès au Google Sheet: " + accessError.toString());
            throw new Error("Problème d'accès au Google Sheet. Vérifiez les autorisations: " + accessError.toString());
        }

    } catch (error) {
        Logger.log("Erreur globale: " + error.toString());

        // En cas d'erreur, répondre avec un message d'erreur
        return ContentService
            .createTextOutput(JSON.stringify({
                'result': 'error',
                'error': error.toString(),
                'logs': Logger.getLog()
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Cette fonction est obligatoire pour activer CORS
function doGet(e) {
    return ContentService
        .createTextOutput(JSON.stringify({
            'result': 'success',
            'message': 'API opérationnelle',
            'version': '1.0'
        }))
        .setMimeType(ContentService.MimeType.JSON);
} 