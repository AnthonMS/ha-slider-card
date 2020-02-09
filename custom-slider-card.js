import {
    LitElement,
    html,
    css
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";
class SliderCard extends LitElement {
  
  static get properties() {
    return {
      hass: {},
      config: {},
      active: {}
    };
  }
  
  constructor() {
    super();
  }
  
  render() {
    // Size Variables
    var brightnessWidth = this.config.brightnessWidth ? this.config.brightnessWidth : "100%";
    var brightnessHeight = this.config.brightnessHeight ? this.config.brightnessHeight : "50px";
    // Slider Background Color Variables
    var mainSliderColor = this.config.mainSliderColor ? this.config.mainSliderColor : "#636363";
    var secondarySliderColor = this.config.secondarySliderColor ? this.config.secondarySliderColor : "#4d4d4d";
    // Slider Thumb Variables
    var thumbWidth = this.config.thumbWidth ? this.config.thumbWidth : "25px";
    var thumbHeight = this.config.thumbHeight ? this.config.thumbHeight : "80px";
    var thumbColor = this.config.thumbColor ? this.config.thumbColor : "#969696";
    var thumbHorizontalPadding = this.config.thumbHorizontalPadding ? this.config.thumbHorizontalPadding : "10px";
    var thumbVerticalPadding = this.config.thumbVerticalPadding ? this.config.thumbVerticalPadding : "20px";

    var entity = this.config.entity;
    var entityState = this.hass.states[entity]
    
    var styleStr = `
      --slider-width: ${brightnessWidth};
      --slider-width-inverse: -${brightnessWidth};
      --slider-height: ${brightnessHeight};
      --slider-main-color: ${mainSliderColor};
      --slider-secondary-color: ${secondarySliderColor};
      
      --thumb-width: ${thumbWidth};
      --thumb-height: ${thumbHeight};
      --thumb-color: ${thumbColor};
      --thumb-horizontal-padding: ${thumbHorizontalPadding};
      --thumb-vertical-padding: ${thumbVerticalPadding};
    `;
// <div class="brightness">${entityState.state === "off" ? 0 : Math.round(entityState.attributes.brightness/2.55)+'%'}</div>
    return html`
        <ha-card>
          <div class="slider-container" style="--slider-height: ${brightnessHeight};">
            <input name="foo" type="range" class="${entityState.state}" style="${styleStr}" .value="${entityState.state === "off" ? 0 : Math.round(entityState.attributes.brightness/2.55)}" @change=${e => this._setBrightness(entityState, e.target.value)}>
          </div>
        </ha-card>
    `;
  }

  updated() {}
  
  _setBrightness(state, value) {
    this.hass.callService("homeassistant", "turn_on", {
        entity_id: state.entity_id,
        brightness: value * 2.55
    });
  }
  
  _switch(state) {
      this.hass.callService("homeassistant", "toggle", {
        entity_id: state.entity_id    
      });
  }
  
  _navigate(path) {
      window.location.href = path;
  }
  
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define entity");
    }
    this.config = config;
  }

  getCardSize() {
    return 2;
  }
  
  static get styles() {
    return css`
        .slider-container {
            height: var(--slider-height);
            position: relative;
        }

        .slider-container input[type="range"] {
            outline: 0;
            border: 0;
            border-radius: 4px;
            width: var(--slider-width);
            margin: 0;
            transition: box-shadow 0.2s ease-in-out;
            overflow: hidden;
            height: var(--slider-height);
            -webkit-appearance: none;
            background-color: var(--slider-secondary-color); /*Remaining Slider color*/
            position: absolute;
            top: calc(50% - (var(--slider-height) / 2));
            right: calc(50% - (var(--slider-width) / 2));
        }

        .slider-container input[type="range"]::-webkit-slider-runnable-track {
            height: var(--slider-height);
            -webkit-appearance: none;
            color: var(--slider-main-color);
            margin-top: -1px;
            transition: box-shadow 0.2s ease-in-out;
        }

        .slider-container input[type="range"]::-webkit-slider-thumb {
            width: var(--thumb-width);
            height: var(--thumb-height);
            -webkit-appearance: none;
            cursor: ew-resize;
            border-radius: 0;
            transition: box-shadow 0.2s ease-in-out;
            position: relative;

            box-shadow: -3500px 0 0 3500px var(--slider-main-color), inset 0 0 0 25px var(--thumb-color);

            top: calc((var(--slider-width) - var(--thumb-height)) / 2);
            border-right: var(--thumb-horizontal-padding) solid var(--slider-main-color);
            border-left: var(--thumb-horizontal-padding) solid var(--slider-main-color);
            border-top: var(--thumb-vertical-padding) solid var(--slider-main-color);
            border-bottom: var(--thumb-vertical-padding) solid var(--slider-main-color);
        }

        .slider-container input[type="range"]::-webkit-slider-thumb:hover {
            cursor: default;
        }

        .slider-container input[type="range"]:hover {
          cursor: default;
        }
    `;
  }  
  
}

customElements.define('slider-card', SliderCard);
