import database from '../../database.js'

// Fonction pour compter le nombre de votes d'une idée
const countVotesByIdea = async (ideaId) => {
    try {
        // Requête SQL simple pour compter les votes
        const [rows] = await database.execute(
            'SELECT COUNT(*) as total FROM votes WHERE idea_id = ?',
            [ideaId]
        )
        // Retourner le nombre total
        return rows[0].total
    } catch (error) {
        console.log('Erreur lors du comptage des votes:', error)
        throw error
    }
}

// Fonction pour vérifier si un utilisateur a déjà voté pour une idée
const checkUserVote = async (userId, ideaId) => {
    try {
        // Chercher si il existe déjà un vote de cet utilisateur pour cette idée
        const [rows] = await database.execute(
            'SELECT id FROM votes WHERE user_id = ? AND idea_id = ?',
            [userId, ideaId]
        )
        // Si on trouve quelque chose, l'utilisateur a déjà voté
        return rows.length > 0
    } catch (error) {
        console.log('Erreur lors de la vérification du vote:', error)
        throw error
    }
}

// Fonction pour ajouter un vote
const addVote = async (userId, ideaId) => {
    try {
        // Vérifier si l'utilisateur existe
        const [userCheck] = await database.execute(
            'SELECT id FROM users WHERE id = ?',
            [userId]
        )
        if (userCheck.length === 0) {
            return { success: false, message: 'Utilisateur inexistant' }
        }

        // Vérifier si l'idée existe
        const [ideaCheck] = await database.execute(
            'SELECT id FROM ideas WHERE id = ?',
            [ideaId]
        )
        if (ideaCheck.length === 0) {
            return { success: false, message: 'Idée inexistante' }
        }

        // D'abord vérifier si l'utilisateur n'a pas déjà voté
        const alreadyVoted = await checkUserVote(userId, ideaId)
        if (alreadyVoted) {
            return { success: false, message: 'Vous avez déjà voté pour cette idée' }
        }

        // Ajouter le vote dans la base
        const [result] = await database.execute(
            'INSERT INTO votes (user_id, idea_id) VALUES (?, ?)',
            [userId, ideaId]
        )

        return { success: true, voteId: result.insertId }
    } catch (error) {
        console.log('Erreur lors de l\'ajout du vote:', error)
        throw error
    }
}

// Fonction pour supprimer un vote
const removeVote = async (userId, ideaId) => {
    try {
        // Supprimer le vote de cet utilisateur pour cette idée
        const [result] = await database.execute(
            'DELETE FROM votes WHERE user_id = ? AND idea_id = ?',
            [userId, ideaId]
        )

        // Vérifier si on a bien supprimé quelque chose
        if (result.affectedRows > 0) {
            return { success: true, message: 'Vote supprimé' }
        } else {
            return { success: false, message: 'Aucun vote à supprimer' }
        }
    } catch (error) {
        console.log('Erreur lors de la suppression du vote:', error)
        throw error
    }
}

// Exporter toutes les fonctions pour les utiliser ailleurs
export { countVotesByIdea, checkUserVote, addVote, removeVote }