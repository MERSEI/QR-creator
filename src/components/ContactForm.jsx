import { useForm } from "@formspree/react";

function ContactForm() {
  const [state, handleSubmit] = useForm("xlgbwkgr");

  return (
    <section id="contact" className="contact-section">
      <div className="container contact-inner">
        <div>
          <h2 className="section-title">Оставить заявку</h2>
          <p className="section-subtitle">
            Напишите, какой QR вам нужен и как удобнее связаться. Я прочитаю
            заявку и вернусь с вопросами или первым предложением по дизайну.
          </p>
          <p className="helper-text">
            Обычно отвечаю в течение дня. Если задача срочная — можно сразу
            указать дедлайн.
          </p>
        </div>

        <div className="contact-card">
          {state.succeeded ? (
            <p className="form-status form-status--success">
              Заявка отправлена. Я свяжусь с вами как можно раньше.
            </p>
          ) : (
            <form
              id="contact-form"
              onSubmit={handleSubmit}
              className="form-grid"
            >
              <div className="form-row-2">
                <div>
                  <label htmlFor="name">Имя</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    className="input"
                    placeholder="Как к вам обращаться"
                  />
                </div>

                <div>
                  <label htmlFor="contact">
                    Контакт(Telegram/WhatsApp/email)
                  </label>
                  <input
                    id="contact"
                    type="text"
                    name="contact"
                    required
                    className="input"
                    placeholder="@username или номер / почта"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="taskType">Тип задачи</label>
                <select
                  id="taskType"
                  name="taskType"
                  className="select"
                  defaultValue="new"
                >
                  <option value="new">Новый дизайн QR</option>
                  <option value="redesign">Редизайн текущего QR</option>
                  <option value="series">Серия QR для кампании</option>
                </select>
              </div>

              <div>
                <label htmlFor="details">Кратко о задаче</label>
                <textarea
                  id="details"
                  name="details"
                  rows="4"
                  className="textarea"
                  placeholder="Например: «нужен QR на визитку, ведёт на сайт. Цвета: чёрный + неоновый зелёный»"
                />
                <p className="helper-text">
                  Можно сразу приложить ссылку, куда будет вести QR, и описать,
                  на каких носителях он будет.
                </p>
              </div>

              <button type="submit" className="btn" disabled={state.submitting}>
                Запросить дизайн QR
              </button>

              {state.errors?.length > 0 && (
                <p className="form-status form-status--error">
                  Не удалось отправить форму. Попробуйте ещё раз или напишите
                  напрямую.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
