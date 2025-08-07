import db_sql from '../../database.js'

export default class CommentsModel {
    static async getComments() {
        const response = await db_sql.query('SELECT * FROM comments')
        return response
    }

    static async postComments({ idea_id, user_id, content }) {
        const query = `INSERT INTO comments (idea_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())`;
        const values = [idea_id, user_id, content];
        const response = await db_sql.query(query, values);
        return {
            id: response.insertId,
            idea_id,
            user_id,
            content,
            created_at: new Date()
        };
    }
}