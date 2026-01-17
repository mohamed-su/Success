-- Insertion de protocoles de test avec statut VERIFIED pour tester l'assignation
INSERT INTO protocol_submissions (
    title, 
    description,
    submitter_name, 
    institution, 
    participants, 
    duration, 
    status, 
    submitted_at, 
    verification_comments
) VALUES 
(
    'Étude sur l''efficacité des vaccins contre le paludisme',
    'Recherche clinique sur l''efficacité et la sécurité des nouveaux vaccins antipaludiques chez les enfants de moins de 5 ans.',
    'Dr. Fatimata Ouédraogo',
    'Centre Muraz',
    100,
    12,
    'VERIFIED',
    NOW(),
    'Protocole conforme aux exigences éthiques - Validé par la secrétaire'
),
(
    'Impact des changements climatiques sur la santé publique',
    'Étude épidémiologique sur les effets des variations climatiques sur la propagation des maladies vectorielles au Burkina Faso.',
    'Prof. Aminata Traoré',
    'IRSS',
    200,
    18,
    'VERIFIED',
    NOW(),
    'Méthodologie approuvée - Protocole prêt pour assignation'
),
(
    'Recherche sur les maladies tropicales négligées',
    'Protocole de recherche sur les stratégies de prévention et de traitement des maladies tropicales négligées en milieu rural.',
    'Dr. Moussa Kaboré',
    'CHU-YO',
    150,
    24,
    'VERIFIED',
    NOW(),
    'Aspects éthiques validés - Peut être assigné au comité'
);