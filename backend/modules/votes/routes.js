import express from 'express'
import { createVote, deleteVote, getVoteCount, checkVote } from './controller.js'

// Créer un router pour les votes
const router = express.Router()

// Route pour ajouter un vote
// POST /votes
router.post('/', createVote)

// Route pour supprimer un vote
// DELETE /votes
router.delete('/', deleteVote)

// Route pour compter les votes d'une idée
// GET /votes/count/123 (où 123 est l'ID de l'idée)
router.get('/count/:ideaId', getVoteCount)

// Route pour vérifier si un utilisateur a voté
// GET /votes/check/456/123 (où 456 = userId et 123 = ideaId)
router.get('/check/:userId/:ideaId', checkVote)

// Exporter le router pour l'utiliser dans server.js
export default router