package comite.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@Controller
@RequestMapping("/api/rapporteur")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DeliberationFormController {

    @GetMapping("/evaluation-form/{protocolId}")
    public ResponseEntity<String> getDeliberationForm(@PathVariable Long protocolId) {
        String html = generateDeliberationFormHTML(protocolId);
        return ResponseEntity.ok()
            .header("Content-Type", "text/html; charset=UTF-8")
            .body(html);
    }

    private String generateDeliberationFormHTML(Long protocolId) {
        String currentDate = java.time.LocalDate.now().toString();
        String deliberationNumber = java.time.Year.now().getValue() + "-" + 
            String.format("%02d", java.time.LocalDate.now().getMonthValue()) + "-" + protocolId;

        return """
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Délibération - Comité d'Éthique</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .form-container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2c3e50; padding-bottom: 20px; }
        .header h1 { color: #2c3e50; margin-bottom: 10px; font-size: 24px; }
        .field { margin-bottom: 20px; }
        .field label { font-weight: bold; display: block; margin-bottom: 5px; }
        .field input, .field textarea { width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; font-size: 14px; }
        .field textarea { resize: vertical; }
        .checkbox-group { background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 10px 0; }
        .checkbox-item { display: block; margin: 10px 0; cursor: pointer; }
        .checkbox-item input { margin-right: 10px; transform: scale(1.2); }
        .radio-group { background: #fff3cd; padding: 15px; border-radius: 4px; border-left: 4px solid #ffc107; }
        .radio-item { display: block; margin: 10px 0; cursor: pointer; }
        .radio-item input { margin-right: 10px; transform: scale(1.3); }
        .signatures { display: flex; justify-content: space-around; margin-top: 40px; }
        .signature-box { text-align: center; flex: 1; margin: 0 20px; }
        .signature-area { height: 80px; border: 2px dashed #ccc; margin: 20px 0; display: flex; align-items: center; justify-content: center; background: #f8f9fa; border-radius: 4px; color: #6c757d; font-style: italic; }
        .buttons { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
        .btn { padding: 15px 30px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold; }
        .btn-cancel { background: #6c757d; color: white; }
        .btn-submit { background: #28a745; color: white; }
        .btn:disabled { background: #6c757d; cursor: not-allowed; }
    </style>
</head>
<body>
    <div class="form-container">
        <div class="header">
            <h1>DÉLIBÉRATION</h1>
            <p style="margin: 5px 0; font-weight: bold;">BURKINA FASO</p>
            <p style="margin: 5px 0; font-style: italic;">La Patrie ou la Mort, nous Vaincrons</p>
            <div style="margin: 15px 0;">
                <p style="margin: 5px 0; font-size: 14px;">MINISTÈRE DE LA SANTÉ</p>
                <p style="margin: 5px 0; font-size: 14px;">MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR, DE LA RECHERCHE ET DE L'INNOVATION</p>
                <p style="margin: 5px 0; font-weight: bold; color: #2c3e50;">COMITÉ D'ÉTHIQUE POUR LA RECHERCHE EN SANTÉ</p>
            </div>
        </div>

        <form id="deliberationForm">
            <div class="field">
                <label>DÉLIBÉRATION N°:</label>
                <input type="text" name="deliberationNumber" value="%s" required>
            </div>

            <div class="field">
                <label>1. TITRE DE LA RECHERCHE:</label>
                <textarea name="researchTitle" rows="3" placeholder="« Identification, caractérisation et sélection de souches fermentaires pour une lactofermentation maîtrisé du gombo »" required></textarea>
            </div>

            <div class="field">
                <label>2. RÉFÉRENCE DU PROTOCOLE:</label>
                <input type="text" name="protocolReference" placeholder="Version non précisée" required>
            </div>

            <div class="field">
                <label>3. DOCUMENTATION:</label>
                <div style="margin-left: 20px; color: #666;">
                    <p>- Protocole de recherche</p>
                    <p>- Copie du reçu de paiement</p>
                </div>
            </div>

            <div class="field">
                <label>4. RÉFÉRENCE DU DEMANDEUR:</label>
                <input type="text" name="principalInvestigator" placeholder="Investigateur principal: KANWE Mamounata E M Patricia" required>
            </div>

            <div class="field">
                <label>5. SITE DE LA RECHERCHE:</label>
                <input type="text" name="researchSite" value="Burkina Faso" required>
            </div>

            <div class="field">
                <label>6. DATE DE LA DÉLIBÉRATION:</label>
                <input type="date" name="deliberationDate" value="%s" required>
            </div>

            <div class="field">
                <label>7. ÉLÉMENTS EXAMINÉS:</label>
                <div class="checkbox-group">
                    <label class="checkbox-item">
                        <input type="checkbox" name="scientificConception">
                        Conception scientifique et conduite de la recherche
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="participantProtection">
                        Soins et protection des participants à la recherche
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="dataConfidentiality">
                        Protection de la confidentialité des données du participant à la recherche
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="consentProcess">
                        Processus de consentement éclairé
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="researchBudget">
                        Budget de la recherche
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="cvDocuments">
                        CV
                    </label>
                </div>
            </div>

            <div class="field">
                <label>8. OBSERVATIONS:</label>
                <textarea name="observations" rows="3" placeholder="Préciser sur la page de garde l'institution de formation et le diplôme postulé."></textarea>
            </div>

            <div class="field">
                <label>9. MEMBRES AYANT SIÉGÉ:</label>
                <div class="checkbox-group">
                    <label class="checkbox-item">
                        <input type="checkbox" name="member_koueta" value="Pr Fla KOUETA">
                        Pr Fla KOUETA
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="member_nanga" value="Dr Clotaire NANGA">
                        Dr Clotaire NANGA
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="member_drabo" value="Pr Maxime DRABO">
                        Pr Maxime DRABO
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="member_toe" value="Pr Patrice TOE">
                        Pr Patrice TOE
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="member_ouedraogo1" value="M Olivier L. O. OUEDRAOGO">
                        M Olivier L. O. OUEDRAOGO
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="member_ouedraogo2" value="Dr Alphonse OUEDRAOGO">
                        Dr Alphonse OUEDRAOGO
                    </label>
                </div>
            </div>

            <div class="field">
                <label style="color: #856404;">10. AVIS DU COMITÉ:</label>
                <div class="radio-group">
                    <label class="radio-item">
                        <input type="radio" name="committeeOpinion" value="FAVORABLE" required>
                        <span style="color: #28a745; font-weight: bold;">Avis favorable</span>
                    </label>
                    <label class="radio-item">
                        <input type="radio" name="committeeOpinion" value="AJOURNE" required>
                        <span style="color: #ffc107; font-weight: bold;">Ajourné</span>
                    </label>
                    <label class="radio-item">
                        <input type="radio" name="committeeOpinion" value="NON_FAVORABLE" required>
                        <span style="color: #dc3545; font-weight: bold;">Non favorable</span>
                    </label>
                </div>
            </div>

            <div class="field">
                <label>11. RÉSERVES:</label>
                <textarea name="reserves" rows="3" placeholder="Réserves éventuelles"></textarea>
            </div>

            <div class="field">
                <label>12. RECOMMANDATIONS:</label>
                <textarea name="recommendations" rows="4" placeholder="Recommandations du comité"></textarea>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #2c3e50;">
                <p style="margin-bottom: 30px; font-weight: bold; font-size: 16px;">Ouagadougou, le %s</p>
                <div class="signatures">
                    <div class="signature-box">
                        <p style="font-weight: bold;">Le Rapporteur</p>
                        <div class="signature-area">Signature</div>
                        <p style="font-weight: bold;">Dr Clotaire NANGA</p>
                        <p style="font-size: 12px; color: #6c757d;">Chevalier de l'Ordre du Mérite Burkinabè</p>
                    </div>
                    <div class="signature-box">
                        <p style="font-weight: bold;">Le Président</p>
                        <div class="signature-area">Signature</div>
                        <p style="font-weight: bold;">Pr Fla KOUETA</p>
                        <p style="font-size: 12px; color: #6c757d;">Chevalier de l'Ordre du Mérite</p>
                        <p style="font-size: 12px; color: #6c757d;">Chevalier de l'Ordre des Palmes Académiques</p>
                    </div>
                </div>
            </div>

            <div class="buttons">
                <button type="button" class="btn btn-cancel" onclick="window.close()">Annuler</button>
                <button type="submit" class="btn btn-submit">Enregistrer la Délibération</button>
            </div>
        </form>
    </div>

    <script>
        document.getElementById('deliberationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {};
            
            // Récupérer tous les champs
            for (let [key, value] of formData.entries()) {
                if (key.startsWith('member_')) {
                    if (!data.membersPresent) data.membersPresent = [];
                    data.membersPresent.push(value);
                } else {
                    data[key] = value;
                }
            }
            
            // Récupérer les checkboxes
            data.scientificConception = this.querySelector('[name="scientificConception"]').checked;
            data.participantProtection = this.querySelector('[name="participantProtection"]').checked;
            data.dataConfidentiality = this.querySelector('[name="dataConfidentiality"]').checked;
            data.consentProcess = this.querySelector('[name="consentProcess"]').checked;
            data.researchBudget = this.querySelector('[name="researchBudget"]').checked;
            data.cvDocuments = this.querySelector('[name="cvDocuments"]').checked;
            
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enregistrement...';
            
            fetch('/api/rapporteur/protocols/%d/decision', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': localStorage.getItem('userId') || sessionStorage.getItem('userId') || '1',
                    'X-User-Role': localStorage.getItem('userRole') || sessionStorage.getItem('userRole') || 'rapporteur'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('✅ Délibération enregistrée avec succès !\\n\\nNuméro: ' + result.deliberationNumber);
                    if (window.opener) {
                        window.opener.location.reload();
                        window.close();
                    } else {
                        window.location.href = '/dashboard/rapporteur/decisions';
                    }
                } else {
                    alert('❌ Erreur: ' + result.error);
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('❌ Erreur lors de l\'enregistrement');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enregistrer la Délibération';
            });
        });
    </script>
</body>
</html>
        """.formatted(
            deliberationNumber, 
            currentDate, 
            java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            protocolId
        );
    }
}