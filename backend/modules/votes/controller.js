import { countVotesByIdea, checkUserVote, addVote, removeVote } from './model.js'

// Controller pour ajouter un vote
const createVote = async (req, res) => {
    try {
        // Récupérer les données envoyées par l'utilisateur
        const { user_id, idea_id } = req.body

        // Vérifier que les données sont présentes
        if (!user_id || !idea_id) {
            return res.status(400).json({
                success: false,
                message: 'user_id et idea_id sont obligatoires'
            })
        }

        // Appeler la fonction du model pour ajouter le vote
        const result = await addVote(user_id, idea_id)

        // Renvoyer la réponse selon le résultat
        if (result.success) {
            res.status(201).json({
                success: true,
                message: 'Vote ajouté avec succès',
                voteId: result.voteId
            })
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            })
        }
    } catch (error) {
        console.log('Erreur dans createVote:', error)
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        })
    }
}

// Controller pour supprimer un vote
const deleteVote = async (req, res) => {
    try {
        // Récupérer les données de la requête
        const { user_id, idea_id } = req.body

        // Vérifier que les données sont présentes
        if (!user_id || !idea_id) {
            return res.status(400).json({
                success: false,
                message: 'user_id et idea_id sont obligatoires'
            })
        }

        // Appeler la fonction du model pour supprimer le vote
        const result = await removeVote(user_id, idea_id)

        // Renvoyer la réponse
        if (result.success) {
            res.status(200).json({
                success: true,
                message: result.message
            })
        } else {
            res.status(404).json({
                success: false,
                message: result.message
            })
        }
    } catch (error) {
        console.log('Erreur dans deleteVote:', error)
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        })
    }
}

// Controller pour compter les votes d'une idée
const getVoteCount = async (req, res) => {
    try {
        // Récupérer l'ID de l'idée depuis l'URL
        const { ideaId } = req.params

        // Vérifier que l'ID est présent
        if (!ideaId) {
            return res.status(400).json({
                success: false,
                message: 'ID de l\'idée obligatoire'
            })
        }

        // Appeler la fonction du model pour compter
        const totalVotes = await countVotesByIdea(ideaId)

        // Renvoyer le résultat
        res.status(200).json({
            success: true,
            ideaId: ideaId,
            totalVotes: totalVotes
        })
    } catch (error) {
        console.log('Erreur dans getVoteCount:', error)
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        })
    }
}

// Controller pour vérifier si un utilisateur a voté
const checkVote = async (req, res) => {
    try {
        // Récupérer les paramètres de l'URL
        const { userId, ideaId } = req.params

        // Vérifier que les paramètres sont présents
        if (!userId || !ideaId) {
            return res.status(400).json({
                success: false,
                message: 'userId et ideaId sont obligatoires'
            })
        }

        // Appeler la fonction du model pour vérifier
        const hasVoted = await checkUserVote(userId, ideaId)

        // Renvoyer le résultat
        res.status(200).json({
            success: true,
            userId: userId,
            ideaId: ideaId,
            hasVoted: hasVoted
        })
    } catch (error) {
        console.log('Erreur dans checkVote:', error)
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        })
    }
}

// Exporter toutes les fonctions du controller
export { createVote, deleteVote, getVoteCount, checkVote }