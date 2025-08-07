import db_sql from '../../database.js';

export const createIdea = (title, content, category_id, user_id) => {
    return db_sql.query(
        "INSERT INTO ideas (title, content, category_id, user_id, created_at) VALUES (?, ?, ?, ?, NOW())", 
        [title, content, category_id, user_id]
    );
};

export const getAllIdeas = () => {
    return db_sql.query(
        `SELECT ideas.*, categories.name AS category, users.firstname, users.lastname
        FROM ideas
        LEFT JOIN categories ON ideas.category_id = categories.id
        LEFT JOIN users ON ideas.user_id = users.id
        ORDER BY created_at DESC`
    );
};

export const getIdea = (id) => {
    return db_sql.query(
        "SELECT * FROM ideas WHERE id = ?",
        [id]
    );
};
