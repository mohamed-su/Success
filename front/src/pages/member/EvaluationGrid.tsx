import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Send, ArrowLeft } from 'lucide-react';
import { API_CONFIG } from '../../config/api';

const BASE_URL = API_CONFIG.BASE_URL;

const EvaluationGrid = () => {
  const { protocolId } = useParams();
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState(null);
  const [evaluation, setEvaluation] = useState({
    scientificQuality: 0,
    ethicalCompliance: 0,
    methodologyClarity: 0,
    riskBenefitRatio: 0,
    informedConsentQuality: 0,
    dataProtection: 0,
    participantSafety: 0,
    feasibility: 0,
    strengths: '',
    weaknesses: '',
    recommendations: '',
    generalComments: '',
    decision: '',
    status: 'PENDING'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [protocolId]);

  const loadData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const memberId = userData.id;
      const memberName = userData.name || userData.username;

      // Charger le protocole
      const protocolRes = await fetch(`${BASE_URL}/secretary/protocols/${protocolId}`);
      const protocolData = await protocolRes.json();
      if (protocolData.success) {
        setProtocol(protocolData.protocol);
      }

      // Charger ou créer la grille d'évaluation
      const evalRes = await fetch(`${BASE_URL}/evaluation/protocol/${protocolId}/member/${memberId}`);
      const evalData = await evalRes.json();
      
      if (evalData.success && evalData.evaluationGrid) {
        setEvaluation(evalData.evaluationGrid);
      } else {
        // Créer une nouvelle grille si elle n'existe pas
        const createRes = await fetch(`${BASE_URL}/evaluation/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ protocolId, memberId, memberName })
        });
        const createData = await createRes.json();
        if (createData.success) {
          setEvaluation(createData.evaluationGrid);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (criterion, value) => {
    setEvaluation({ ...evaluation, [criterion]: parseInt(value) });
  };

  const handleSave = async (submit = false) => {
    setSaving(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const memberId = userData.id;
      
      const gridData = {
        ...evaluation,
        submit: submit
      };

      const response = await fetch(`${BASE_URL}/evaluation/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocolId: protocolId,
          memberId: memberId,
          ...gridData
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(submit ? 'Évaluation soumise avec succès !' : 'Évaluation sauvegardée');
        if (submit) navigate('/dashboard/member/assigned');
      } else {
        alert('Erreur: ' + (data.error || 'Échec de la sauvegarde'));
      }
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const criteria = [
    { key: 'scientificQuality', label: 'Qualité scientifique' },
    { key: 'ethicalCompliance', label: 'Conformité éthique' },
    { key: 'methodologyClarity', label: 'Clarté méthodologique' },
    { key: 'riskBenefitRatio', label: 'Rapport risque/bénéfice' },
    { key: 'informedConsentQuality', label: 'Qualité du consentement éclairé' },
    { key: 'dataProtection', label: 'Protection des données' },
    { key: 'participantSafety', label: 'Sécurité des participants' },
    { key: 'feasibility', label: 'Faisabilité' }
  ];

  if (loading) return <div className="flex justify-center p-8">Chargement...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </button>
        <h1 className="text-2xl font-bold text-[#00213B]">Grille d'Évaluation</h1>
      </div>

      {protocol && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">{protocol.title}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div><strong>Investigateur:</strong> {protocol.principalInvestigator}</div>
            <div><strong>Institution:</strong> {protocol.institution}</div>
            <div><strong>Participants:</strong> {protocol.participants}</div>
            <div><strong>Durée:</strong> {protocol.duration} mois</div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
        <h3 className="text-lg font-semibold text-[#00213B]">Critères d'Évaluation (1-5)</h3>
        
        {criteria.map(criterion => (
          <div key={criterion.key} className="space-y-2">
            <label className="block font-medium text-gray-700">{criterion.label}</label>
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map(score => (
                <label key={score} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={criterion.key}
                    value={score}
                    checked={evaluation[criterion.key] === score}
                    onChange={(e) => handleScoreChange(criterion.key, e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>{score}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="space-y-4 pt-6 border-t">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Points forts</label>
            <textarea
              value={evaluation.strengths}
              onChange={(e) => setEvaluation({ ...evaluation, strengths: e.target.value })}
              rows={3}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Points faibles</label>
            <textarea
              value={evaluation.weaknesses}
              onChange={(e) => setEvaluation({ ...evaluation, weaknesses: e.target.value })}
              rows={3}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Recommandations</label>
            <textarea
              value={evaluation.recommendations}
              onChange={(e) => setEvaluation({ ...evaluation, recommendations: e.target.value })}
              rows={3}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Commentaires généraux</label>
            <textarea
              value={evaluation.generalComments}
              onChange={(e) => setEvaluation({ ...evaluation, generalComments: e.target.value })}
              rows={4}
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Décision</label>
            <select
              value={evaluation.decision}
              onChange={(e) => setEvaluation({ ...evaluation, decision: e.target.value })}
              className="w-full border rounded-md p-2"
            >
              <option value="">Sélectionner une décision</option>
              <option value="APPROVE">Approuver</option>
              <option value="MINOR_REVISION">Révisions mineures</option>
              <option value="MAJOR_REVISION">Révisions majeures</option>
              <option value="REJECT">Rejeter</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving || !evaluation.decision}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            <Send className="w-4 h-4 mr-2" />
            Soumettre l'évaluation
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationGrid;
