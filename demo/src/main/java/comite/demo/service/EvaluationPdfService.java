package comite.demo.service;

import comite.demo.entity.MemberEvaluationGrid;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class EvaluationPdfService {

    private static final String PDF_DIRECTORY = "uploads/evaluation-grids";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public String generateEvaluationPdf(MemberEvaluationGrid evaluation, String protocolTitle) throws IOException, DocumentException {
        // Créer le répertoire s'il n'existe pas
        File directory = new File(PDF_DIRECTORY);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Nom du fichier PDF
        String fileName = String.format("evaluation_%d_%d_%s.pdf", 
            evaluation.getProtocolId(), 
            evaluation.getMemberId(),
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")));
        
        String filePath = PDF_DIRECTORY + File.separator + fileName;

        // Créer le document PDF
        Document document = new Document(PageSize.A4, 50, 50, 50, 50);
        PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(filePath));
        
        document.open();
        
        // Ajouter le contenu
        addContent(document, evaluation, protocolTitle);
        
        document.close();
        
        return filePath;
    }

    private void addContent(Document document, MemberEvaluationGrid evaluation, String protocolTitle) throws DocumentException {
        // Polices
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.BLACK);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.BLACK);
        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.BLACK);

        // Titre avec numéro de protocole
        Paragraph title = new Paragraph("Grilles d'Évaluation PDF", titleFont);
        title.setAlignment(Element.ALIGN_LEFT);
        title.setSpacingAfter(5);
        document.add(title);
        
        Paragraph protocolInfo = new Paragraph("Protocole: PROT-" + String.format("%04d", evaluation.getProtocolId()), normalFont);
        protocolInfo.setSpacingAfter(20);
        document.add(protocolInfo);

        // Parser les commentaires JSON de manière sécurisée
        Map<String, String> comments = new HashMap<>();
        if (evaluation.getComments() != null && !evaluation.getComments().trim().isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                Map<String, Object> jsonMap = mapper.readValue(evaluation.getComments(), Map.class);
                for (Map.Entry<String, Object> entry : jsonMap.entrySet()) {
                    comments.put(entry.getKey(), entry.getValue() != null ? entry.getValue().toString() : "");
                }
            } catch (Exception e) {
                System.err.println("Erreur parsing commentaires JSON: " + e.getMessage());
                // Valeurs par défaut si parsing échoue
                for (int i = 1; i <= 9; i++) {
                    comments.put(String.valueOf(i), "Commentaire " + i);
                }
            }
        } else {
            // Valeurs par défaut si pas de commentaires
            for (int i = 1; i <= 9; i++) {
                comments.put(String.valueOf(i), "Évalué");
            }
        }

        // Tableau principal des critères avec 4 colonnes
        PdfPTable mainTable = new PdfPTable(4);
        mainTable.setWidthPercentage(100);
        mainTable.setWidths(new float[]{1f, 6f, 1.5f, 2.5f}); // N°, Critères, OBS, Commentaires
        mainTable.setSpacingAfter(15);

        // En-têtes
        addHeaderCell(mainTable, "N°", boldFont);
        addHeaderCell(mainTable, "Critères", boldFont);
        addHeaderCell(mainTable, "OBS", boldFont);
        addHeaderCell(mainTable, "COMMENTAIRES", boldFont);

        // Ligne 1 - Critères administratifs
        String section1Criteria = "Protocole Français: " + (evaluation.getProtocolFrench() != null ? evaluation.getProtocolFrench() : "Non renseigné") + "\n" +
                             "CV signés: " + (evaluation.getCvSigned() != null ? evaluation.getCvSigned() : "Non renseigné") + "\n" +
                             "Formulaire consentement: " + (evaluation.getConsentForm() != null ? evaluation.getConsentForm() : "Non renseigné") + "\n" +
                             "Assurance: " + (evaluation.getInsurance() != null ? evaluation.getInsurance() : "Non renseigné") + "\n" +
                             "Paiement: " + (evaluation.getPaymentProof() != null ? evaluation.getPaymentProof() : "Non renseigné");
        
        addCriteriaRowWithDetails(mainTable, "1.", section1Criteria, "", comments.get("1"), normalFont);
        addCriteriaRowWithDetails(mainTable, "2.", "Investigateur principal qualifié", "", comments.get("2"), normalFont);
        addCriteriaRowWithDetails(mainTable, "3.", "Investigateurs associés pertinents", "", comments.get("3"), normalFont);
        addCriteriaRowWithDetails(mainTable, "4.", "Justification pertinente ? Objectifs clairs ?", "", comments.get("4"), normalFont);
        addCriteriaRowWithDetails(mainTable, "5.", "Méthodologie solide ?", "", comments.get("5"), normalFont);
        addCriteriaRowWithDetails(mainTable, "6.", "Budget approprié", "", comments.get("6"), normalFont);

        // Section CRITERES ESSAIS THERAPEUTIQUES
        PdfPCell therapeuticHeader = new PdfPCell(new Phrase("CRITERES ESSAIS THERAPEUTIQUES", boldFont));
        therapeuticHeader.setColspan(4);
        therapeuticHeader.setHorizontalAlignment(Element.ALIGN_CENTER);
        therapeuticHeader.setBackgroundColor(BaseColor.LIGHT_GRAY);
        therapeuticHeader.setPadding(8);
        mainTable.addCell(therapeuticHeader);

        addCriteriaRowWithDetails(mainTable, "7.", "Produit d'essai", "", comments.get("7"), normalFont);
        addCriteriaRowWithDetails(mainTable, "8.", "Produit comparateur", "", comments.get("8"), normalFont);
        addCriteriaRowWithDetails(mainTable, "9.", "Produit concomitant", "", comments.get("9"), normalFont);

        document.add(mainTable);

        // Section DÉCISION FINALE
        PdfPTable decisionTable = new PdfPTable(1);
        decisionTable.setWidthPercentage(100);
        decisionTable.setSpacingBefore(20);
        decisionTable.setSpacingAfter(20);

        PdfPCell decisionHeaderCell = new PdfPCell(new Phrase("DÉCISION FINALE", headerFont));
        decisionHeaderCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        decisionHeaderCell.setPadding(10);
        decisionHeaderCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        decisionTable.addCell(decisionHeaderCell);

        // Décision avec couleur
        String decisionText = "Décision: ";
        BaseColor decisionColor = BaseColor.BLACK;
        
        if (evaluation.getFinalDecision() != null) {
            switch (evaluation.getFinalDecision()) {
                case "Favorable":
                    decisionText += "Favorable";
                    decisionColor = new BaseColor(0, 128, 0); // Vert
                    break;
                case "Ajourné":
                    decisionText += "Ajourné";
                    decisionColor = new BaseColor(255, 165, 0); // Orange
                    break;
                case "Non favorable":
                    decisionText += "Non favorable";
                    decisionColor = new BaseColor(255, 0, 0); // Rouge
                    break;
                default:
                    decisionText += evaluation.getFinalDecision();
            }
        }
        
        Font decisionFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, decisionColor);
        PdfPCell decisionCell = new PdfPCell(new Phrase(decisionText, decisionFont));
        decisionCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        decisionCell.setPadding(15);
        decisionTable.addCell(decisionCell);

        document.add(decisionTable);

        // Section signature avec 2 colonnes
        PdfPTable signatureTable = new PdfPTable(2);
        signatureTable.setWidthPercentage(100);
        signatureTable.setWidths(new float[]{1f, 1f});
        
        // Colonne Évaluateur
        PdfPCell evaluatorCell = new PdfPCell();
        evaluatorCell.setBorder(Rectangle.NO_BORDER);
        evaluatorCell.addElement(new Paragraph("Évaluateur:", boldFont));
        String evaluatorName = evaluation.getEvaluatorName() != null ? evaluation.getEvaluatorName() : 
                              (evaluation.getMemberName() != null ? evaluation.getMemberName() : "Évaluateur");
        evaluatorCell.addElement(new Paragraph(evaluatorName, normalFont));
        evaluatorCell.setPadding(10);
        signatureTable.addCell(evaluatorCell);
        
        // Colonne Date
        PdfPCell dateCell = new PdfPCell();
        dateCell.setBorder(Rectangle.NO_BORDER);
        dateCell.addElement(new Paragraph("Date:", boldFont));
        String dateText = evaluation.getEvaluationDate() != null ? 
                         evaluation.getEvaluationDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : 
                         LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        dateCell.addElement(new Paragraph(dateText, normalFont));
        dateCell.setPadding(10);
        signatureTable.addCell(dateCell);
        
        document.add(signatureTable);
    }

    private void addInfoRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPadding(5);
        table.addCell(labelCell);
        
        PdfPCell valueCell = new PdfPCell(new Phrase(value, valueFont));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setPadding(5);
        table.addCell(valueCell);
    }

    private void addHeaderCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(new BaseColor(230, 230, 230));
        cell.setPadding(8);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }
    
    private void addCriteriaRowWithDetails(PdfPTable table, String number, String criteria, String obs, String comments, Font font) {
        // Numéro
        PdfPCell numberCell = new PdfPCell(new Phrase(number, font));
        numberCell.setPadding(8);
        numberCell.setVerticalAlignment(Element.ALIGN_TOP);
        table.addCell(numberCell);
        
        // Critères
        PdfPCell criteriaCell = new PdfPCell(new Phrase(criteria, font));
        criteriaCell.setPadding(8);
        criteriaCell.setVerticalAlignment(Element.ALIGN_TOP);
        table.addCell(criteriaCell);
        
        // OBS - CHAMP VIDE
        PdfPCell obsCell = new PdfPCell(new Phrase(obs != null ? obs : "", font));
        obsCell.setPadding(8);
        obsCell.setVerticalAlignment(Element.ALIGN_TOP);
        table.addCell(obsCell);
        
        // Commentaires
        PdfPCell commentsCell = new PdfPCell(new Phrase(comments != null ? comments : "", font));
        commentsCell.setPadding(8);
        commentsCell.setVerticalAlignment(Element.ALIGN_TOP);
        table.addCell(commentsCell);
    }
}