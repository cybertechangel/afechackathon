import { useState, useEffect } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import FormIdeas from "../components/Ideas/formideas";
import InputIdea from "../components/Ideas/inputidea";

const Ideas = () => {
  // État pour stocker toutes les idées récupérées de l'API
  const [ideas, setIdeas] = useState([]);

  // État pour stocker toutes les catégories disponibles
  const [categories, setCategories] = useState([]);

  // État pour stocker la catégorie sélectionnée pour le filtrage
  // null signifie "Toutes les catégories"
  const [selectedCategory, setSelectedCategory] = useState(null);

  // État pour stocker le texte de recherche
  const [searchTerm, setSearchTerm] = useState("");

  // État pour les idées filtrées (celles qui seront affichées)
  const [filteredIdeas, setFilteredIdeas] = useState([]);

  // Fonction pour récupérer toutes les idées depuis l'API
  const fetchIdeas = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ideas/getIdeas`);
      if (!res.ok) throw new Error("Erreur lors du chargement des idées");
      const data = await res.json();
      setIdeas(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction pour récupérer toutes les catégories depuis l'API
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/getCategories`);

      if (!res.ok) throw new Error("Erreur lors du chargement des catégories");
      const data = await res.json();
      // L'API retourne un format spécial, on prend le premier élément du tableau
      setCategories(data[0] || []);
    } catch (error) {
      console.error("Erreur chargement catégories:", error);
    }
  };

  // Fonction pour filtrer les idées selon la catégorie ET la recherche
  const filterIdeas = () => {
    // Commencer avec toutes les idées
    let filtered = ideas;

    // 1. Filtrer par catégorie si une catégorie est sélectionnée
    if (selectedCategory !== null) {
      filtered = filtered.filter(idea => idea.category_id === selectedCategory);
    }

    // 2. Filtrer par recherche si du texte est saisi
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(idea => {
        // Rechercher dans le titre ET le contenu (insensible à la casse)
        const titleMatch = idea.title.toLowerCase().includes(searchTerm.toLowerCase());
        const contentMatch = idea.content.toLowerCase().includes(searchTerm.toLowerCase());
        return titleMatch || contentMatch;
      });
    }

    // Mettre à jour les idées filtrées
    setFilteredIdeas(filtered);
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchIdeas();
    fetchCategories();
  }, []);

  // Filtrer les idées quand les idées, la catégorie ou la recherche changent
  useEffect(() => {
    filterIdeas();
  }, [ideas, selectedCategory, searchTerm]);

  // Fonction pour gérer le changement de catégorie sélectionnée
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <>
      <Header />
      <InputIdea onNewIdea={fetchIdeas} />

      {/* Section de recherche et filtrage */}
      <div className="container my-4">
        <div className="row">
          <div className="col-12">
            {/* Barre de recherche */}
            <div className="mb-4">
              <h5>Rechercher une idée :</h5>
              <input
                type="text"
                className="form-control"
                placeholder="Tapez votre recherche (titre ou contenu)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* Affichage du texte recherché */}
              {searchTerm && (
                <small className="text-muted">
                  Recherche active : "{searchTerm}"
                </small>
              )}
            </div>

            {/* Filtres par catégories */}
            <h5>Filtrer par catégorie :</h5>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {/* Bouton pour afficher toutes les catégories */}
              <button
                className={`btn ${selectedCategory === null ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleCategoryChange(null)}
              >
                Toutes les catégories ({ideas.length})
              </button>

              {/* Boutons pour chaque catégorie disponible */}
              {categories.map((category) => {
                // Compter combien d'idées appartiennent à cette catégorie
                const ideaCount = ideas.filter(idea => idea.category_id === category.id).length;

                return (
                  <button
                    key={category.id}
                    className={`btn ${selectedCategory === category.id ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name} ({ideaCount})
                  </button>
                );
              })}
            </div>

            {/* Affichage du nombre d'idées filtrées */}
            <p className="text-muted">
              {searchTerm && selectedCategory !== null
                ? `Résultats pour "${searchTerm}" dans la catégorie sélectionnée (${filteredIdeas.length})`
                : searchTerm
                ? `Résultats pour "${searchTerm}" (${filteredIdeas.length})`
                : selectedCategory !== null
                ? `Affichage des idées de la catégorie sélectionnée (${filteredIdeas.length})`
                : `Affichage de toutes les idées (${filteredIdeas.length})`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Affichage des idées filtrées au lieu de toutes les idées */}
      <FormIdeas ideas={filteredIdeas} />
      <Footer />
    </>
  );
};

export default Ideas;
