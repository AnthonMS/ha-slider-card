/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	LitElement,
	html,
	customElement,
	property,
	CSSResult,
	TemplateResult,
	css,
	PropertyValues,
	internalProperty,
} from 'lit-element';
import {
	HomeAssistant,
	hasConfigOrEntityChanged,
	hasAction,
	ActionHandlerEvent,
	handleAction,
	LovelaceCardEditor,
	getLovelace,
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types

import './editor';

import type { BoilerplateCardConfig } from './types';
import { actionHandler } from './action-handler-directive';
import { CARD_VERSION } from './const';
import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
	`%c  MY-BUTTON-LIGHT \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
	'color: orange; font-weight: bold; background: green',
	'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
	type: 'my-button-light',
	name: 'My Button Light',
	description: 'This is just my custom button card, it does what I need it to do without to much customization.',
});

// TODONE Name your custom element
@customElement('my-button-light')
export class MyButtonLight extends LitElement {

	public static async getConfigElement(): Promise<LovelaceCardEditor> {
		return document.createElement('boilerplate-card-editor');
	}

	public static getStubConfig(): object {
		return {};
	}

	static get properties() {
		return {
			hass: {},
			config: {},
			active: {}
		};
	}

	// hass: {},
	// config: {},
	// active: {}
	// TODO Add any properities that should cause your element to re-render here
	// https://lit-element.polymer-project.org/guide/properties
	@property({ attribute: false }) public hass!: HomeAssistant;
	@internalProperty() private config!: BoilerplateCardConfig;

	// https://lit-element.polymer-project.org/guide/properties#accessors-custom
	public setConfig(config: BoilerplateCardConfig): void {
		// TODO Check for required fields and that they are of the proper format
		if (!config) {
			throw new Error(localize('common.invalid_configuration'));
		}

		if (!config.entity) {
			throw new Error('You need to define an entity');
		}


		this.config = {
			name: 'MyButtonLight',
			...config,
		};
	}

	// https://lit-element.polymer-project.org/guide/lifecycle#shouldupdate
	protected shouldUpdate(changedProps: PropertyValues): boolean {
		if (!this.config) {
			return false;
		}

		return hasConfigOrEntityChanged(this, changedProps, false);
	}

	// https://lit-element.polymer-project.org/guide/templates
	protected render(): TemplateResult | void {
		// var minBar = this.config.minBar ? this.config.minBar : 0;
		// console.log("Test-Card Config:", this.config)

		// -- Make copy of the config, this way we can add empty -- //
		// -- objects and save ourselves a lot of if statements -- //
		var conf = JSON.parse(JSON.stringify(this.config));
		// console.log("Test-Card Test:", conf)

		
		const entityId = this.config.entity
		const entityName = this.config.entity?.split(".")[1]
		const entity = this.hass.states[`${entityId}`]
		// console.log("ENTITY:::", entity)
		
		// -- Check if styles for different options exists -- //
		conf.row1 = conf.row1 ? conf.row1 : {}
		conf.row2 = conf.row2 ? conf.row2 : {}
		conf.row3 = conf.row3 ? conf.row3 : {}
		conf.slider = conf.slider ? conf.slider : {}
		conf.styles = conf.styles ? conf.styles : {}
		conf.styles.card = conf.styles.card ? conf.styles.card : {}
		conf.styles.icon = conf.styles.icon ? conf.styles.icon : {}
		conf.styles.slider = conf.styles.slider ? conf.styles.slider : {}
		conf.styles.text = conf.styles.text ? conf.styles.text : {}
		conf.styles.text.row1 = conf.styles.text.row1 ? conf.styles.text.row1 : {}
		conf.styles.text.row2 = conf.styles.text.row2 ? conf.styles.text.row2 : {}
		conf.styles.text.row3 = conf.styles.text.row3 ? conf.styles.text.row3 : {}

		// ---- Card Variables ---- //
		let actionArea = conf.actionArea ? conf.actionArea : "main"
		let cardHeight = conf.styles.card.height ? conf.styles.card.height : "100%"
		let cardWidth = conf.styles.card.width ? conf.styles.card.width : "100%"
		this.style.height = cardHeight
		this.style.width = cardWidth

		let cardPxWidth = this.offsetWidth
		let cardPxHeight = this.offsetHeight
		window.addEventListener('resize', () => {
			cardPxWidth = this.offsetWidth
			cardPxHeight = this.offsetHeight
		});


		let cardBorderRadius = conf.styles.card.borderRadius ? conf.styles.card.borderRadius : "10%"
		let cardBackgroundColor = conf.styles.card.backgroundColor ? conf.styles.card.backgroundColor : "rgba(255, 255, 255, 1)"
		let cardBackgroundColorOff = conf.styles.card.backgroundColorOff ? conf.styles.card.backgroundColorOff : "rgba(230, 230, 230, 0.5)"
		// ------------------------ //

		// ---- Icon Variables ---- //
		let icon = conf.icon ? conf.icon : "mdi:alert-circle"
		let iconSize = conf.styles.icon.size ? conf.styles.icon.size : 1.3
		let iconColor = conf.styles.icon.color ? conf.styles.icon.color : "rgba(253, 216, 53, 1)"
		let iconColorOff = conf.styles.icon.colorOff ? conf.styles.icon.colorOff : "rgba(0, 0, 0, 1)"
		let iconPosition = conf.styles.icon.position ? conf.styles.icon.position : "absolute"
		let iconTop = conf.styles.icon.top ? conf.styles.icon.top : "15%"
		let iconLeft = conf.styles.icon.left ? conf.styles.icon.left : "10%"
		
		// ------------------------ //

		// ---- Slider Variables ---- //
		let slider = conf.slider ? conf.slider : {}
		let sliderPosition = conf.styles.slider.position ? conf.styles.slider.position : "right"
		// if (sliderPosition === "right") {
		// 	console.log("DISPLAY THIS SLIDER ON THE RIGHT SIDE VERTICALLY!")
		// }
		let sliderHeight = conf.styles.slider.height ? conf.styles.slider.height : "40px"
		let sliderBackgroundColor = conf.styles.slider.backgroundColor ? conf.styles.slider.backgroundColor : "transparent"
		let sliderProgressColor = conf.styles.slider.progressColor ? conf.styles.slider.progressColor : iconColor
		let maxSet = conf.slider.maxSet ? conf.slider.maxSet : 100
		let minSet = conf.slider.minSet ? conf.slider.minSet : 0
		let maxBar = conf.slider.maxBar ? conf.slider.maxBar : 100
		let minBar = conf.slider.minBar ? conf.slider.minBar : 0

		// ------------------------ //

		// ---- Text Variables ---- //
		let row1Text = conf.row1.text ? conf.row1.text : ""
		let row1TextOff = conf.row1.textOff ? conf.row1.textOff : ""
		let row1Color = conf.styles.text.row1.color ? conf.styles.text.row1.color : "black"
		let row1OneLine = conf.styles.text.row1.oneLine ? conf.styles.text.row1.oneLine : true
		let row1Size = conf.styles.text.row1.size ? conf.styles.text.row1.size : "15px"
		let row1Margin = conf.styles.text.row1.margin ? conf.styles.text.row1.margin : "0 0 10px 12px"

		let row2Text = conf.row2.text ? conf.row2.text : ""
		let row2TextOff = conf.row2.textOff ? conf.row2.textOff : ""
		let row2Color = conf.styles.text.row2.color ? conf.styles.text.row2.color : "black"
		let row2OneLine = conf.styles.text.row2.oneLine ? conf.styles.text.row2.oneLine : true
		let row2Size = conf.styles.text.row2.size ? conf.styles.text.row2.size : "13px"
		let row2Margin = conf.styles.text.row2.margin ? conf.styles.text.row2.margin : "0 0 5px 14px"

		
		// let row3Text = conf.row3.text ? conf.row3.text : entity.state === 'off' ? "0%" : Math.round(entity.attributes.brightness/2.55)+"%"
		let row3Text = conf.row3.text ? conf.row3.text : ""
		let row3TextOff = conf.row3.textOff ? conf.row3.textOff : ""
		let row3Color = conf.styles.text.row3.color ? conf.styles.text.row3.color : "black"
		let row3OneLine = conf.styles.text.row3.oneLine ? conf.styles.text.row3.oneLine : true
		let row3Size = conf.styles.text.row3.size ? conf.styles.text.row3.size : "13px"
		let row3Margin = conf.styles.text.row3.margin ? conf.styles.text.row3.margin : "0 0 25px 14px"

		if (row1Text === "<light_percentage>") {
			if (row1TextOff === "") row1TextOff = "0%"
			row1Text = entity.state === 'off' ? row1TextOff : Math.round(entity.attributes.brightness/2.55)+"%"
		} else {
			row1Text = conf.row1.text ? conf.row1.text : entity.attributes.friendly_name
		}
		
		if (row2Text === "<light_percentage>") {
			if (row2TextOff === "") row2TextOff = "0%"
			row2Text = entity.state === 'off' ? row2TextOff : Math.round(entity.attributes.brightness/2.55)+"%"
		}

		if (row3Text === "<light_percentage>") {
			if (row3TextOff === "") row3TextOff = "0%"
			row3Text = entity.state === 'off' ? row3TextOff : Math.round(entity.attributes.brightness/2.55)+"%"
		}
		// ------------------------ //

		// console.log("My-Button-Light -> ", this)
		// console.log("Slider ->", document.getElementById(`${entityName}-slider`))
		// console.log("My-Button Width -> ", cardPxWidth)
		// console.log("My-Button Height -> ", cardPxHeight)

		const haCardStyles = `
			width: 100%;
			height: 100%;
			border-radius: ${cardBorderRadius};
			background-color: ${(entity.state === "off" || entity.state === "unavailable" || entity.state == undefined) ? cardBackgroundColorOff : cardBackgroundColor};
			overflow: hidden;
		`

		const iconVariables = `
			--icon-color: ${(entity.state === "off" || entity.state === "unavailable" || entity.state == undefined) ? iconColorOff : iconColor}; 
			--icon-size: ${iconSize};
			--icon-position: ${iconPosition}; 
			--icon-top: ${iconTop}; 
			--icon-left: ${iconLeft};
		`
		

		var styleVariables = `
			--card-height: ${cardHeight};
			--card-width: ${cardWidth};
			--card-border-radius: ${cardBorderRadius};
		`;

		var sliderRightVariables = `
			--slider-height: ${sliderHeight};
			--slider-width: ${cardPxHeight + 10}px;
			--slider-left-pos: ${(cardPxHeight/2) - (parseInt(sliderHeight)/2) + 2}px;
			--slider-top-pos: ${(cardPxHeight/2) - (parseInt(sliderHeight)/2) + 2}px;
			--slider-background-color: ${sliderBackgroundColor};
			--slider-progress-color: ${(entity.state === "off" || entity.state === "unavailable" || entity.state == undefined) ? "transparent" : sliderProgressColor}

	  	`;

		var textVariables = `
			--row-1-color: ${row1Color};
			--row-2-color: ${row2Color};
			--row-3-color: ${row3Color};
			--row-1-size: ${row1Size};
			--row-1-line-height: ${parseInt(row1Size) + 2}px;
			--row-2-size: ${row2Size};
			--row-2-line-height: ${parseInt(row2Size) + 2}px;
			--row-3-size: ${row3Size};
			--row-3-line-height: ${parseInt(row3Size) + 2}px;
			--row-1-margin: ${row1Margin};
			--row-2-margin: ${row2Margin};
			--row-3-margin: ${row3Margin};
		`;


	//   @action=${this._handleAction}
	//   .actionHandler=${actionHandler({
	// 	  hasHold: hasAction(this.config.hold_action),
	// 	  hasDoubleClick: hasAction(this.config.double_tap_action),
	//   })}

		const mainContainer = () => {
			let element = html``
			
			if (actionArea === "main") {
				element = html`
					<div class="info-container" style="${textVariables}" 
						@action=${this._handleAction}
						.actionHandler=${actionHandler({
							hasHold: hasAction(this.config.hold_action),
							hasDoubleClick: hasAction(this.config.double_tap_action) })} >
							
						<p class="row-3 ${row1OneLine ? "text-oneline" : "text"}">${row3Text}</p>
						<p class="row-2 ${row2OneLine ? "text-oneline" : "text"}">${row2Text}</p>
						<p class="row-1 ${row3OneLine ? "text-oneline" : "text"}">${row1Text}</p>
						
					</div>
				`
			} else {
				element = html`
					<div class="info-container" style="${textVariables}" >
						<p class="row-3 ${row1OneLine ? "text-oneline" : "text"}">${row3Text}</p>
						<p class="row-2 ${row2OneLine ? "text-oneline" : "text"}">${row2Text}</p>
						<p class="row-1 ${row3OneLine ? "text-oneline" : "text"}">${row1Text}</p>
					</div>
				`
			}
			return element
		}

		const iconElement = () => {
			let element = html``
			
			if (actionArea === "icon") {
				element = html`
					<ha-icon class="my-button-light-icon" icon="${icon}" style="${iconVariables}" 
					@action=${this._handleAction}
					.actionHandler=${actionHandler({
						hasHold: hasAction(this.config.hold_action),
						hasDoubleClick: hasAction(this.config.double_tap_action) })} ></ha-icon>
				`
			} else {
				element = html`
					<ha-icon class="my-button-light-icon" icon="${icon}" style="${iconVariables}"></ha-icon>
				`
			}
			return element
		}

		const sliderElement = () => {
			let element = html``
			if (slider || Object.keys(slider).length !== 0) {
				element = html`
					<input class="input-slider" id="${entityName}-slider" style="${sliderRightVariables}" orient="vertical" type="range" step="1" 
						value="${entity.state === 'off' ? 0 : Math.round(entity.attributes.brightness/2.55)}" 
						min="${minBar}" max="${maxBar}"
						@input=${e => this._handleSliderAction(entity, e.target, minSet, maxSet)}>
				`
			}

			return element
		}
		return html`
			<ha-card style="${haCardStyles}">

				<div class="root-container" style="${styleVariables}">
					${mainContainer()}

					${iconElement()}

					${sliderElement()}
				</div>

			</ha-card>
		`;
	}

	private _handleAction(ev: ActionHandlerEvent): void {
		if (this.hass && this.config && ev.detail.action) {
			handleAction(this, this.hass, this.config, ev.detail.action);
		}
	}

	private _handleSliderAction(_entity, _target, _minSet, _maxSet): void {
		let val = _target.value
		if (val > _maxSet) {
		  val = _maxSet;
		} else if (val < _minSet) {
			val = _minSet;
		}
		
		this.hass.callService("light", "turn_on", {
			entity_id: _entity.entity_id,
			brightness: val * 2.55
		})

		_target.value = val
		// this._setSliderValueTransition(_target, Math.round(_entity.attributes.brightness/2.55), val)

	}

	private _setSliderValueTransition(_target, _oldVal, _newVal): void {
		// console.log("Setting Slider with Transition", _target)
		if (_newVal > _oldVal) {
			var i = _oldVal
			for (i; i < _newVal; i++) {
				setTimeout(() => {
					console.log("Hello")
				}, 200);
			}
		}
		else {
			var i = _newVal
			for (i; i < _oldVal; i++) {
	
			}
		}
	}


	// https://lit-element.polymer-project.org/guide/styles
	static get styles(): CSSResult {
		// -webkit-transform: rotate(-90deg);
		// -moz-transform: rotate(-90deg);
		// -o-transform: rotate(-90deg);
		// -ms-transform: rotate(-90deg);
		// transform: rotate(-90deg);

		// position: absolute;
		// left: var(--slider-left-pos);
		// top: var(--slider-top-pos);
		const sliderCss = css`
		/* vertical slider styling */
		.slider-container {
			padding: 0;
			margin: 0;
		}
		.input-slider {
			-webkit-appearance: none;
			background: var(--slider-background-color);
			height: var(--slider-height);
			width: var(--slider-width);
			border-radius: 0;
			border: none;
			outline: none;
			margin: 0;
			padding: 0;

			-webkit-transform: rotate(-90deg);
			-moz-transform: rotate(-90deg);
			-o-transform: rotate(-90deg);
			-ms-transform: rotate(-90deg);
			transform: rotate(-90deg);


			position: absolute;
			left: var(--slider-left-pos);
			top: var(--slider-top-pos);
			
		}
		
		.input-slider::-webkit-slider-runnable-track {
		}

		
		
		.input-slider::-webkit-slider-thumb {
			-webkit-appearance: none;
			width: 8px; /* 1 */
			height: 40px;
			background: var(--slider-progress-color);
			box-shadow: 5px 0px 5px var(--slider-progress-color),
						0px 0px 5px var(--slider-progress-color),
						-5px 0px 5px var(--slider-progress-color),
						-10px 0px 5px var(--slider-progress-color),
						-15px 0px 5px var(--slider-progress-color),
						-20px 0px 5px var(--slider-progress-color),
						-25px 0px 5px var(--slider-progress-color),
						-30px 0px 5px var(--slider-progress-color),
						-35px 0px 5px var(--slider-progress-color),
						-40px 0px 5px var(--slider-progress-color),
						-45px 0px 5px var(--slider-progress-color),
						-50px 0px 5px var(--slider-progress-color),
						-55px 0px 5px var(--slider-progress-color),
						-60px 0px 5px var(--slider-progress-color),
						-65px 0px 5px var(--slider-progress-color),
						-70px 0px 5px var(--slider-progress-color),
						-75px 0px 5px var(--slider-progress-color),
						-80px 0px 5px var(--slider-progress-color),
						-85px 0px 5px var(--slider-progress-color),
						-90px 0px 5px var(--slider-progress-color),
						-95px 0px 5px var(--slider-progress-color),
						-100px 0px 5px var(--slider-progress-color),
						-105px 0px 5px var(--slider-progress-color),
						-110px 0px 5px var(--slider-progress-color),
						-115px 0px 5px var(--slider-progress-color),
						-120px 0px 5px var(--slider-progress-color),
						-125px 0px 5px var(--slider-progress-color),
						-130px 0px 5px var(--slider-progress-color),
						-135px 0px 5px var(--slider-progress-color),
						-140px 0px 5px var(--slider-progress-color),
						-145px 0px 5px var(--slider-progress-color),
						-150px 0px 5px var(--slider-progress-color),
						-155px 0px 5px var(--slider-progress-color),
						-160px 0px 5px var(--slider-progress-color),
						-165px 0px 5px var(--slider-progress-color),
						-170px 0px 5px var(--slider-progress-color),
						-175px 0px 5px var(--slider-progress-color),
						-180px 0px 5px var(--slider-progress-color),
						-185px 0px 5px var(--slider-progress-color),
						-190px 0px 5px var(--slider-progress-color),
						-195px 0px 5px var(--slider-progress-color),
						-200px 0px 5px var(--slider-progress-color);
			border-top: 5px solid transparent;
			border-right: 5px solid transparent;
			border-bottom: 5px solid transparent;
			border-left: 5px solid transparent;
			cursor: pointer;
		}
		
		`

		const iconCss = css`
			.my-button-light-icon {
				color: var(--icon-color); 
				width: var(--icon-width); 
				height: var(--icon-height); 
				position: var(--icon-position); 
				top: var(--icon-top); 
				left: var(--icon-left); 
				transform: scale(var(--icon-size));
			}
		`

		return css`
		${sliderCss}
		${iconCss}
		.root-container {
			height: var(--card-height);
			width: var(--card-width);
		}

        .info-container {
			height: 100%;
			width: 100%;
            display: flex;
            flex-direction: column-reverse;
        }

        .text-oneline {
            padding: 0;
            margin: 0;
			overflow: hidden;
			white-space: nowrap;
        }
		.text {
            padding: 0;
            margin: 0;
		}

		.row-1 {
			margin: var(--row-1-margin);
            font-weight: bold;
			font-size: var(--row-1-size);
			line-height: var(--row-1-line-height);
			height: var(--row-1-line-height);

			color: var(--row-1-color);
		}
		.row-2 {
			margin: var(--row-2-margin);
			font-size: 13px;
			line-height: var(--row-2-line-height);
			height: var(--row-2-line-height);
			color: var(--row-2-color);
		}
		.row-3 {
			margin: var(--row-3-margin);
			font-size: 13px;
			line-height: var(--row-3-line-height);
			height: var(--row-3-line-height);
			color: var(--row-3-color);
		}


    `;
	}
}
