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
  var width = this.config.width ? this.config.width : "100%";
  var height = this.config.height ? this.config.height : "50px";
  var radius = this.config.radius ? this.config.radius : "4px";
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
  var entityClass = this.hass.states[entity]

  var isLight = false;
  var isInputNumber = false;
  var isMediaPlayer= false;

  // Check if entity is light or input_number
  if (this.config.entity.includes("light.")) {
    isLight = true;
    var step = this.config.step ? this.config.step: "1";
  }
  else if (this.config.entity.includes("input_number.")) {
    isInputNumber = true;
    var step = this.config.step ? this.config.step: entityClass.attributes.step;
  }
  else if (this.config.entity.includes("media_player.")) {
    isMediaPlayer = true;
    var step = this.config.step ? this.config.step: "1";
    console.log();
  }
  
  var styleStr = `
    --slider-width: ${width};
    --slider-width-inverse: -${width};
    --slider-height: ${height};
    --slider-main-color: ${mainSliderColor};
    --slider-secondary-color: ${secondarySliderColor};
    --slider-radius: ${radius};
    
    --thumb-width: ${thumbWidth};
    --thumb-height: ${thumbHeight};
    --thumb-color: ${thumbColor};
    --thumb-horizontal-padding: ${thumbHorizontalPadding};
    --thumb-vertical-padding: ${thumbVerticalPadding};
  `;

  if (isLight) {
    if (this.config.function == "Warmth") {
      return html`
          <ha-card>
            <div class="slider-container" style="--slider-height: ${height};">
              <input name="foo" type="range" class="${entityClass.state}" style="${styleStr}" .value="${entityClass.state === "off" ? 0 : entityClass.attributes.color_temp}" min="${entityClass.attributes.min_mireds}" max="${entityClass.attributes.max_mireds}" step="${step}" @change=${e => this._setWarmth(entityClass, e.target.value)}>
            </div>
          </ha-card>
      `;
    }
    else {
      return html`
          <ha-card>
            <div class="slider-container" style="--slider-height: ${height};">
              <input name="foo" type="range" class="${entityClass.state}" style="${styleStr}" .value="${entityClass.state === "off" ? 0 : Math.round(entityClass.attributes.brightness/2.55)}" step="${step}" @change=${e => this._setBrightness(entityClass, e.target.value)}>
            </div>
          </ha-card>
      `;
    }
  }
  
  if (isInputNumber) {
    return html`
        <ha-card>
          <div class="slider-container" style="--slider-height: ${height};">
            <input name="foo" type="range" class="${entityClass.state}" style="${styleStr}" .value="${entityClass.state}" min="${entityClass.attributes.min}" max="${entityClass.attributes.max}" step="${step}" @change=${e => this._setInputNumber(entityClass, e.target.value)}>
          </div>
        </ha-card>
    `;
  }

  if (isMediaPlayer) {
    var numStr = entityClass.attributes.volume_level.toFixed(2);
    var num = Number(numStr.replace("0.", ""));

    return html`
        <ha-card>
          <div class="slider-container" style="--slider-height: ${height};">
            <input name="foo" type="range" class="${entityClass.state}" style="${styleStr}" .value="${num}" min="0" max="100" step="${step}" @change=${e => this._setMediaVolume(entityClass, e.target.value)}>
          </div>
        </ha-card>
    `;
  }
}

updated() {}

_setMediaVolume(entityClass, value) {
  if (value === 100) {
    var num = 1;
  }
  else {
    var num = Number("0." + value);
  }
  

  this.hass.callService("media_player", "volume_set", {
      entity_id: entityClass.entity_id,
      volume_level: num
  });
}

_setInputNumber(entityClass, number) {
  this.hass.callService("input_number", "set_value", {
      entity_id: entityClass.entity_id,
      value: number
  });
}

_setBrightness(entityClass, value) {
  this.hass.callService("homeassistant", "turn_on", {
      entity_id: entityClass.entity_id,
      brightness: value * 2.55
  });
  // console.log("Setting brightness...");
  // console.log(state);
}

_setWarmth(entityClass, value) {
  this.hass.callService("homeassistant", "turn_on", {
    entity_id: entityClass.entity_id,
    color_temp: value
  });
}

_switch(entityClass) {
    this.hass.callService("homeassistant", "toggle", {
      entity_id: entityClass.entity_id    
    });
}

_navigate(path) {
    window.location.href = path;
}

setConfig(config) {
  if (!config.entity) {
    throw new Error("You need to define entity");
  }

  if (!config.entity.includes("input_number.") && !config.entity.includes("light.") && !config.entity.includes("media_player.")) {
    throw new Error("Entity has to be a light, input_number or media_player");
  }
  
  this.config = config;
}

getCardSize() {
  return 0;
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
          border-radius: var(--slider-radius);
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
