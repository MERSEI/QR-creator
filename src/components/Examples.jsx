import ex1 from "../assets/img/example-1.png";
import ex2 from "../assets/img/example-2.png";
import ex3 from "../assets/img/example-3.png";

function Examples() {
  return (
    <section id="examples">
      <div className="container">
        <h2 className="section-title">Как это может выглядеть</h2>
        <p className="section-subtitle">
          Несколько примеров того, как QR‑код вписывается в носитель: от визиток
          до постеров. На реальных проектах адаптирую стиль под ваши задачи.
        </p>

        <div className="examples-grid">
          <article className="example-card">
            <div className="example-preview">
              <img src={ex1} alt="QR‑код на визитке" />
            </div>
            <p className="example-caption">
              QR на визитку — ведёт на сайт или Telegram.
            </p>
          </article>

          <article className="example-card">
            <div className="example-preview">
              <img src={ex2} alt="QR‑код на постере" />
            </div>
            <p className="example-caption">
              QR на постер мероприятия — быстрый переход на лендинг.
            </p>
          </article>

          <article className="example-card">
            <div className="example-preview">
              <img src={ex3} alt="QR‑код на упаковке" />
            </div>
            <p className="example-caption">
              QR на упаковке — инструкция, промо‑страница или соцсети бренда.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Examples;
