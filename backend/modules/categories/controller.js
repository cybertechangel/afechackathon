import CategoriesModel from './model.js'

export default class CategoriesController{
    static async getCategories(req, res){
        try{
            const categories = await CategoriesModel.getCategories()
            res.status(200).json(categories)
        } catch (error){
            console.error('CategoriesController.getComment :', error)
            res.status(500).json({message : error})
        }
    }

    /*static async postCategories (req, res){
        try{
            const {name} = req.body
            const newCategories = await CategoriesModel.postCategories({name})
            res.status(200).json(newCategories)
        } catch (error){
            console.error('CategoriesController.postComment :', error)
            res.status(500).json({message : "Erreur lors de l'ajout de la categories"})
        }
    }*/
}