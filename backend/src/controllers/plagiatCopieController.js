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
    
    const copies = await getAllCopieByIdSujet(idsujet);
    const copiesTraitees = [];
    for (const copie of copies) {
      const texte = await extraireTextFromPdf(copie.urlcopie);
      const ensembleMots = new Set(cleanText(texte));
      copiesTraitees.push({ ...copie, texte, ensembleMots });
    }
  
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
          const plagiatExists = await plagiatCopieModel.checkIfPlagiatExist(copiesTraitees[i].idcopie, copiesTraitees[j].idcopie);

          if (!plagiatExists) {
            
            const plagiatRow = await plagiatModel.createPlagiat(similarite);
            await plagiatCopieModel.createPlagiatCopie(
              plagiatRow.idplagiat,
              copiesTraitees[i].idutilisateur,
              copiesTraitees[i].idsujet,
              copiesTraitees[i].idcopie,
              similarite,
              copiesTraitees[j].idutilisateur,
              copiesTraitees[j].idsujet,
              copiesTraitees[j].idcopie,
              similarite
            );
          } else {
            console.log("Le cas de plagiat entre ces copies a déjà été enregistré.");
          }
        }
      }
    }
  };
  