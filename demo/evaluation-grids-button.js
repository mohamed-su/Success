// Code JavaScript à ajouter dans ta page rapporteur/decisions
// Ajoute ce code dans ton fichier JavaScript existant

function addEvaluationGridsButton(protocolId, containerSelector) {
    // Créer le bouton avec un compteur
    const button = document.createElement('button');
    button.textContent = 'Grilles d\'Évaluations (0)';
    button.className = 'btn btn-info';
    button.style.marginLeft = '8px';
    button.onclick = () => showEvaluationGrids(protocolId);
    
    // Ajouter le bouton au conteneur
    const container = document.querySelector(containerSelector);
    if (container) {
        container.appendChild(button);
    }
    
    // Récupérer le nombre de grilles immédiatement
    updateGridsCount(protocolId, button);
}

async function updateGridsCount(protocolId, button) {
    try {
        const response = await fetch(`http://localhost:8081/api/evaluation/protocol/${protocolId}/grids`);
        const data = await response.json();
        
        if (data.success) {
            const count = data.grids ? data.grids.length : 0;
            button.textContent = `Grilles d'Évaluations (${count})`;
            
            // Changer la couleur du bouton selon le nombre de grilles
            if (count > 0) {
                button.className = 'btn btn-success';
            } else {
                button.className = 'btn btn-secondary';
            }
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du nombre de grilles:', error);
        button.textContent = 'Grilles d\'Évaluations (Erreur)';
        button.className = 'btn btn-warning';
    }
}

async function showEvaluationGrids(protocolId) {
    try {
        const response = await fetch(`http://localhost:8081/api/evaluation/protocol/${protocolId}/grids`);
        const data = await response.json();
        
        if (data.success) {
            displayEvaluationGridsModal(data.grids);
        } else {
            alert('Erreur lors de la récupération des grilles d\'évaluation');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion');
    }
}

function displayEvaluationGridsModal(grids) {
    // Créer la modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); display: flex; justify-content: center;
        align-items: center; z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white; padding: 20px; border-radius: 8px;
        max-width: 800px; max-height: 80vh; overflow: auto; width: 90%;
    `;
    
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3>Grilles d'Évaluation (${grids.length})</h3>
            <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
        </div>
    `;
    
    if (grids.length === 0) {
        html += '<p>Aucune grille d\'évaluation trouvée pour ce protocole.</p>';
    } else {
        grids.forEach(grid => {
            const statusColor = grid.status === 'COMPLETED' ? '#28a745' : '#ffc107';
            const decisionColor = getDecisionColor(grid.decision);
            
            html += `
                <div style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: ${grid.status === 'COMPLETED' ? '#f8f9fa' : '#fff'}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="margin: 0;">Évaluateur: ${grid.memberName || 'Non défini'}</h4>
                        <span style="padding: 4px 8px; border-radius: 4px; background: ${statusColor}; color: white; font-size: 12px;">
                            ${grid.status}
                        </span>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 12px;">
                        <div><strong>Score moyen:</strong> ${grid.averageScore ? grid.averageScore.toFixed(2) : 'N/A'}/5</div>
                        <div><strong>Décision:</strong> <span style="color: ${decisionColor}; font-weight: bold;">${grid.decision || 'En attente'}</span></div>
                        <div><strong>Assigné le:</strong> ${new Date(grid.assignedAt).toLocaleDateString()}</div>
                        ${grid.completedAt ? `<div><strong>Complété le:</strong> ${new Date(grid.completedAt).toLocaleDateString()}</div>` : ''}
                    </div>
                    ${grid.status === 'COMPLETED' && grid.generalComments ? `
                        <div style="margin-top: 8px; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                            <strong>Commentaires généraux:</strong>
                            <p style="margin: 4px 0 0 0; font-size: 14px;">${grid.generalComments}</p>
                        </div>
                    ` : ''}
                </div>
            `;
        });
    }
    
    modalContent.innerHTML = html;
    modal.appendChild(modalContent);
    modal.className = 'modal';
    document.body.appendChild(modal);
}

function getDecisionColor(decision) {
    switch (decision) {
        case 'APPROVE': return '#28a745';
        case 'REJECT': return '#dc3545';
        case 'MINOR_REVISION': return '#ffc107';
        case 'MAJOR_REVISION': return '#fd7e14';
        default: return '#6c757d';
    }
}

// Utilisation : appelle cette fonction pour chaque protocole dans ta liste
// addEvaluationGridsButton(protocolId, '.protocol-actions-' + protocolId);