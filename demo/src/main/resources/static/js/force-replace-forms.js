// Script d'injection forcée pour remplacer l'ancien formulaire
(function() {
    'use strict';
    
    console.log('🔄 Remplacement automatique des formulaires d\'évaluation...');
    
    function forceReplaceEvaluationForms() {
        // Intercepter tous les clics sur les boutons "Évaluer"
        document.addEventListener('click', function(e) {
            const target = e.target;
            const text = target.textContent.toLowerCase();
            
            if (text.includes('évaluer') || text.includes('evaluer')) {
                e.preventDefault();
                e.stopPropagation();
                
                const protocolId = extractProtocolId(target);
                if (protocolId) {
                    openDeliberationForm(protocolId);
                }
                return false;
            }
        }, true);
        
        // Remplacer tous les boutons existants
        setTimeout(() => {
            const buttons = document.querySelectorAll('button, a, [role="button"]');
            buttons.forEach(button => {
                const text = button.textContent.toLowerCase();
                if (text.includes('évaluer') || text.includes('evaluer')) {
                    button.textContent = button.textContent.replace(/[Éé]valuer/gi, 'Délibérer');
                    button.style.backgroundColor = '#17a2b8';
                    button.style.color = 'white';
                    
                    const protocolId = extractProtocolId(button);
                    if (protocolId) {
                        button.onclick = function(e) {
                            e.preventDefault();
                            openDeliberationForm(protocolId);
                            return false;
                        };
                    }
                }
            });
        }, 1000);
    }
    
    function extractProtocolId(element) {
        const onclick = element.getAttribute('onclick') || '';
        let match = onclick.match(/(\d+)/);
        if (match) return match[1];
        
        const dataId = element.getAttribute('data-protocol-id') || 
                      element.getAttribute('data-id') ||
                      element.closest('[data-protocol-id]')?.getAttribute('data-protocol-id');
        if (dataId) return dataId;
        
        const row = element.closest('tr, .protocol-item, .card');
        if (row) {
            const text = row.textContent;
            match = text.match(/PROT-(\d+)|Protocol\s+(\d+)|ID:\s*(\d+)/i);
            if (match) return match[1] || match[2] || match[3];
        }
        
        return '1';
    }
    
    function openDeliberationForm(protocolId) {
        const url = `http://localhost:8081/api/rapporteur/evaluation-form/${protocolId}`;
        const popup = window.open(url, 'deliberation_' + protocolId, 
            'width=900,height=800,scrollbars=yes,resizable=yes');
        
        if (!popup) {
            window.location.href = url;
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceReplaceEvaluationForms);
    } else {
        forceReplaceEvaluationForms();
    }
    
    window.openDeliberationForm = openDeliberationForm;
    console.log('✅ Script de remplacement activé !');
})();