export function PlaceholderArtwork({ variant = "customer", label = "Preview", title, caption }) {
  return (
    <aside className={`placeholder-art placeholder-art-${variant}`} aria-label={label}>
      <div className="placeholder-art-glow"></div>
      <div className="placeholder-art-frame glass-card">
        <div className="placeholder-art-hero">
          <span className="placeholder-pill">{label}</span>
          <div>
            <h3>{title}</h3>
            <p>{caption}</p>
          </div>
        </div>

        <div className="placeholder-scene">
          <div className="scene-card scene-card-large">
            <div className="scene-image scene-image-main"></div>
            <div className="scene-lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <div className="scene-card-grid">
            <div className="scene-card scene-card-small">
              <div className="scene-image scene-image-alt"></div>
              <div className="scene-lines compact">
                <span></span>
                <span></span>
              </div>
            </div>

            <div className="scene-card scene-card-small floating-card">
              <div className="scene-badge"></div>
              <div className="scene-lines compact">
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
