import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  User,
  Building2,
  Briefcase,
  ChevronDown,
  PenLine,
  Send,
  Lock,
  Headphones,
  MessageCircle,
  ArrowRight,
  Sun,
} from "lucide-react";
import "./contact.css";

const NAV_LINKS = [
   { label: "Accueil", active: false },
  { label: "Fonctionnalités", active: false },
  { label: "Solutions", active: false },
  { label: "Tarifs", active: false },
  { label: "À propos", active: false },
  { label: "Contact", active: true },
];

const INFO_ITEMS = [
  {
    icon: Mail,
    title: "Email",
    lines: ["contact@eternis.com"],
  },
  {
    icon: Phone,
    title: "Téléphone",
    lines: ["+212 6 12 34 56 78"],
  },
  {
    icon: MapPin,
    title: "Adresse",
    lines: ["Technopark, Bâtiment C, 3ᵉ étage", "90000 Tanger, Maroc"],
  },
  {
    icon: Clock,
    title: "Horaires",
    lines: ["Lundi - Vendredi : 9h00 - 18h00"],
  },
];

export default function ContactPage() {
  return (
    <div className="ct-page">
      <div className="ct-shell">
        {/* Header */}
        <header className="ct-header">
          <div className="ct-logo">
            <div className="ct-logo-mark">E</div>
            <div className="ct-logo-text">
              <div className="name">ETERNIS</div>
              <div className="tag">SMART BUSINESS SOLUTIONS</div>
            </div>
          </div>

          <nav className="ct-nav">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href="#" className={l.active ? "active" : ""}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="ct-actions">
            <div className="ct-icon-btn"><Sun size={17} /></div>
            <div className="ct-lang">FR <ChevronDown size={14} /></div>
            <button className="ct-btn-outline">Se connecter</button>
            <button className="ct-btn-gradient">
              Demander une démo <ArrowRight size={15} />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="ct-main">
          {/* Left column */}
          <div className="ct-left">
            <div className="ct-eyebrow">CONTACTEZ-NOUS</div>
            <h1>
              Nous sommes là pour <span className="grad">vous aider.</span>
            </h1>
            <p className="ct-sub">
              Une question, un projet ou besoin d'assistance ? Notre équipe est à votre écoute.
            </p>

            <div className="ct-info-list">
              {INFO_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="ct-info-item" key={item.title}>
                    <div className="ct-info-icon"><Icon size={18} /></div>
                    <div>
                      <h4>{item.title}</h4>
                      {item.lines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="ct-map">
              <MapPin className="ct-map-pin" size={38} fill="url(#pinGrad)" />
              <div className="ct-map-card">
                <div className="pin-mini"><MapPin size={15} /></div>
                <div>
                  <h5>Retrouvez-nous ici</h5>
                  <span>Technopark, Tanger, Maroc</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="ct-card">
              <h2>Envoyez-nous un message</h2>
              <p>
                Remplissez le formulaire et nous vous répondrons dans les plus brefs délais.
              </p>

              <div className="ct-form-row">
                <div className="ct-field">
                  <User size={16} />
                  <input type="text" placeholder="Votre nom" />
                </div>
                <div className="ct-field">
                  <Mail size={16} />
                  <input type="email" placeholder="Votre email" />
                </div>
              </div>

              <div className="ct-field">
                <Building2 size={16} />
                <input type="text" placeholder="Nom de votre entreprise" />
              </div>

              <div className="ct-field select">
                <div className="left">
                  <Briefcase size={16} />
                  <span>Objet</span>
                </div>
                <ChevronDown size={16} />
              </div>

              <div className="ct-textarea">
                <PenLine size={16} />
                <textarea placeholder="Votre message" />
              </div>

              <button className="ct-submit">
                <Send size={16} /> Envoyer le message
              </button>

              <div className="ct-secure">
                <Lock size={13} /> Vos données sont sécurisées et confidentielles.
              </div>
            </div>

            <div className="ct-assist">
              <div className="ct-assist-left">
                <div className="ct-assist-icon"><Headphones size={22} /></div>
                <div>
                  <h4>Besoin d'une assistance rapide ?</h4>
                  <p>Discutez avec notre assistant IA disponible 24/7 pour répondre à vos questions instantanément.</p>
                </div>
              </div>
              <button className="ct-assist-btn">
                <MessageCircle size={16} /> Discuter maintenant
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}