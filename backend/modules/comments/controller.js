import CommentsModel from './model.js'

export default class CommentController{
    static async getComments(req, res){
        try{
            const comments = await CommentsModel.getComments()
            res.status(200).json(comments)
        } catch (error){
            console.error('CommentsController.getComment :', error)
            res.status(500).json({message : error})
        }
    }

    static async postComments (req, res){
        try{
            const {idea_id, user_id, content} = req.body
            const newComments = await CommentsModel.postComments({ idea_id, user_id, content})
            res.status(200).json(newComments)
        } catch (error){
            console.error('CommentsController.postComment :', error)
            res.status(500).json({message : "Erreur lors de l'ajout du commentaire"})
        }
    }
}