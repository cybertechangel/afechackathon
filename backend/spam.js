import { createAnnonce } from "./models/annonceModel.js"; // adapte le chemin si besoin

const insertFakeAnnonces = async () => {
  for (let i = 1; i <= 1000; i++) {
    const fakeAnnonce = {
      categorie: `Catégorie ${i % 5}`, // 5 catégories aléatoires
      titre: `Titre de l'annonce ${i}`,
      description: `Ceci est la description numéro ${i}`,
    };

    try {
      const id = await createAnnonce(fakeAnnonce);
      console.log(` Annonce ${id} créée`);
    } catch (err) {
      console.error(` Erreur à l'insertion de l'annonce ${i}`, err);
    }
  }

  console.log(" Insertion terminée.");
};

insertFakeAnnonces();