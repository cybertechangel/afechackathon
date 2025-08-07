import { Link } from "react-router-dom"

const Header = () => {
    return (
          <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div style={{ justifyContent: "space-around" }} className="container-fluid ">              
               <Link className="navbar-brand" to="/">Boite à idée</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse mx-5" id="navbarSupportedContent">
                    <ul style={{ width: "100%", justifyContent: "space-between" }} className="navbar-nav me-auto mb-2 mb-lg-0  ">
                        <li className="nav-item ">
                            <Link className="nav-link" to="/ideas">Idees</Link> 
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/register">Créer un compte</Link>                             
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Se Connecter</Link>                            
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Header