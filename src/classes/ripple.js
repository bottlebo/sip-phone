export class Ripple {
  constructor(selector, options) {
    this._options = options;
    this._options.style = 'gradient'
    this._selector = selector;
    this._colors = ['#f868BB', '#0075D8'];
    this._container = document.getElementById(selector);
    this._a1 = this._a2 = null;
    this._containerBox = this._container.getBoundingClientRect();
    this._build()
  }
  _build() {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttributeNS(svgNS, 'focusable', 'false');
    svg.style.height = '400%';
    svg.style.position = 'absolute';
    svg.style.pointerEvents = 'none';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '400%';
    svg.style.zIndex = '0';

    if (this._options.style == 'gradient') {
      const defs = document.createElementNS(svgNS, 'defs');
      const gradient = document.createElementNS(svgNS, 'radialGradient');
      gradient.setAttribute('id', this._selector + '_gradient')
      for (let i = 0, j = 0; i <= 1; i += 0.25) {
        const stop = document.createElementNS(svgNS, 'stop');
        stop.setAttributeNS(null, 'offset', i.toString());
        stop.setAttributeNS(null, 'stop-color', this._colors[j]);
        j = 1 - j;
        gradient.appendChild(stop);
      }
      defs.appendChild(gradient);
      svg.appendChild(defs);
    }
    const circle = document.createElementNS(svgNS, 'circle');
    circle.style.transformOrigin = '50% 50%';
    circle.style.opacity = '1';
    circle.style.position = 'absolute'
    circle.setAttributeNS(null, 'fill', 'url(#'+this._selector+'_gradient)')
    circle.setAttributeNS(null, 'cx', this._containerBox.width / 2);
    circle.setAttributeNS(null, 'cy', this._containerBox.height / 2);
    circle.setAttributeNS(null, 'r', this._containerBox.height/2);
    svg.appendChild(circle);

    this._a1 = document.createElementNS(svgNS, 'animate');
    this._a1.setAttributeNS(null,  'attributeName', 'r');
    this._a1.setAttributeNS(null,  'from', this._containerBox.height/2);
    this._a1.setAttributeNS(null,  'to', Math.max(2*this._containerBox.width,2*this._containerBox.height ));
    this._a1.setAttributeNS(null,  'begin', 'indefinite');
    this._a1.setAttributeNS(null,  'dur', '1.5s');
    this._a1.setAttributeNS(null,  'repeatCount', '5');
    this._a1.setAttributeNS(null,  'keyTimes', '0;1');
    this._a1.setAttributeNS(null,  'keySplines', '.5 0 .5 1');
    this._a1.setAttributeNS(null,  'calcMode', 'spline');
    circle.appendChild(this._a1);

    this._a2 = document.createElementNS(svgNS, 'animate');
    this._a2.setAttributeNS(null,  'attributeName', 'opacity');
    this._a2.setAttributeNS(null,  'from', '1');
    this._a2.setAttributeNS(null,  'to', '0');
    this._a2.setAttributeNS(null,  'begin', 'indefinite');
    this._a2.setAttributeNS(null,  'dur', '1.45s');
    this._a2.setAttributeNS(null,  'repeatCount', '15');
    this._a2.setAttributeNS(null,  'keyTimes', '0;1');
    this._a2.setAttributeNS(null,  'keySplines', '.5 0 .5 1');
    this._a2.setAttributeNS(null,  'calcMode', 'spline');
    circle.appendChild(this._a2);

    this._container.appendChild(svg);
    this._container.addEventListener('click', () => {
      this._a1.beginElement();
      this._a2.beginElement();
    })
  }

}
