// Nouveau formulaire de délibération basé sur le document officiel
// À intégrer dans l'interface rapporteur

function showDeliberationForm(protocolId, protocolData) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); display: flex; justify-content: center;
        align-items: center; z-index: 1000; overflow-y: auto;
    `;
    
    const form = document.createElement('div');
    form.style.cssText = `
        background: white; padding: 30px; border-radius: 8px;
        max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto;
        margin: 20px;
    `;
    
    // Générer automatiquement le numéro de délibération
    const currentDate = new Date();
    const deliberationNumber = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${protocolId}`;
    
    form.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #2c3e50; margin-bottom: 10px;">DÉLIBÉRATION</h2>
            <p style="margin: 5px 0;"><strong>BURKINA FASO</strong></p>
            <p style="margin: 5px 0;">La Patrie ou la Mort, nous Vaincrons</p>
            <hr style="margin: 20px 0;">
            <p style="margin: 5px 0;">MINISTÈRE DE LA SANTÉ</p>
            <p style="margin: 5px 0;">MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR, DE LA RECHERCHE ET DE L'INNOVATION</p>
            <p style="margin: 5px 0; font-weight: bold;">COMITÉ D'ÉTHIQUE POUR LA RECHERCHE EN SANTÉ</p>
        </div>

        <form id="deliberationForm">
            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold;">DÉLIBÉRATION N°:</label>
                <input type="text" name="deliberationNumber" value="${deliberationNumber}" 
                       style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;" required>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold;">1. TITRE DE LA RECHERCHE:</label>
                <textarea name="researchTitle" rows="3" 
                          style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;" 
                          placeholder="Titre complet de la recherche" required>${protocolData?.title || ''}</textarea>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold;">2. RÉFÉRENCE DU PROTOCOLE:</label>
                <input type="text" name="protocolReference" 
                       style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;" 
                       placeholder="Version du protocole" required>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold;">3. DOCUMENTATION:</label>
                <p style="margin: 10px 0; font-size: 14px;">- Protocole de recherche</p>
                <p style="margin: 10px 0; font-size: 14px;">- Copie du reçu de paiement</p>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold;">4. RÉFÉRENCE DU DEMANDEUR:</label>
                <input type="text" name="principalInvestigator" 
                       style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;" 
                       placeholder="Investigateur principal" value="${protocolData?.principalInvestigator || ''}" required>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold;">5. SITE DE LA RECHERCHE:</label>
                <input type="text" name="researchSite" 
                       style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;" 
                       placeholder="Lieu de la recherche" value="${protocolData?.institution || ''}" required>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold;">6. DATE DE LA DÉLIBÉRATION:</label>
                <input type="date" name="deliberationDate" 
                       style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;" 
                       value="${currentDate.toISOString().split('T')[0]}" required>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold;">7. ÉLÉMENTS EXAMINÉS:</label>
                <div style="margin-top: 10px;">
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" name="scientificConception" style="margin-right: 8px;">
                        Conception scientifique et conduite de la recherche
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" name="participantProtection" style="margin-right: 8px;">
                        Soins et protection des participants à la recherche
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" name="dataConfidentiality" style="margin-right: 8px;">
                        Protection de la confidentialité des données du participant à la recherche
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" name="consentProcess" style="margin-right: 8px;">
                        Processus de consentement éclairé
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" name="researchBudget" style="margin-right: 8px;">
                        Budget de la recherche
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" name="cvDocuments" style="margin-right: 8px;">
                        CV
                    </label>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold;">8. OBSERVATIONS:</label>
                <textarea name="observations" rows="4" 
                          style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;" 
                          placeholder="Préciser sur la page de garde l'institution de formation et le diplôme postulé."></textarea>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold;">9. MEMBRES AYANT SIÉGÉ:</label>
                <div style="margin-top: 10px;">
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" name="member_koueta" value="Pr Fla KOUETA" style="margin-right: 8px;">
                        Pr Fla KOUETA
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" name="member_nanga" value="Dr Clotaire NANGA" style="margin-right: 8px;">
                        Dr Clotaire NANGA
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" name="member_drabo" value="Pr Maxime DRABO" style="margin-right: 8px;">
                        Pr Maxime DRABO
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" name="member_toe" value="Pr Patrice TOE" style="margin-right: 8px;">
                        Pr Patrice TOE
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" name="member_ouedraogo1" value="M Olivier L. O. OUEDRAOGO" style="margin-right: 8px;">
                        M Olivier L. O. OUEDRAOGO
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="checkbox" name="member_ouedraogo2" value="Dr Alphonse OUEDRAOGO" style="margin-right: 8px;">
                        Dr Alphonse OUEDRAOGO
                    </label>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold;">10. AVIS DU COMITÉ:</label>
                <div style="margin-top: 10px;">
                    <label style="display: block; margin: 8px 0;">
                        <input type="radio" name="committeeOpinion" value="FAVORABLE" style="margin-right: 8px;" required>
                        Avis favorable
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="radio" name="committeeOpinion" value="AJOURNE" style="margin-right: 8px;" required>
                        Ajourné
                    </label>
                    <label style="display: block; margin: 8px 0;">
                        <input type="radio" name="committeeOpinion" value="NON_FAVORABLE" style="margin-right: 8px;" required>
                        Non favorable
                    </label>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold;">11. RÉSERVES:</label>
                <textarea name="reserves" rows="3" 
                          style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;" 
                          placeholder="Réserves éventuelles"></textarea>
            </div>

            <div style="margin-bottom: 30px;">
                <label style="font-weight: bold;">12. RECOMMANDATIONS:</label>
                <textarea name="recommendations" rows="4" 
                          style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;" 
                          placeholder="Recommandations du comité"></textarea>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <p style="margin-bottom: 20px;"><strong>Ouagadougou, le ${new Date().toLocaleDateString('fr-FR')}</strong></p>
                <div style="display: flex; justify-content: space-between; margin-top: 40px;">
                    <div style="text-align: center;">
                        <p><strong>Le Rapporteur</strong></p>
                        <div style="height: 80px; border: 1px dashed #ccc; margin: 20px 0; display: flex; align-items: center; justify-content: center;">
                            Signature
                        </div>
                        <p><strong>Dr Clotaire NANGA</strong></p>
                        <p><small>Chevalier de l'Ordre du Mérite Burkinabè</small></p>
                    </div>
                    <div style="text-align: center;">
                        <p><strong>Le Président</strong></p>
                        <div style="height: 80px; border: 1px dashed #ccc; margin: 20px 0; display: flex; align-items: center; justify-content: center;">
                            Signature
                        </div>
                        <p><strong>Pr Fla KOUETA</strong></p>
                        <p><small>Chevalier de l'Ordre du Mérite</small></p>
                        <p><small>Chevalier de l'Ordre des Palmes Académiques</small></p>
                    </div>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <button type="button" onclick="closeDeliberationForm()" 
                        style="padding: 12px 24px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Annuler
                </button>
                <button type="submit" 
                        style="padding: 12px 24px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Enregistrer la Délibération
                </button>
            </div>
        </form>
    `;
    
    modal.appendChild(form);
    document.body.appendChild(modal);
    
    // Gérer la soumission du formulaire
    document.getElementById('deliberationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitDeliberation(protocolId, this);
    });
    
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeDeliberationForm();
    });
}

function submitDeliberation(protocolId, form) {
    const formData = new FormData(form);
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
    
    // Récupérer les checkboxes (éléments examinés)
    data.scientificConception = form.querySelector('[name="scientificConception"]').checked;
    data.participantProtection = form.querySelector('[name="participantProtection"]').checked;
    data.dataConfidentiality = form.querySelector('[name="dataConfidentiality"]').checked;
    data.consentProcess = form.querySelector('[name="consentProcess"]').checked;
    data.researchBudget = form.querySelector('[name="researchBudget"]').checked;
    data.cvDocuments = form.querySelector('[name="cvDocuments"]').checked;
    
    // Envoyer au serveur
    fetch(`http://localhost:8081/api/rapporteur/protocols/${protocolId}/decision`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-User-ID': localStorage.getItem('userId'),
            'X-User-Role': localStorage.getItem('userRole')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Délibération enregistrée avec succès !');
            closeDeliberationForm();
            // Recharger la liste des protocoles
            if (typeof loadProtocols === 'function') {
                loadProtocols();
            }
        } else {
            alert('Erreur : ' + result.error);
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'enregistrement');
    });
}

function closeDeliberationForm() {
    const modal = document.querySelector('div[style*="position: fixed"]');
    if (modal) {
        modal.remove();
    }
}

// Fonction pour remplacer le bouton "Évaluer" existant
function replaceEvaluateButton(protocolId, protocolData) {
    // Trouver le bouton existant et le remplacer
    const existingButton = document.querySelector(`[onclick*="evaluateProtocol(${protocolId})"]`);
    if (existingButton) {
        existingButton.textContent = 'Délibérer';
        existingButton.onclick = () => showDeliberationForm(protocolId, protocolData);
        existingButton.style.background = '#17a2b8';
    }
}