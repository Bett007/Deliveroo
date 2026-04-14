import { Component } from "react";
import styles from "./ErrorBoundary.module.css";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled UI error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className={styles.errorBoundary}>
          <h2>Something went wrong.</h2>
          <p>We were unable to render this section. Please refresh the page or try again later.</p>
          <pre>{this.state.error?.message}</pre>
        </section>
      );
    }

    return this.props.children;
  }
}
