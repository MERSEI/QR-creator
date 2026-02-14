import { useState, useRef } from "react";

const SIZES = [
  { label: "S — 200px", value: 200 },
  { label: "M — 400px", value: 400 },
  { label: "L — 600px", value: 600 },
  { label: "XL — 800px", value: 800 },
];

const ERROR_CORRECTIONS = [
  { label: "L — низкое (7%)", value: "L" },
  { label: "M — среднее (15%)", value: "M" },
  { label: "Q — высокое (25%)", value: "Q" },
  { label: "H — максимум (30%)", value: "H" },
];

function StepBadge({ n, active, done }) {
  return (
    <span
      className={`step-badge ${active ? "step-badge--active" : ""} ${done ? "step-badge--done" : ""}`}
    >
      {done ? "✓" : n}
    </span>
  );
}

export default function QRGenerator({ userStatus, onStatusChange, onLimitReached }) {
  const [text, setText] = useState("");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(400);
  const [errorCorrection, setErrorCorrection] = useState("M");
  const [margin, setMargin] = useState(2);
  const [showOptions, setShowOptions] = useState(false);

  const [qrResult, setQrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wasFirst, setWasFirst] = useState(false);

  const imgRef = useRef(null);
  const resultRef = useRef(null);

  const step = qrResult ? 3 : text.trim() ? 2 : 1;

  async function handleGenerate(e) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setQrResult(null);
    setWasFirst(false);

    try {
      const res = await fetch("/api/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          options: { color, bgColor, size, errorCorrection, margin },
        }),
      });

      const data = await res.json();

      if (res.status === 402) {
        onLimitReached?.();
        return;
      }

      if (!res.ok) {
        setError(data.message || "Произошла ошибка. Попробуйте снова.");
        return;
      }

      setQrResult(data.qr);
      setWasFirst(data.wasFirst);
      onStatusChange?.({
        used: data.used,
        plan: data.plan,
        credits: data.credits,
        expiresAt: data.expiresAt,
        canGenerate: data.plan === "unlimited" || data.credits > 0,
        freeRemaining: 0,
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch {
      setError("Не удалось подключиться к серверу. Проверьте интернет-соединение.");
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!qrResult) return;
    const link = document.createElement("a");
    link.href = qrResult;
    const filename = text.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "-") || "qr-code";
    link.download = `${filename}.png`;
    link.click();
  }

  function handleReset() {
    setQrResult(null);
    setError(null);
    setText("");
    setWasFirst(false);
  }

  const canGenerate = userStatus?.canGenerate !== false;
  const isLimited = userStatus && !userStatus.canGenerate;

  return (
    <section className="generator-section">
      <div className="container">
        {/* Hero intro */}
        <div className="gen-hero">
          <div className="gen-hero-kicker">
            <span className="kicker-dot" />
            Онлайн-генератор QR-кодов
          </div>
          <h1 className="gen-hero-title">
            Создайте QR-код<br />
            <span className="accent-text">за несколько секунд</span>
          </h1>
          <p className="gen-hero-sub">
            Введите URL или текст, настройте внешний вид — и скачайте готовый QR.
            Первый — <strong>бесплатно</strong>.
          </p>
        </div>

        {/* Steps */}
        <div className="gen-steps">
          <div className={`gen-step-item ${step >= 1 ? "active" : ""}`}>
            <StepBadge n={1} active={step === 1} done={step > 1} />
            <span>Контент</span>
          </div>
          <div className="step-divider" />
          <div className={`gen-step-item ${step >= 2 ? "active" : ""}`}>
            <StepBadge n={2} active={step === 2} done={step > 2} />
            <span>Параметры</span>
          </div>
          <div className="step-divider" />
          <div className={`gen-step-item ${step >= 3 ? "active" : ""}`}>
            <StepBadge n={3} active={step === 3} done={step === 3} />
            <span>Результат</span>
          </div>
        </div>

        {/* Free tier callout */}
        {userStatus?.freeRemaining > 0 && (
          <div className="free-callout">
            <span className="free-callout-icon">🎁</span>
            <span>
              У вас есть <strong>1 бесплатный QR-код</strong>. Дальше — от €10.
            </span>
          </div>
        )}

        {/* Limit reached banner */}
        {isLimited && (
          <div className="limit-banner">
            <div className="limit-banner-text">
              <span className="limit-icon">🔒</span>
              <div>
                <strong>Бесплатный лимит исчерпан</strong>
                <p>Выберите план, чтобы генерировать QR-коды дальше.</p>
              </div>
            </div>
            <button className="btn" onClick={onLimitReached}>
              Выбрать план
            </button>
          </div>
        )}

        <div className="gen-layout">
          {/* Form */}
          <div className="gen-form-col">
            <form className="gen-card" onSubmit={handleGenerate}>
              <div className="gen-card-section">
                <label className="gen-label" htmlFor="qr-text">
                  URL или текст
                </label>
                <textarea
                  id="qr-text"
                  className="gen-textarea"
                  placeholder="https://example.com или любой текст..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  maxLength={2953}
                />
                <div className="gen-char-count">{text.length} / 2953</div>
              </div>

              {/* Customization toggle */}
              <button
                type="button"
                className="options-toggle"
                onClick={() => setShowOptions(!showOptions)}
              >
                <span>Настроить внешний вид</span>
                <span className={`toggle-arrow ${showOptions ? "open" : ""}`}>▾</span>
              </button>

              {showOptions && (
                <div className="gen-card-section gen-options">
                  <div className="options-row">
                    <div className="options-field">
                      <label className="gen-label">Цвет QR-кода</label>
                      <div className="color-input-wrap">
                        <input
                          type="color"
                          className="color-swatch"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                        />
                        <span className="color-hex">{color.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="options-field">
                      <label className="gen-label">Цвет фона</label>
                      <div className="color-input-wrap">
                        <input
                          type="color"
                          className="color-swatch"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                        />
                        <span className="color-hex">{bgColor.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="options-field">
                    <label className="gen-label">Размер изображения</label>
                    <div className="size-pills">
                      {SIZES.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          className={`size-pill ${size === s.value ? "active" : ""}`}
                          onClick={() => setSize(s.value)}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="options-row">
                    <div className="options-field">
                      <label className="gen-label">Коррекция ошибок</label>
                      <select
                        className="gen-select"
                        value={errorCorrection}
                        onChange={(e) => setErrorCorrection(e.target.value)}
                      >
                        {ERROR_CORRECTIONS.map((ec) => (
                          <option key={ec.value} value={ec.value}>
                            {ec.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="options-field">
                      <label className="gen-label">Отступ (модулей): {margin}</label>
                      <input
                        type="range"
                        min={0}
                        max={4}
                        step={1}
                        value={margin}
                        onChange={(e) => setMargin(Number(e.target.value))}
                        className="gen-range"
                      />
                    </div>
                  </div>
                </div>
              )}

              {error && <p className="gen-error">{error}</p>}

              <div className="gen-actions">
                <button
                  type="submit"
                  className="btn btn--generate"
                  disabled={loading || !text.trim() || !canGenerate}
                >
                  {loading ? (
                    <span className="spinner" />
                  ) : (
                    "Сгенерировать QR"
                  )}
                </button>
                {isLimited && (
                  <p className="gen-limit-note">
                    Нет доступных генераций. <button type="button" className="link-btn" onClick={onLimitReached}>Выбрать план</button>
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Result */}
          <div className="gen-result-col" ref={resultRef}>
            {!qrResult && !loading && (
              <div className="result-placeholder">
                <div className="placeholder-qr">
                  <div className="placeholder-grid" />
                </div>
                <p className="placeholder-text">Здесь появится ваш QR-код</p>
              </div>
            )}

            {loading && (
              <div className="result-loading">
                <div className="loading-ring" />
                <p>Генерируем QR-код...</p>
              </div>
            )}

            {qrResult && (
              <div className="result-card">
                {wasFirst && (
                  <div className="first-qr-badge">
                    🎉 Первый бесплатный QR использован
                  </div>
                )}
                <div className="result-img-wrap">
                  <img
                    ref={imgRef}
                    src={qrResult}
                    alt="Ваш QR-код"
                    className="result-img"
                  />
                </div>
                <div className="result-meta">
                  <span className="result-meta-text">
                    {size}×{size}px · PNG
                  </span>
                </div>
                <div className="result-btns">
                  <button className="btn" onClick={handleDownload}>
                    Скачать PNG
                  </button>
                  <button className="btn btn--ghost" onClick={handleReset}>
                    Новый QR
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info cards */}
        <div className="info-cards">
          <div className="info-card">
            <span className="info-icon">⚡</span>
            <h3>Мгновенная генерация</h3>
            <p>QR-код создаётся на сервере и отдаётся за миллисекунды.</p>
          </div>
          <div className="info-card">
            <span className="info-icon">🎨</span>
            <h3>Гибкая настройка</h3>
            <p>Выберите цвета, размер и уровень коррекции ошибок.</p>
          </div>
          <div className="info-card">
            <span className="info-icon">📱</span>
            <h3>Читается везде</h3>
            <p>QR-коды проверены на сканируемость в iOS и Android.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
