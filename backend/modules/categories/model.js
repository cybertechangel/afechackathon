import db_sql from '../../database.js'

export default class CategoriesModel{
    static async getCategories() {
        const response = await db_sql.query('SELECT * FROM categories')
        return response
    }

    /*static async postCategories({name}) {
        const query = `INSERT INTO categories (name) VALUES (?)`;
        const values = [name];
        const response = await db_sql.query(query, values);
        return {
            id : response.insertId,
            name
        }
    }*/
}