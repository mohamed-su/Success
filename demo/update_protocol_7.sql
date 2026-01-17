-- Mise à jour du protocole ID 7 avec les noms des fichiers existants
UPDATE protocol_submissions 
SET 
    president_letter_file_name = 'liste-protocoles-all.pdf',
    information_notice_file_name = 'liste-protocoles-all.pdf', 
    informed_consent_file_name = 'liste-protocoles-all.pdf',
    chronogram_file_name = 'liste-protocoles-all.pdf',
    detailed_budget_file_name = 'liste-protocoles-all.pdf',
    evaluation_report_file_name = 'liste-protocoles-all.pdf'
WHERE id = 7;

-- Vérifier la mise à jour
SELECT id, protocol_code, president_letter_file_name, information_notice_file_name, 
       informed_consent_file_name, chronogram_file_name, detailed_budget_file_name, 
       evaluation_report_file_name 
FROM protocol_submissions 
WHERE id = 7;