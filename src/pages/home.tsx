import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  return (
    <div className="container">

      {/* LOGO */}
      <img src="/assets/logo.png" className="logo" />
      <p className="since">Dal 2011</p>

      {/* HERO */}
      <div className="hero">
        <h1 className="title glow">
          L’unico concorso nazionale che incorona la vera regina frociarola d’Italia
        </h1>

        <p className="subtitle">
          Trash. Glamour. Caos. Cultura Pop.
        </p>

        <button className="cta">
          ENTRA NEL MAIN STAGE ✨
        </button>
      </div>

      {/* MENU */}
      <div className="menu">
        <button onClick={() => nav("/vota")}>💄 Vota Ora</button>
        <button onClick={() => nav("/quiz")}>✨ Che Frociarola Sei?</button>
        <button onClick={() => nav("/roast")}>🔥 Roast Generator</button>
        <button onClick={() => nav("/amico")}>👑 Amico Gay</button>
        <button onClick={() => nav("/game")}>🎮 Salva La Diamond</button>
        <button onClick={() => nav("/iscrizione")}>💋 Iscriviti</button>
        <button onClick={() => nav("/hall")}>🏆 Hall of Fame</button>
      </div>

      {/* SOCIAL */}
      <h2>Seguici ovunque</h2>
      <button className="social">Instagram</button>
      <button className="social">TikTok</button>
      <button className="social">Facebook</button>

      {/* FOOTER */}
      <footer>
        <p>missfrociarolaitalia@gmail.com</p>
        <p>May the best Frociarola win</p>
      </footer>

    </div>
  );
}
