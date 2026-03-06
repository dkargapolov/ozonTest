export class DomSvgRenderer {
  /**
   * @param {HTMLElement} host
   * @param {object} [options]
   */
  constructor(host, options = {}) {
    if (!(host instanceof HTMLElement)) {
      throw new TypeError("DomSvgRenderer: host must be an HTMLElement");
    }

    this._host = host;
    this._options = {
      size: 220,
      strokeWidth: 12,
      trackColor: "rgba(234, 234, 242, 0.14)",
      progressColor: "#8b5cf6",
      backgroundColor: "transparent",
      animationDuration: 1200,
      ...options,
    };

    this._rootEl = null;
    this._svgEl = null;
    this._spinnerLayer = null;
    this._progressCircle = null;
    this._styleEl = null;

    this._radius = 0;
    this._circumference = 0;
    this._isMounted = false;
  }

  mount() {
    const {
      size,
      strokeWidth,
      trackColor,
      progressColor,
      backgroundColor,
      animationDuration,
    } = this._options;

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    this._radius = radius;
    this._circumference = circumference;

    this._ensureStyles(animationDuration);

    const root = document.createElement("div");
    root.className = "progress-renderer-root";
    root.style.display = "grid";
    root.style.placeItems = "center";
    root.style.width = "100%";
    root.style.height = "100%";
    root.style.position = "relative";

    const spinnerLayer = document.createElement("div");
    spinnerLayer.className = "progress-renderer-spinner-layer";
    spinnerLayer.style.width = "100%";
    spinnerLayer.style.height = "100%";
    spinnerLayer.style.display = "grid";
    spinnerLayer.style.placeItems = "center";

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("aria-hidden", "true");
    svg.style.display = "block";
    svg.style.overflow = "visible";

    const bgCircle = document.createElementNS(svgNS, "circle");
    bgCircle.setAttribute("cx", String(size / 2));
    bgCircle.setAttribute("cy", String(size / 2));
    bgCircle.setAttribute("r", String(radius));
    bgCircle.setAttribute("fill", backgroundColor);

    const trackCircle = document.createElementNS(svgNS, "circle");
    trackCircle.setAttribute("cx", String(size / 2));
    trackCircle.setAttribute("cy", String(size / 2));
    trackCircle.setAttribute("r", String(radius));
    trackCircle.setAttribute("fill", "none");
    trackCircle.setAttribute("stroke", trackColor);
    trackCircle.setAttribute("stroke-width", String(strokeWidth));

    const progressCircle = document.createElementNS(svgNS, "circle");
    progressCircle.setAttribute("cx", String(size / 2));
    progressCircle.setAttribute("cy", String(size / 2));
    progressCircle.setAttribute("r", String(radius));
    progressCircle.setAttribute("fill", "none");
    progressCircle.setAttribute("stroke", progressColor);
    progressCircle.setAttribute("stroke-width", String(strokeWidth));
    progressCircle.setAttribute("stroke-linecap", "round");
    progressCircle.setAttribute("stroke-dasharray", String(circumference));
    progressCircle.setAttribute("stroke-dashoffset", String(circumference));

    trackCircle.style.transformOrigin = "50% 50%";
    trackCircle.style.transform = "rotate(-90deg)";
    progressCircle.style.transformOrigin = "50% 50%";
    progressCircle.style.transform = "rotate(-90deg)";

    svg.append(bgCircle, trackCircle, progressCircle);
    spinnerLayer.appendChild(svg);
    root.appendChild(spinnerLayer);

    this._host.innerHTML = "";
    this._host.appendChild(root);

    this._rootEl = root;
    this._svgEl = svg;
    this._spinnerLayer = spinnerLayer;
    this._progressCircle = progressCircle;
    this._isMounted = true;

    this._host.setAttribute("role", "progressbar");
    this._host.setAttribute("aria-valuemin", "0");
    this._host.setAttribute("aria-valuemax", "100");
    this._host.setAttribute("aria-valuenow", "0");
    this._host.setAttribute("aria-hidden", "false");
    this._host.hidden = false;
  }

  setValue(value) {
    if (!this._isMounted || !this._progressCircle) {
      return;
    }

    const normalizedValue = Math.min(100, Math.max(0, Number(value) || 0));
    const progress = normalizedValue / 100;
    const dashOffset = this._circumference * (1 - progress);

    this._progressCircle.setAttribute("stroke-dashoffset", String(dashOffset));
    this._host.setAttribute("aria-valuenow", String(Math.round(normalizedValue)));
  }

  setAnimated(flag) {
    if (!this._isMounted || !this._spinnerLayer) {
      return;
    }

    this._spinnerLayer.classList.toggle("progress-renderer--animated", Boolean(flag));
  }

  setHidden(flag) {
    if (!this._isMounted) {
      return;
    }

    const isHidden = Boolean(flag);
    this._host.hidden = isHidden;
    this._host.setAttribute("aria-hidden", String(isHidden));
  }

  unmount() {
    this._host.innerHTML = "";
    this._host.hidden = false;
    this._host.removeAttribute("aria-hidden");
    this._host.removeAttribute("aria-valuenow");
    this._host.removeAttribute("aria-valuemin");
    this._host.removeAttribute("aria-valuemax");
    this._host.removeAttribute("role");

    if (this._styleEl?.parentNode) {
      this._styleEl.parentNode.removeChild(this._styleEl);
    }

    this._rootEl = null;
    this._svgEl = null;
    this._spinnerLayer = null;
    this._progressCircle = null;
    this._styleEl = null;
    this._radius = 0;
    this._circumference = 0;
    this._isMounted = false;
  }

  _ensureStyles(animationDuration) {
    if (this._styleEl) {
      return;
    }

    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes progress-renderer-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .progress-renderer--animated {
        animation-name: progress-renderer-spin;
        animation-duration: ${animationDuration}ms;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
    `;

    document.head.appendChild(styleEl);
    this._styleEl = styleEl;
  }
}