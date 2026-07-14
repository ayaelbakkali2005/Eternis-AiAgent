import "./Accueil.css";
import { Link } from "react-router-dom";

import logo from "../assets/eternis-logo.png";
import background from "../assets/city-bg.jpg";
import globe from "../assets/globe.png";
import bot from "../assets/bot.png";

import {
  FaSun,
  FaChevronDown,
  FaPlayCircle,
  FaArrowRight
} from "react-icons/fa";

function Accueil() {
  return (
    <div
      className="home"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">

          <img src={logo} alt="Eternis" />

          <div>

            <h2>ETERNIS</h2>

            <span>SMART BUSINESS SOLUTIONS</span>

          </div>

        </div>

        <ul className="nav-links">

          <li className="active">Accueil</li>

          <li>Fonctionnalités</li>

          <li>Solutions</li>

          <li>Tarifs</li>

          <li>À propos</li>

          <li>
  <Link to="/contact">Contact</Link>
</li>

        </ul>

        <div className="navbar-actions">

          <button className="icon-btn">
            <FaSun />
          </button>

          <button className="lang-btn">
            FR <FaChevronDown />
          </button>

          <Link
            to="/login"
            className="login-btn"
          >
            Se connecter
          </Link>

          <Link
            to="/signup"
            className="demo-btn"
          >
            Demander une démo
          </Link>

        </div>

      </nav>

      {/* ================= HERO ================= */}

      <section className="hero">

        {/* LEFT */}

        <div className="hero-left">

          <div className="hero-badge">
            ✨ PLATEFORME INTELLIGENTE POUR ENTREPRISES
          </div>

          <h1>
            Gérez votre entreprise
            <br />
            plus <span>intelligemment</span>
            <br />
            avec l'IA
          </h1>

          <div className="line"></div>

          <p>
            Eternis centralise vos données,
            automatise vos tâches et vous aide à
            prendre de meilleures décisions grâce
            à l'intelligence artificielle.
          </p>

          <div className="hero-buttons">

            <Link
              to="/signup"
              className="primary-btn"
            >
              Commencer gratuitement
              <FaArrowRight />
            </Link>

            <button className="secondary-btn">
              <FaPlayCircle />
              Voir la démo
            </button>

          </div>
                    <div className="hero-stats">

            <div>
              <h2>12K+</h2>
              <span>Companies</span>
            </div>

            <div>
              <h2>98%</h2>
              <span>Satisfaction</span>
            </div>

            <div>
              <h2>24/7</h2>
              <span>AI Support</span>
            </div>

          </div>

        </div>


       {/* ================= RIGHT ================= */}

<div className="hero-right">

  <div className="glow-circle"></div>

  <img
    src={globe}
    alt="AI Globe"
    className="globe"
  />

  <img
    src={bot}
    alt="AI Robot"
    className="robot"
  />

  <div className="floating-card top-card">
    <h4>AI Dashboard</h4>
    <p>Business Overview</p>
    <span>Live</span>
  </div>

  <div className="floating-card right-card">
    <h4>Analytics</h4>
    <p>Revenue Growth</p>
    <span>+18.6%</span>
  </div>

  <div className="floating-card bottom-card">
    <h4>AI Assistant</h4>
    <p>Online 24/7</p>
  </div>

</div>
      </section>
            {/* ================= ADVANTAGES ================= */}

<section className="advantages">

  <div className="adv-card">
    <div className="icon">🛡️</div>
    <div>
      <h3>Sécurisé</h3>
      <p>Données protégées et conformes</p>
    </div>
  </div>

  <div className="adv-card">
    <div className="icon">⚡</div>
    <div>
      <h3>Performant</h3>
      <p>Gain de temps et productivité</p>
    </div>
  </div>

  <div className="adv-card">
    <div className="icon">🧠</div>
    <div>
      <h3>Intelligent</h3>
      <p>Piloté par l'IA pour mieux décider</p>
    </div>
  </div>

  <div className="adv-card">
    <div className="icon">📈</div>
    <div>
      <h3>Évolutif</h3>
      <p>Adapté à vos besoins et à votre croissance</p>
    </div>
  </div>

</section>

<h2 className="trusted-title">
  Ils nous font confiance
</h2>

<div className="trusted-logos">

  <span>TechnoSoft</span>
  <span>NOVATECH</span>
  <span>DIGITEX</span>
  <span>ProBusiness</span>
  <span>InnovaCorp</span>
  <span>DATAFLOW</span>

</div>

      
 


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="footer-left">

          <img
            src={logo}
            alt="Eternis"
          />

          <div>

            <h3>ETERNIS</h3>

            <span>
              SMART BUSINESS SOLUTIONS
            </span>

          </div>

        </div>

        <div className="footer-links">

          <a href="/">Accueil</a>

          <a href="/">Solutions</a>

          <a href="/">Fonctionnalités</a>

          <a href="/">Contact</a>

        </div>

        <p>

          © 2026 Eternis.
          All rights reserved.

        </p>

      </footer>

    </div>

  );

}

export default Accueil;