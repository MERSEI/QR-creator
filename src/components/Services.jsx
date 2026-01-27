function Services() {
  return (
    <section id="services" className="section-muted-bg">
      <div className="container">
        <h2 className="section-title">Чем могу помочь</h2>
        <p className="section-subtitle">
          Делаю QR‑коды не просто «чёрным квадратом», а частью вашего визуала —
          при этом код стабильно читается с камер смартфонов.
        </p>

        <div className="services-grid">
          <article className="service-card">
            <h3 className="service-title">Новый дизайн QR с нуля</h3>
            <p className="service-text">
              Разрабатываю внешний вид QR под ваш бренд: цвета, форма модулей,
              рамка, лого. Подходит для визиток, лендингов, соцсетей и меню.
            </p>
          </article>

          <article className="service-card">
            <h3 className="service-title">Редизайн существующего QR</h3>
            <p className="service-text">
              Беру ваш действующий QR и аккуратно «упаковываю» его в дизайн,
              соблюдая тихую зону и контраст, чтобы код продолжал уверенно
              сканироваться.
            </p>
          </article>

          <article className="service-card">
            <h3 className="service-title">Серия QR для кампаний</h3>
            <p className="service-text">
              Собираю набор QR‑кодов в едином стиле: для афиш, упаковки, наклеек
              и мерча. Каждый код визуально отличается, но считывается без
              проблем.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Services;
