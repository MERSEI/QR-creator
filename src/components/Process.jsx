function Process() {
  return (
    <section id="process" className="section-muted-bg">
      <div className="container">
        <h2 className="section-title">Как всё проходит</h2>
        <p className="section-subtitle">
          Делаю процесс простым: вы описываете задачу, я возвращаю аккуратный
          QR‑код с рекомендациями по использованию.
        </p>

        <div className="process-steps">
          <div className="process-step">
            <div className="process-step-num">1</div>
            <h3 className="process-step-title">Заявка</h3>
            <p className="process-step-text">
              Оставляете контакты и пару строк о задаче: куда ведёт QR и где
              будет размещён.
            </p>
          </div>

          <div className="process-step">
            <div className="process-step-num">2</div>
            <h3 className="process-step-title">Обсуждение деталей</h3>
            <p className="process-step-text">
              Связываюсь с вами, уточняю носители, прошу логотип и базовый
              бренд‑гайд, если он есть.
            </p>
          </div>

          <div className="process-step">
            <div className="process-step-num">3</div>
            <h3 className="process-step-title">Дизайн QR</h3>
            <p className="process-step-text">
              Собираю варианты оформления, проверяю читаемость кода и отправляю
              вам на согласование.
            </p>
          </div>

          <div className="process-step">
            <div className="process-step-num">4</div>
            <h3 className="process-step-title">Готовые файлы</h3>
            <p className="process-step-text">
              Отдаю PNG и SVG, плюс короткий гайд по размеру, цветам и
              размещению кода на носителях.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Process;
