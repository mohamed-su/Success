import React from 'react';
import { Download, Eye, CheckCircle } from 'lucide-react';

interface EvaluationPdfDownloadProps {
  evaluationId: number;
  memberName: string;
  protocolId: number;
  pdfGenerated: boolean;
  downloadUrl?: string;
  onGeneratePdf?: () => void;
}

const EvaluationPdfDownload: React.FC<EvaluationPdfDownloadProps> = ({
  evaluationId,
  memberName,
  protocolId,
  pdfGenerated,
  downloadUrl,
  onGeneratePdf
}) => {
  const handleDownload = async () => {
    if (!downloadUrl) return;
    
    try {
      const response = await fetch(downloadUrl);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `evaluation_PROT-${protocolId}_${memberName.replace(' ', '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Erreur lors du téléchargement du PDF');
      }
    } catch (err) {
      alert('Erreur lors du téléchargement: ' + err.message);
    }
  };

  const handleView = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  if (!pdfGenerated && !onGeneratePdf) {
    return null;
  }

  return (
    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-start">
        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-green-800">
            Évaluation soumise avec succès !
          </h3>
          <div className="mt-2 text-sm text-green-700">
            {pdfGenerated ? (
              <>
                <p className="mb-3">
                  Votre grille d'évaluation a été générée au format PDF. 
                  Vous pouvez la télécharger ou la visualiser ci-dessous.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </button>
                  <button
                    onClick={handleView}
                    className="inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visualiser
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-3">
                  Votre évaluation a été sauvegardée. Cliquez ci-dessous pour générer le PDF.
                </p>
                <button
                  onClick={onGeneratePdf}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Générer PDF
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationPdfDownload;
