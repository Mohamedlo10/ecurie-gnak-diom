import axios from "axios";
import pdfParse from "pdf-parse";
import * as copieModel from '../models/copieModel.js';
import * as plagiatModel from '../models/plagiatModel.js';
import * as plagiatCopieModel from '../models/plagiatCopieModel.js';

export const getAllCopieByIdSujet = async (idsujet) => {
    try {
      const copies = await copieModel.getAllCopieByIdSujet(idsujet);
      return copies;
    } catch (error) {
      console.error(`Erreur lors de la récupération des copies pour le sujet ${idsujet} :`, error);
      throw error;
    }
  };

export const extraireTextFromPdf = async (urlCopie) => {

    let copieText = "";
    while (true) {
      try {
        
        const copieResponse = await axios.get(urlCopie, { responseType: "arraybuffer" });
        const pdfData = await pdfParse(Buffer.from(copieResponse.data));
        copieText = pdfData.text;
        break;
      } catch (err) {
        console.error("Impossible d'extraire le texte de la copie :", err.message);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  
    return copieText;
  };

export const cleanText = (text) =>
    text
      .toLowerCase()
      .replace(/[.,;:!?]/g, "")
      .split(/\s+/)
      .filter(Boolean);

export const compareTextSets = (copie1, copie2) => {
    let intersectionCount = 0;
    const [smallSet, largeSet] = copie1.size < copie2.size ? [copie1, copie2] : [copie2, copie1];
    for (const word of smallSet) {
      if (largeSet.has(word)) {
        intersectionCount++;
      }
    }
    // nieuw appliquer formule bi ci code bi ma ayyy |A ∪ B| = |A| + |B| - |A ∩ B|
    const unionCount = copie1.size + copie2.size - intersectionCount;
    //expression ternaire a la i Fall ma ayyy
    return unionCount === 0 ? 0 : (intersectionCount / unionCount) * 100;
  };
  
export const checkPlagiat = async (idsujet) => {
    // 1. Récupérer toutes les copies du sujet
    const copies = await getAllCopieByIdSujet(idsujet);
  
    // 2. Extraction du texte et pré-calcul de l'ensemble des mots nettoyés pour chaque copie
    const copiesTraitees = [];
    for (const copie of copies) {
      const texte = await extraireTextFromPdf(copie.urlcopie);
      const ensembleMots = new Set(cleanText(texte));
      copiesTraitees.push({ idcopie: copie.idcopie, texte, ensembleMots });
    }
  
    // 3. Comparaison optimisée de chaque paire de copies
    for (let i = 0; i < copiesTraitees.length; i++) {
      for (let j = i + 1; j < copiesTraitees.length; j++) {
        const similarite = compareTextSets(
          copiesTraitees[i].ensembleMots,
          copiesTraitees[j].ensembleMots
        );
        console.log(
          `Comparaison entre copie ${copiesTraitees[i].idcopie} et copie ${copiesTraitees[j].idcopie} : ${similarite.toFixed(2)} %`
        );
        if (similarite > 65) {
          console.warn(
            `⚠️⚠️⚠️  Plagiat détecté entre copie ${copiesTraitees[i].idcopie} et copie ${copiesTraitees[j].idcopie} (similarité : ${similarite.toFixed(2)} %)`
          );
          const plagiatRow = await plagiatModel.createPlagiat(similarite);
          // plagiatRow contiendra l'objet inséré, dont plagiatRow.idplagiat
          
          // 2) Enregistrer la copie i
          await plagiatCopieModel.createPlagiatCopie(
            plagiatRow.idplagiat,
            copiesTraitees[i].idutilisateur, // Adapter si vous avez l'id utilisateur
            copiesTraitees[i].idsujet,       // Adapter si vous stockez l'id sujet
            copiesTraitees[i].idcopie,
            similarite
          );
        
          // 3) Enregistrer la copie j
          await createPlagiatCopie(
            plagiatRow.idplagiat,
            copiesTraitees[j].idutilisateur,
            copiesTraitees[j].idsujet,
            copiesTraitees[j].idcopie,
            similarite
          );
          // Ici, vous pouvez ajouter le code pour enregistrer le cas en base de données.
        }
      }
    }
  };
  