# slider-card

## Description

Slider Card is a customizable card for light entity sliders, for the Home Assistant Lovelace frontend.

### Features
- Customizable bar

### Future features (Maybe)
- Customizable Percentage Text inside slider
- Multiple entities (Right now you can only put one light entity in each card)

## Options
| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| type | string | **Required** | `custom:slider-card` |
| entity | string | **Required** | `light.living_room` |
| brightnessWidth | string | 100% | Width of slider |
| brightnessHeight | string | 50px | Height of slider |
| mainSliderColor | string | #636363 | Main color of slider |
| secondarySliderColor | string | #4d4d4d | Secondary color of slider |
| thumbWidth | string | 25px | Width of thumb |
| thumbHeight | string | 80px | Height of thumb |
| thumbColor | string | #969696 | Color of thumb |
| thumbHorizontalPadding | string | 10px | Horizontal padding of the thumb |
| thumbVerticalPadding | string | 20px | Vertical padding of thumb |

## Installation

### Step 1

Copy `slider-card.js` to `<config directory>/www/slider-card.js`.

### Step 2

Add `slider-card` resource to `ui-lovelace.yaml`.

```yaml
resources:
  - url: /local/slider-card.js
    type: module
```

### Step 3

Add a custom card to your `ui-lovelace.yaml`.

```yaml
- type: custom:slider-card
  entity: light.example
```

## Examples

#### Default

![Default Slider Config](/slider-card-captures/default.JPG)

```yaml
cards:
  - type: custom:slider-card
    entity: light.example
```

#### Change Slider Height and Colors

![Change Slider Height and Colors Config](/slider-card-captures/colors-height.JPG)

```yaml
cards:
    - type: custom:slider-card
      entity: light.dinner_table_light
      brightnessHeight: '30px'
      mainSliderColor: 'green'
      secondarySliderColor: 'red'
```

#### Change Thumb Size and Colors

![Change Thumb Height and Colors Config](/slider-card-captures/thumb-colors-height.JPG)

```yaml
cards:
  - type: custom:slider-card
    entity: light.dinner_table_light
    brightnessHeight: '30px'
    mainSliderColor: 'blue'
    secondarySliderColor: 'darkblue'
    thumbWidth: '25px'
    thumbHeight: '60px'
    thumbColor: 'black'
```


























