import * as Ideas from './model.js';

export async function listIdeas(req, res) {
  try {
        const [ideas] = await Ideas.getAllIdeas();
        res.status(200).json(ideas);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
}

export async function getIdea(req, res) {
    const id = req.query.id;
    try {
        const [rows] = await Ideas.getIdea(id);
        if (!rows.length) return res.status(404).json({ error: 'Idée non trouvée' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
}

export async function addIdea(req, res) {
    const { title, content, category_id, user_id } = req.body;
    try {
        await Ideas.createIdea(title, content, category_id, user_id);
        res.status(201).send('Idée créée avec succès');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
}