import { useState } from "react";

const PLANS = [
  {
    id: "single",
    name: "1 QR-код",
    price: "€10",
    period: "разовая оплата",
    features: ["1 QR-код любой сложности", "Кастомные цвета и размер", "Скачивание PNG"],
    cta: "Оплатить €10",
  },
  {
    id: "unlimited",
    name: "Безлимит",
    price: "€20",
    period: "в месяц",
    recommended: true,
    features: [
      "Безлимитные QR-коды",
      "Кастомные цвета и размер",
      "Скачивание PNG",
      "Приоритетная поддержка",
      "Экспорт SVG (скоро)",
    ],
    cta: "Подключить за €20/мес",
  },
];

export default function PricingModal({ onClose, onSuccess }) {
  const [selected, setSelected] = useState("unlimited");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [apiError, setApiError] = useState(null);

  async function handlePay() {
    setPaying(true);
    setApiError(null);

    try {
      // STUB: в production здесь будет Stripe Checkout / PaymentIntent
      // Для демо — имитируем успешную оплату
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selected,
          paymentToken: "demo-token", // stub
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Ошибка при оформлении подписки.");
        return;
      }

      setPaid(true);
      setTimeout(() => {
        onSuccess?.({
          plan: data.plan,
          credits: data.credits,
          expiresAt: data.expiresAt,
          canGenerate: data.canGenerate,
          freeRemaining: 0,
        });
      }, 1800);
    } catch {
      setApiError("Не удалось подключиться к серверу.");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>

        {paid ? (
          <div className="modal-success">
            <div className="success-icon">✓</div>
            <h2>Оплата прошла успешно!</h2>
            <p>
              {selected === "unlimited"
                ? "Безлимитный план активирован на 30 дней."
                : "1 QR-кредит добавлен на ваш аккаунт."}
            </p>
            <p className="modal-success-note">Перенаправляем...</p>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2>Выберите план</h2>
              <p>Первый QR — всегда бесплатно. Дальше — гибкие опции.</p>
            </div>

            {/* Demo notice */}
            <div className="demo-notice">
              <span className="demo-icon">🛠</span>
              <span>
                <strong>Демо-режим.</strong> Оплата эмулируется — реальных списаний нет.
                В production здесь будет Stripe.
              </span>
            </div>

            <div className="plan-cards">
              {PLANS.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  className={`plan-card ${selected === plan.id ? "selected" : ""} ${plan.recommended ? "recommended" : ""}`}
                  onClick={() => setSelected(plan.id)}
                >
                  {plan.recommended && (
                    <span className="plan-recommended-badge">Популярный</span>
                  )}
                  <div className="plan-card-header">
                    <span className="plan-name">{plan.name}</span>
                    <div className="plan-price-wrap">
                      <span className="plan-price">{plan.price}</span>
                      <span className="plan-period">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="plan-features">
                    {plan.features.map((f) => (
                      <li key={f}>
                        <span className="feature-check">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            {apiError && <p className="gen-error">{apiError}</p>}

            <button
              className="btn btn--full"
              onClick={handlePay}
              disabled={paying}
            >
              {paying ? <span className="spinner" /> : PLANS.find((p) => p.id === selected)?.cta}
            </button>

            <p className="modal-fine-print">
              Нажимая кнопку, вы соглашаетесь с условиями использования.
              Безлимитный план автоматически продлевается через 30 дней.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
