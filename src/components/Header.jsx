import heroQr from "../assets/img/hero-qr.png";

function Header() {
  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="hero">
      <div className="container hero-inner">
        <div className="hero-left">
          <div className="hero-kicker">
            <span className="hero-kicker-dot" />
            <span>Дизайнерские QR‑коды под ваш бренд</span>
          </div>

          <h1 className="hero-title">
            Делаю аккуратные QR‑коды, которые не стыдно ставить на дизайн.
          </h1>

          <p className="hero-text">
            Оформлю или переработаю ваш QR: визитки, упаковка, афиши, digital.
            Красиво, в стиле бренда и без потери сканируемости.
          </p>

          <div className="hero-cta-row">
            <button className="btn" type="button" onClick={scrollToContact}>
              Оставить заявку
            </button>
            <p className="hero-note">
              Отвечу лично в течение дня. Связаться можно будет в Telegram,
              WhatsApp или по e‑mail.
            </p>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card">
            <div className="hero-card-inner">
              <div className="hero-qr-wrap">
                <img src={heroQr} alt="Пример дизайнерского QR‑кода" />
              </div>
              <p className="hero-card-caption">
                Пример живого QR‑кода в стиле лендинга. Такой же аккуратный код
                могу собрать под ваши задачи.
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
