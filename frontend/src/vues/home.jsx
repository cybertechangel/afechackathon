import Footer from "../components/footer"
import Header from "../components/header"
import Presentation from "../components/Home/presentation"
import TopIdee from "../components/Home/topidee"

const Home = () => {
    return (
        <div>
            <Header />
            <Presentation/>
            <TopIdee/>
            <Footer/>
        </div>
    )
}

export default Home