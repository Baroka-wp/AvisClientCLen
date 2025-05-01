function doPost(e) {
  try {
    // Récupérer les données envoyées
    const data = JSON.parse(e.postData.contents);
    
    // Obtenir la feuille active
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Préparer la ligne à ajouter
    const row = [
      new Date(), // Date actuelle
      data.ambiance,
      data.nourriture,
      data.service,
      data.commentaire || ''
    ];
    
    // Ajouter la ligne dans la feuille
    sheet.appendRow(row);
    
    // Retourner une réponse de succès
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Avis enregistré avec succès"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // En cas d'erreur, retourner une réponse d'erreur
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: "Le service est actif"
  })).setMimeType(ContentService.MimeType.JSON);
} 
