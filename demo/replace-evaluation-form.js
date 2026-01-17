// Script pour remplacer le formulaire d'évaluation existant par le nouveau formulaire de délibération
// À intégrer dans l'interface rapporteur existante

// Fonction pour remplacer le formulaire d'évaluation existant
function replaceEvaluationForm() {
    // Supprimer l'ancien formulaire s'il existe
    const oldModal = document.querySelector('.evaluation-modal, .modal, [class*="modal"]');
    if (oldModal) {
        oldModal.remove();
    }
}

// Nouveau formulaire de délibération basé sur le document officiel
function showDeliberationForm(protocolId, protocolData = {}) {
    // Supprimer l'ancien formulaire
    replaceEvaluationForm();
    
    const modal = document.createElement('div');
    modal.className = 'deliberation-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); display: flex; justify-content: center;
        align-items: center; z-index: 1000; overflow-y: auto;
    `;
    
    const form = document.createElement('div');
    form.style.cssText = `
        background: white; padding: 30px; border-radius: 8px;
        max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto;
        margin: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    const currentDate = new Date();
    const deliberationNumber = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${protocolId}`;
    
    form.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2c3e50; padding-bottom: 20px;">
            <h2 style="color: #2c3e50; margin-bottom: 10px; font-size: 24px;">DÉLIBÉRATION</h2>
            <p style="margin: 5px 0; font-weight: bold;">BURKINA FASO</p>
            <p style="margin: 5px 0; font-style: italic;">La Patrie ou la Mort, nous Vaincrons</p>
            <div style="margin: 15px 0;">
                <p style="margin: 5px 0; font-size: 14px;">MINISTÈRE DE LA SANTÉ</p>
                <p style="margin: 5px 0; font-size: 14px;">MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR, DE LA RECHERCHE ET DE L'INNOVATION</p>
                <p style="margin: 5px 0; font-weight: bold; color: #2c3e50;">COMITÉ D'ÉTHIQUE POUR LA RECHERCHE EN SANTÉ</p>
            </div>
        </div>

        <form id="deliberationForm" style="font-family: Arial, sans-serif;">
            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; display: block; margin-bottom: 5px;">DÉLIBÉRATION N°:</label>
                <input type="text" name="deliberationNumber" value="${deliberationNumber}" 
                       style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; font-size: 14px;" required>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; display: block; margin-bottom: 5px;">1. TITRE DE LA RECHERCHE:</label>
                <textarea name="researchTitle" rows="3" 
                          style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; font-size: 14px; resize: vertical;" 
                          placeholder="« Identification, caractérisation et sélection de souches fermentaires pour une lactofermentation maîtrisé du gombo »" required>${protocolData.title || ''}</textarea>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; display: block; margin-bottom: 5px;">2. RÉFÉRENCE DU PROTOCOLE:</label>
                <input type="text" name="protocolReference" 
                       style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; font-size: 14px;" 
                       placeholder="Version non précisée" required>
            </div>

            <div style="margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 4px;">
                <label style="font-weight: bold; display: block; margin-bottom: 10px;">3. DOCUMENTATION:</label>
                <div style="margin-left: 20px;">
                    <p style="margin: 5px 0; font-size: 14px;">- Protocole de recherche</p>
                    <p style="margin: 5px 0; font-size: 14px;">- Copie du reçu de paiement</p>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; display: block; margin-bottom: 5px;">4. RÉFÉRENCE DU DEMANDEUR:</label>
                <input type="text" name="principalInvestigator" 
                       style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; font-size: 14px;" 
                       placeholder="Investigateur principal: KANWE Mamounata E M Patricia" 
                       value="${protocolData.principalInvestigator || ''}" required>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; display: block; margin-bottom: 5px;">5. SITE DE LA RECHERCHE:</label>
                <input type="text" name="researchSite" 
                       style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; font-size: 14px;" 
                       placeholder="Burkina Faso" value="${protocolData.institution || 'Burkina Faso'}" required>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; display: block; margin-bottom: 5px;">6. DATE DE LA DÉLIBÉRATION:</label>
                <input type="date" name="deliberationDate" 
                       style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; font-size: 14px;" 
                       value="${currentDate.toISOString().split('T')[0]}" required>
            </div>

            <div style="margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 4px;">
                <label style="font-weight: bold; display: block; margin-bottom: 10px;">7. ÉLÉMENTS EXAMINÉS:</label>
                <div style="margin-left: 10px;">
                    <label style="display: block; margin: 10px 0; cursor: pointer;">
                        <input type="checkbox" name="scientificConception" style="margin-right: 10px; transform: scale(1.2);">
                        <span style="font-size: 14px;">Conception scientifique et conduite de la recherche</span>
                    </label>
                    <label style="display: block; margin: 10px 0; cursor: pointer;">
                        <input type="checkbox" name="participantProtection" style="margin-right: 10px; transform: scale(1.2);">
                        <span style="font-size: 14px;">Soins et protection des participants à la recherche</span>
                    </label>
                    <label style="display: block; margin: 10px 0; cursor: pointer;">
                        <input type="checkbox" name="dataConfidentiality" style="margin-right: 10px; transform: scale(1.2);">
                        <span style="font-size: 14px;">Protection de la confidentialité des données du participant à la recherche</span>
                    </label>
                    <label style="display: block; margin: 10px 0; cursor: pointer;">
                        <input type="checkbox" name="consentProcess" style="margin-right: 10px; transform: scale(1.2);">
                        <span style="font-size: 14px;">Processus de consentement éclairé</span>
                    </label>
                    <label style="display: block; margin: 10px 0; cursor: pointer;">
                        <input type="checkbox" name="researchBudget" style="margin-right: 10px; transform: scale(1.2);">
                        <span style="font-size: 14px;">Budget de la recherche</span>
                    </label>
                    <label style="display: block; margin: 10px 0; cursor: pointer;">
                        <input type="checkbox" name="cvDocuments" style="margin-right: 10px; transform: scale(1.2);">
                        <span style="font-size: 14px;">CV</span>
                    </label>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; display: block; margin-bottom: 5px;">8. OBSERVATIONS:</label>
                <textarea name="observations" rows="3" 
                          style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; font-size: 14px; resize: vertical;" 
                          placeholder="Préciser sur la page de garde l'institution de formation et le diplôme postulé."></textarea>
            </div>

            <div style="margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 4px;">
                <label style="font-weight: bold; display: block; margin-bottom: 10px;">9. MEMBRES AYANT SIÉGÉ:</label>
                <div style="margin-left: 10px;">
                    <label style="display: block; margin: 8px 0; cursor: pointer;">
                        <input type="checkbox" name="member_koueta" value="Pr Fla KOUETA" style="margin-right: 10px; transform: scale(1.2);">
                        <span style="font-size: 14px;">Pr Fla KOUETA</span>
                    </label>
                    <label style="display: block; margin: 8px 0; cursor: pointer;">
                        <input type="checkbox" name="member_nanga" value="Dr Clotaire NANGA" style="margin-right: 10px; transform: scale(1.2);">
                        <span style="font-size: 14px;">Dr Clotaire NANGA</span>
                    </label>
                    <label style="display: block; margin: 8px 0; cursor: pointer;">
                        <input type="checkbox" name="member_drabo" value="Pr Maxime DRABO" style="margin-right: 10px; transform: scale(1.2);">
                        <span style="font-size: 14px;">Pr Maxime DRABO</span>
                    </label>
                    <label style="display: block; margin: 8px 0; cursor: pointer;">
                        <input type="checkbox" name="member_toe" value="Pr Patrice TOE" style="margin-right: 10px; transform: scale(1.2);">
                        <span style="font-size: 14px;">Pr Patrice TOE</span>
                    </label>
                    <label style="display: block; margin: 8px 0; cursor: pointer;">
                        <input type="checkbox" name="member_ouedraogo1" value="M Olivier L. O. OUEDRAOGO" style="margin-right: 10px; transform: scale(1.2);">
                        <span style="font-size: 14px;">M Olivier L. O. OUEDRAOGO</span>
                    </label>
                    <label style="display: block; margin: 8px 0; cursor: pointer;">
                        <input type="checkbox" name="member_ouedraogo2" value="Dr Alphonse OUEDRAOGO" style="margin-right: 10px; transform: scale(1.2);">
                        <span style="font-size: 14px;">Dr Alphonse OUEDRAOGO</span>
                    </label>
                </div>
            </div>

            <div style="margin-bottom: 20px; background: #fff3cd; padding: 15px; border-radius: 4px; border-left: 4px solid #ffc107;">
                <label style="font-weight: bold; display: block; margin-bottom: 10px; color: #856404;">10. AVIS DU COMITÉ:</label>
                <div style="margin-left: 10px;">
                    <label style="display: block; margin: 10px 0; cursor: pointer;">
                        <input type="radio" name="committeeOpinion" value="FAVORABLE" style="margin-right: 10px; transform: scale(1.3);" required>
                        <span style="font-size: 16px; font-weight: bold; color: #28a745;">Avis favorable</span>
                    </label>
                    <label style="display: block; margin: 10px 0; cursor: pointer;">
                        <input type="radio" name="committeeOpinion" value="AJOURNE" style="margin-right: 10px; transform: scale(1.3);" required>
                        <span style="font-size: 16px; font-weight: bold; color: #ffc107;">Ajourné</span>
                    </label>
                    <label style="display: block; margin: 10px 0; cursor: pointer;">
                        <input type="radio" name="committeeOpinion" value="NON_FAVORABLE" style="margin-right: 10px; transform: scale(1.3);" required>
                        <span style="font-size: 16px; font-weight: bold; color: #dc3545;">Non favorable</span>
                    </label>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="font-weight: bold; display: block; margin-bottom: 5px;">11. RÉSERVES:</label>
                <textarea name="reserves" rows="3" 
                          style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; font-size: 14px; resize: vertical;" 
                          placeholder="Réserves éventuelles"></textarea>
            </div>

            <div style="margin-bottom: 30px;">
                <label style="font-weight: bold; display: block; margin-bottom: 5px;">12. RECOMMANDATIONS:</label>
                <textarea name="recommendations" rows="4" 
                          style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; font-size: 14px; resize: vertical;" 
                          placeholder="Recommandations du comité"></textarea>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #2c3e50;">
                <p style="margin-bottom: 30px; font-weight: bold; font-size: 16px;">Ouagadougou, le ${new Date().toLocaleDateString('fr-FR')}</p>
                <div style="display: flex; justify-content: space-around; margin-top: 40px;">
                    <div style="text-align: center; flex: 1; margin: 0 20px;">
                        <p style="font-weight: bold; margin-bottom: 10px;">Le Rapporteur</p>
                        <div style="height: 80px; border: 2px dashed #ccc; margin: 20px 0; display: flex; align-items: center; justify-content: center; background: #f8f9fa; border-radius: 4px;">
                            <span style="color: #6c757d; font-style: italic;">Signature</span>
                        </div>
                        <p style="font-weight: bold; margin: 5px 0;">Dr Clotaire NANGA</p>
                        <p style="font-size: 12px; color: #6c757d;">Chevalier de l'Ordre du Mérite Burkinabè</p>
                    </div>
                    <div style="text-align: center; flex: 1; margin: 0 20px;">
                        <p style="font-weight: bold; margin-bottom: 10px;">Le Président</p>
                        <div style="height: 80px; border: 2px dashed #ccc; margin: 20px 0; display: flex; align-items: center; justify-content: center; background: #f8f9fa; border-radius: 4px;">
                            <span style="color: #6c757d; font-style: italic;">Signature</span>
                        </div>
                        <p style="font-weight: bold; margin: 5px 0;">Pr Fla KOUETA</p>
                        <p style="font-size: 12px; color: #6c757d;">Chevalier de l'Ordre du Mérite</p>
                        <p style="font-size: 12px; color: #6c757d;">Chevalier de l'Ordre des Palmes Académiques</p>
                    </div>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                <button type="button" onclick="closeDeliberationForm()" 
                        style="padding: 15px 30px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold;">
                    Annuler
                </button>
                <button type="submit" 
                        style="padding: 15px 30px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold;">
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
    
    // Fermer en cliquant à l'extérieur
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeDeliberationForm();
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
    
    // Désactiver le bouton de soumission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enregistrement...';
    submitBtn.style.background = '#6c757d';
    
    // Envoyer au serveur
    fetch(`http://localhost:8081/api/rapporteur/protocols/${protocolId}/decision`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-User-ID': localStorage.getItem('userId') || sessionStorage.getItem('userId'),
            'X-User-Role': localStorage.getItem('userRole') || sessionStorage.getItem('userRole')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('✅ Délibération enregistrée avec succès !\\n\\nNuméro de délibération: ' + result.deliberationNumber);
            closeDeliberationForm();
            // Recharger la liste des protocoles si la fonction existe
            if (typeof loadProtocols === 'function') {
                loadProtocols();
            } else if (typeof refreshProtocolList === 'function') {
                refreshProtocolList();
            } else {
                // Recharger la page si aucune fonction de rafraîchissement n'est disponible
                window.location.reload();
            }
        } else {
            alert('❌ Erreur: ' + result.error);
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('❌ Erreur lors de l\'enregistrement de la délibération');
    })
    .finally(() => {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.background = '#28a745';
    });
}

function closeDeliberationForm() {
    const modal = document.querySelector('.deliberation-modal');
    if (modal) {
        modal.remove();
    }
}

// Fonction pour remplacer tous les boutons "Évaluer" existants
function replaceAllEvaluateButtons() {
    // Chercher tous les boutons "Évaluer" possibles
    const evaluateButtons = document.querySelectorAll('button, a, [onclick*="evaluat"], [onclick*="Evaluat"]');
    
    evaluateButtons.forEach(button => {
        const text = button.textContent.toLowerCase();
        if (text.includes('évaluer') || text.includes('evaluer')) {
            // Extraire l'ID du protocole depuis l'onclick ou data attributes
            const onclick = button.getAttribute('onclick') || '';
            const protocolIdMatch = onclick.match(/(\d+)/);
            
            if (protocolIdMatch) {
                const protocolId = protocolIdMatch[1];
                
                // Remplacer le bouton
                button.textContent = 'Délibérer';
                button.style.background = '#17a2b8';
                button.style.color = 'white';
                button.onclick = function(e) {
                    e.preventDefault();
                    // Récupérer les données du protocole depuis le DOM si disponibles
                    const protocolRow = button.closest('tr, .protocol-item, .card');
                    const protocolData = {};
                    
                    if (protocolRow) {
                        const titleElement = protocolRow.querySelector('[data-title], .title, .protocol-title');
                        const investigatorElement = protocolRow.querySelector('[data-investigator], .investigator, .principal-investigator');
                        const institutionElement = protocolRow.querySelector('[data-institution], .institution');
                        
                        if (titleElement) protocolData.title = titleElement.textContent.trim();
                        if (investigatorElement) protocolData.principalInvestigator = investigatorElement.textContent.trim();
                        if (institutionElement) protocolData.institution = institutionElement.textContent.trim();
                    }
                    
                    showDeliberationForm(protocolId, protocolData);
                };
            }
        }
    });
}

// Auto-remplacer les boutons au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(replaceAllEvaluateButtons, 1000); // Attendre que le contenu soit chargé
});

// Observer les changements dans le DOM pour remplacer les nouveaux boutons
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            setTimeout(replaceAllEvaluateButtons, 500);
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Exposer la fonction globalement pour utilisation manuelle
window.showDeliberationForm = showDeliberationForm;
window.replaceAllEvaluateButtons = replaceAllEvaluateButtons;