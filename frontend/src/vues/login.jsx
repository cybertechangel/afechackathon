import React, { useState } from 'react'
import Footer from "../components/footer"
import Header from "../components/header"

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');
  
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
            });
    
            const data = await res.json();
    
            if (res.ok) {
            setMessage(`${data.message}`);
            
            } else {
            setMessage(`${data.error}`);
            }
        } catch (err) {
            console.error(err);
            setMessage('Erreur lors de la connexion.');
        }
    };
  
    return (
        <div>
            <Header />
            <div className="form-container mt-5">
                <h3>Connexion</h3>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mot de passe</label>
                    <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                    <div className="mt-1">
                    <a href="/reset-password-request">Mot de passe oublié ?</a>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Se connecter</button>
            </form>
            {message && <div className="mt-3 alert alert-info">{message}</div>}
            </div>
            <Footer />
        </div>
    );
}
  
export default Login;