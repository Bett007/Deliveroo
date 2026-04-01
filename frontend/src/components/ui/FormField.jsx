export function FormField({ id, label, error, children }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}
