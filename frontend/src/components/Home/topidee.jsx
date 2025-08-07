import { Link } from "react-router-dom"

const TopIdee = () => {
    return(
        <div className="container mt-5 mb-5">
            <h2>Top 3 des idées </h2>
            <ul>
                <li>1</li>
                <li>2</li>
                <li>3</li>
            </ul>
            <Link to='/idee' style={{color:'black'}}>Voir plus</Link>
        </div>

    )
}

export default TopIdee