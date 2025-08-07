import jwt from 'jsonwebtoken'
function authenticateToken(req, res, next) {
  const token = req.cookies?.token; 

  
  const JWT_SECRET = "monsecretjwt123";

  if (!token) {
    return res.status(401).json({ error: "Accès refusé : token manquant" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log(req.user)
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token invalide ou expiré" });
  }
}

export default authenticateToken;