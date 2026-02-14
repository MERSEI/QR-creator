export default function Header({ userStatus, loading, onUpgrade }) {
  const plan = userStatus?.plan;
  const credits = userStatus?.credits ?? 0;
  const freeRemaining = userStatus?.freeRemaining ?? 0;

  function PlanBadge() {
    if (loading) {
      return <span className="plan-badge plan-badge--loading">•••</span>;
    }
    if (plan === "unlimited") {
      return <span className="plan-badge plan-badge--pro">Безлимит</span>;
    }
    if (credits > 0) {
      return (
        <span className="plan-badge plan-badge--credits">
          {credits} QR-{credits === 1 ? "кредит" : "кредита"}
        </span>
      );
    }
    if (freeRemaining > 0) {
      return <span className="plan-badge plan-badge--free">1 бесплатный QR</span>;
    }
    return (
      <button className="plan-badge plan-badge--limit" onClick={onUpgrade}>
        Лимит — Выбрать план ↗
      </button>
    );
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="header-logo">
          <span className="logo-glyph">◼</span>
          <span className="logo-text">QR Creator</span>
        </div>

        <nav className="header-nav">
          <PlanBadge />
          {plan !== "unlimited" && !loading && (
            <button className="btn btn--sm" onClick={onUpgrade}>
              Улучшить план
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
