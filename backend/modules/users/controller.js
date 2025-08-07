import UserModel from './model.js'
import argon2 from "argon2"
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

class UserController{

createUser = async (req, res) => {
  try {
    const { lastname, firstname, email, password, confirmPassword } = req.body;

    if (!lastname || !firstname || !email || !password ||!confirmPassword) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }
  if(password !==confirmPassword){
    return res.status(400).json({ message: 'Les mots de passe doivent être identiques' })
  }
    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    const hashedPassword = await argon2.hash(password);
    
  
    const result = await UserModel.createUser({lastname, firstname, email,
      password: hashedPassword});

    if (!result.success) {
     
      return res.status(400).json({ error: result.error });
    }
  const verificationToken = jwt.sign({
      id: result.userId
    },
  process.env.JWT_SECRET,
{expiresIn: '1d'})
const CLIENT_URL = process.env.CLIENT_URL;

const verificationUrl = `${CLIENT_URL}/verify?token=${verificationToken}`;
await sendEmail({
  to: email,
  subject: 'Verification de votre compte',
  html: `Bonjour ${firstname},<br><br>
      Veuillez cliquer sur le lien suivant pour vérifier votre compte : 
      <a href="${verificationUrl}">Vérifier mon compte</a><br><br>
      Si vous n'avez pas créé ce compte, veuillez ignorer cet email.`

})
return res.status(201).json({message: 'Utilisateur créé avec succès. Vérifiez votre email.'})
  } catch (error) {
    console.error('Erreur lors de l’enregistrement :', error.message);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

 async  verifyEmail(req, res) {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    if (!decoded.id) {
      return res.status(400).json({ message: 'Token invalide' });
    }

    const user = await UserModel.findUserById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Votre compte est déjà vérifié' });
    }

    await UserModel.markUserAsVerified(user.id); 

    res.json({ message: 'Votre compte a été vérifié avec succès' });

  } catch (error) {
    console.error("Erreur lors de la vérification de l'email:", error);
    res.status(500).json({ message: "Erreur lors de la vérification de l'email" });
  }
}


 async loginUser(req, res) {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs' });
    }

    
    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Veuillez vérifier votre compte avant de vous connecter' });
    }

   
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

   
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.firstname },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 604800000,
    });

    
    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        name: user.firstname,
        lastname: user.lastname,
        email: user.email,
        
      },
      token,
    });

  } catch (error) {
    console.error('Erreur login :', error.message);
    res.status(500).json({ message: 'Erreur lors de la connexion de l\'utilisateur' });
  }
}

async  requestPasswordReset(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Veuillez fournir un email' });
  }

  try {
    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
const CLIENT_URL=process.env.CLIENT_URL
    const resetToken = crypto.randomBytes(32).toString('hex');
    await UserModel.savePasswordResetToken(user.id, resetToken);

    const resetUrl = `${CLIENT_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `Bonjour ${user.firstname},<br><br>
        Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe : 
        <a href="${resetUrl}">Réinitialiser mon mot de passe</a><br><br>
        Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.`,
    });

    res.json({ message: 'Email de réinitialisation envoyé avec succès' });

  } catch (error) {
    console.error('Erreur demande reset password :', error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

 async  resetPassword(req, res) {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res.status(400).json({ message: 'Veuillez fournir un mot de passe et sa confirmation' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Les mots de passe doivent être identiques' });
  }

  try {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserModel.findUserByResetToken(resetTokenHash);

    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré' });
    }

    await UserModel.updateUserPassword(user.id, password);

    res.json({ message: 'Mot de passe réinitialisé avec succès' });

  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la réinitialisation' });
  }
}



/* async  resendVerificationEmail(req, res) {
  const { email } = req.body;

  try {
    const user = await UserModel.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Ce compte est déjà vérifié." });
    }

    const verificationToken = generateVerificationToken(user.id); 
    const verificationUrl = `${process.env.CLIENT_URL}/api/users/verify/${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: "Nouveau lien de vérification",
      html: `Bonjour ${user.firstname},<br><br>
        Voici un nouveau lien pour vérifier votre compte : 
        <a href="${verificationUrl}">Vérifier mon compte</a><br><br>
        Ce lien est valable 24h.`,
    });

    res.json({
      message: "Un nouveau lien de vérification a été envoyé à votre email.",
    });

  } catch (error) {
    console.error("Erreur lors du renvoi de l’email :", error);
    res.status(500).json({
      message: "Erreur lors de l’envoi du lien de vérification.",
    });
  }
} */


 async  logoutUser(req, res) { 
    try {
        res.clearCookie('token', { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict', 
        });
        res.status(200).json({ message: 'Déconnexion réussie' }); 
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error); 
        res.status(500).json({ message: 'Erreur lors de la déconnexion' }); 
    }





}
}

export default new UserController