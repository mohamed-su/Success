// Script d'injection directe du nouveau formulaire de délibération
// Ce script remplace complètement l'ancien formulaire

(function() {
    'use strict';
    
    console.log('🔄 Injection du nouveau formulaire de délibération...');
    
    // Fonction pour créer le nouveau formulaire de délibération
    function createDeliberationForm(protocolId, protocolData = {}) {
        const currentDate = new Date();
        const deliberationNumber = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${protocolId}`;
        const frenchDate = currentDate.toLocaleDateString('fr-FR');
        
        return `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2c3e50; padding-bottom: 20px;">
                    <h1 style="color: #2c3e50; margin-bottom: 10px; font-size: 24px;">DÉLIBÉRATION</h1>
                    <p style="margin: 5px 0; font-weight: bold;">BURKINA FASO</p>
                    <p style="margin: 5px 0; font-style: italic;">La Patrie ou la Mort, nous Vaincrons</p>
                    <div style="margin: 15px 0;">
                        <p style="margin: 5px 0; font-size: 14px;">MINISTÈRE DE LA SANTÉ</p>
                        <p style="margin: 5px 0; font-size: 14px;">MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR, DE LA RECHERCHE ET DE L'INNOVATION</p>
                        <p style="margin: 5px 0; font-weight: bold; color: #2c3e50;">COMITÉ D'ÉTHIQUE POUR LA RECHERCHE EN SANTÉ</p>
                    </div>
                </div>

                <form id="deliberationForm" style="font-size: 14px;">
                    <div style="margin-bottom: 20px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 5px;">DÉLIBÉRATION N°:</label>
                        <input type="text" name="deliberationNumber" value="${deliberationNumber}" 
                               style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; box-sizing: border-box;" required>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 5px;">1. TITRE DE LA RECHERCHE:</label>
                        <textarea name="researchTitle" rows="3" 
                                  style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; box-sizing: border-box; resize: vertical;" 
                                  placeholder="« Identification, caractérisation et sélection de souches fermentaires pour une lactofermentation maîtrisé du gombo »" required>${protocolData.title || ''}</textarea>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 5px;">2. RÉFÉRENCE DU PROTOCOLE:</label>
                        <input type="text" name="protocolReference" 
                               style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; box-sizing: border-box;" 
                               placeholder="Version non précisée" required>
                    </div>

                    <div style="margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 4px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 10px;">3. DOCUMENTATION:</label>
                        <div style="margin-left: 20px;">
                            <p style="margin: 5px 0;">- Protocole de recherche</p>
                            <p style="margin: 5px 0;">- Copie du reçu de paiement</p>
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 5px;">4. RÉFÉRENCE DU DEMANDEUR:</label>
                        <input type="text" name="principalInvestigator" 
                               style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; box-sizing: border-box;" 
                               placeholder="Investigateur principal: KANWE Mamounata E M Patricia" 
                               value="${protocolData.investigator || ''}" required>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 5px;">5. SITE DE LA RECHERCHE:</label>
                        <input type="text" name="researchSite" 
                               style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; box-sizing: border-box;" 
                               value="Burkina Faso" required>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 5px;">6. DATE DE LA DÉLIBÉRATION:</label>
                        <input type="date" name="deliberationDate" 
                               style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; box-sizing: border-box;" 
                               value="${currentDate.toISOString().split('T')[0]}" required>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 10px;">7. ÉLÉMENTS EXAMINÉS:</label>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 4px;">
                            <label style="display: block; margin: 10px 0; cursor: pointer;">
                                <input type="checkbox" name="scientificConception" style="margin-right: 10px; transform: scale(1.2);">
                                Conception scientifique et conduite de la recherche
                            </label>
                            <label style="display: block; margin: 10px 0; cursor: pointer;">
                                <input type="checkbox" name="participantProtection" style="margin-right: 10px; transform: scale(1.2);">
                                Soins et protection des participants à la recherche
                            </label>
                            <label style="display: block; margin: 10px 0; cursor: pointer;">
                                <input type="checkbox" name="dataConfidentiality" style="margin-right: 10px; transform: scale(1.2);">
                                Protection de la confidentialité des données du participant à la recherche
                            </label>
                            <label style="display: block; margin: 10px 0; cursor: pointer;">
                                <input type="checkbox" name="consentProcess" style="margin-right: 10px; transform: scale(1.2);">
                                Processus de consentement éclairé
                            </label>
                            <label style="display: block; margin: 10px 0; cursor: pointer;">
                                <input type="checkbox" name="researchBudget" style="margin-right: 10px; transform: scale(1.2);">
                                Budget de la recherche
                            </label>
                            <label style="display: block; margin: 10px 0; cursor: pointer;">
                                <input type="checkbox" name="cvDocuments" style="margin-right: 10px; transform: scale(1.2);">
                                CV
                            </label>
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 5px;">8. OBSERVATIONS:</label>
                        <textarea name="observations" rows="3" 
                                  style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; box-sizing: border-box; resize: vertical;" 
                                  placeholder="Préciser sur la page de garde l'institution de formation et le diplôme postulé."></textarea>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 10px;">9. MEMBRES AYANT SIÉGÉ:</label>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 4px;">
                            <label style="display: block; margin: 8px 0; cursor: pointer;">
                                <input type="checkbox" name="member_koueta" value="Pr Fla KOUETA" style="margin-right: 10px; transform: scale(1.2);">
                                Pr Fla KOUETA
                            </label>
                            <label style="display: block; margin: 8px 0; cursor: pointer;">
                                <input type="checkbox" name="member_nanga" value="Dr Clotaire NANGA" style="margin-right: 10px; transform: scale(1.2);">
                                Dr Clotaire NANGA
                            </label>
                            <label style="display: block; margin: 8px 0; cursor: pointer;">
                                <input type="checkbox" name="member_drabo" value="Pr Maxime DRABO" style="margin-right: 10px; transform: scale(1.2);">
                                Pr Maxime DRABO
                            </label>
                            <label style="display: block; margin: 8px 0; cursor: pointer;">
                                <input type="checkbox" name="member_toe" value="Pr Patrice TOE" style="margin-right: 10px; transform: scale(1.2);">
                                Pr Patrice TOE
                            </label>
                            <label style="display: block; margin: 8px 0; cursor: pointer;">
                                <input type="checkbox" name="member_ouedraogo1" value="M Olivier L. O. OUEDRAOGO" style="margin-right: 10px; transform: scale(1.2);">
                                M Olivier L. O. OUEDRAOGO
                            </label>
                            <label style="display: block; margin: 8px 0; cursor: pointer;">
                                <input type="checkbox" name="member_ouedraogo2" value="Dr Alphonse OUEDRAOGO" style="margin-right: 10px; transform: scale(1.2);">
                                Dr Alphonse OUEDRAOGO
                            </label>
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 10px; color: #856404;">10. AVIS DU COMITÉ:</label>
                        <div style="background: #fff3cd; padding: 15px; border-radius: 4px; border-left: 4px solid #ffc107;">
                            <label style="display: block; margin: 10px 0; cursor: pointer;">
                                <input type="radio" name="committeeOpinion" value="FAVORABLE" style="margin-right: 10px; transform: scale(1.3);" required>
                                <span style="color: #28a745; font-weight: bold; font-size: 16px;">Avis favorable</span>
                            </label>
                            <label style="display: block; margin: 10px 0; cursor: pointer;">
                                <input type="radio" name="committeeOpinion" value="AJOURNE" style="margin-right: 10px; transform: scale(1.3);" required>
                                <span style="color: #ffc107; font-weight: bold; font-size: 16px;">Ajourné</span>
                            </label>
                            <label style="display: block; margin: 10px 0; cursor: pointer;">
                                <input type="radio" name="committeeOpinion" value="NON_FAVORABLE" style="margin-right: 10px; transform: scale(1.3);" required>
                                <span style="color: #dc3545; font-weight: bold; font-size: 16px;">Non favorable</span>
                            </label>
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 5px;">11. RÉSERVES:</label>
                        <textarea name="reserves" rows="3" 
                                  style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; box-sizing: border-box; resize: vertical;" 
                                  placeholder="Réserves éventuelles"></textarea>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <label style="font-weight: bold; display: block; margin-bottom: 5px;">12. RECOMMANDATIONS:</label>
                        <textarea name="recommendations" rows="4" 
                                  style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; box-sizing: border-box; resize: vertical;" 
                                  placeholder="Recommandations du comité"></textarea>
                    </div>

                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #2c3e50;">
                        <p style="margin-bottom: 30px; font-weight: bold; font-size: 16px;">Ouagadougou, le ${frenchDate}</p>
                        <div style="display: flex; justify-content: space-around; margin-top: 40px;">
                            <div style="text-align: center; flex: 1; margin: 0 20px;">
                                <p style="font-weight: bold;">Le Rapporteur</p>
                                <div style="height: 80px; border: 2px dashed #ccc; margin: 20px 0; display: flex; align-items: center; justify-content: center; background: #f8f9fa; border-radius: 4px; color: #6c757d; font-style: italic;">
                                    Signature
                                </div>
                                <p style="font-weight: bold;">Dr Clotaire NANGA</p>
                                <p style="font-size: 12px; color: #6c757d;">Chevalier de l'Ordre du Mérite Burkinabè</p>
                            </div>
                            <div style="text-align: center; flex: 1; margin: 0 20px;">
                                <p style="font-weight: bold;">Le Président</p>
                                <div style="height: 80px; border: 2px dashed #ccc; margin: 20px 0; display: flex; align-items: center; justify-content: center; background: #f8f9fa; border-radius: 4px; color: #6c757d; font-style: italic;">
                                    Signature
                                </div>
                                <p style="font-weight: bold;">Pr Fla KOUETA</p>
                                <p style="font-size: 12px; color: #6c757d;">Chevalier de l'Ordre du Mérite</p>
                                <p style="font-size: 12px; color: #6c757d;">Chevalier de l'Ordre des Palmes Académiques</p>
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                        <button type="button" onclick="closeDeliberationModal()" 
                                style="padding: 15px 30px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold;">
                            Annuler
                        </button>
                        <button type="submit" 
                                style="padding: 15px 30px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold;">
                            Enregistrer la Délibération
                        </button>
                    </div>
                </form>
            </div>
        `;
    }
    
    // Fonction pour remplacer l'ancien formulaire
    function replaceOldForm() {
        // Observer les changements dans le DOM
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Chercher l'ancien formulaire d'évaluation
                        const oldForm = node.querySelector ? 
                            node.querySelector('[class*="evaluation"], [id*="evaluation"], h1:contains("Évaluation Complète")') ||
                            (node.textContent && node.textContent.includes('Évaluation Complète') ? node : null) : null;
                        
                        if (oldForm || (node.textContent && node.textContent.includes('Évaluation Complète'))) {
                            console.log('🔄 Ancien formulaire détecté, remplacement...');
                            
                            // Extraire l'ID du protocole
                            const protocolMatch = node.textContent.match(/PROT-(\d+)/);
                            const protocolId = protocolMatch ? protocolMatch[1] : '8';
                            
                            // Remplacer le contenu
                            const targetElement = oldForm || node;
                            if (targetElement.closest('.modal, [role="dialog"]')) {
                                const modal = targetElement.closest('.modal, [role="dialog"]');
                                modal.innerHTML = createDeliberationForm(protocolId);
                                setupDeliberationForm(protocolId, modal);
                            } else {
                                targetElement.innerHTML = createDeliberationForm(protocolId);
                                setupDeliberationForm(protocolId, targetElement);
                            }
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Vérifier immédiatement s'il y a déjà un formulaire
        setTimeout(() => {
            const existingForm = document.querySelector('h1');
            if (existingForm && existingForm.textContent.includes('Évaluation Complète')) {
                const protocolMatch = document.body.textContent.match(/PROT-(\d+)/);
                const protocolId = protocolMatch ? protocolMatch[1] : '8';
                
                const container = existingForm.closest('.modal, [role="dialog"]') || existingForm.parentElement;
                container.innerHTML = createDeliberationForm(protocolId);
                setupDeliberationForm(protocolId, container);
            }
        }, 500);
    }
    
    // Configuration du formulaire de délibération
    function setupDeliberationForm(protocolId, container) {
        const form = container.querySelector('#deliberationForm');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                if (key.startsWith('member_')) {
                    if (!data.membersPresent) data.membersPresent = [];
                    data.membersPresent.push(value);
                } else {
                    data[key] = value;
                }
            }
            
            data.scientificConception = this.querySelector('[name="scientificConception"]').checked;
            data.participantProtection = this.querySelector('[name="participantProtection"]').checked;
            data.dataConfidentiality = this.querySelector('[name="dataConfidentiality"]').checked;
            data.consentProcess = this.querySelector('[name="consentProcess"]').checked;
            data.researchBudget = this.querySelector('[name="researchBudget"]').checked;
            data.cvDocuments = this.querySelector('[name="cvDocuments"]').checked;
            
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enregistrement...';
            
            fetch(`http://localhost:8081/api/rapporteur/protocols/${protocolId}/decision`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': '1',
                    'X-User-Role': 'rapporteur'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('✅ Délibération enregistrée avec succès !\\n\\nNuméro: ' + result.deliberationNumber);
                    closeDeliberationModal();
                } else {
                    alert('❌ Erreur: ' + result.error);
                }
            })
            .catch(error => {
                alert('❌ Erreur lors de l\\'enregistrement');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enregistrer la Délibération';
            });
        });
    }
    
    // Fonction pour fermer le modal
    window.closeDeliberationModal = function() {
        const modal = document.querySelector('.modal, [role="dialog"]');
        if (modal) {
            modal.style.display = 'none';
            modal.remove();
        }
    };
    
    // Démarrer le remplacement
    replaceOldForm();
    
    console.log('✅ Script de remplacement du formulaire activé !');
    
})();