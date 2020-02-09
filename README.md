# slider-card

## Description

Slider Card is a customizable card for light entity sliders, for the Home Assistant Lovelace frontend.
**Please read the notes at the bottom of this readme, there are some important styling tips, because the padding on the thumb works in mysterious ways (Using border styling)**

### Features
- Customizable bar

### Future features (Maybe)
- Customizable Percentage Text inside slider.
- Customizable border radius of the slider.
- Multiple entities (Right now you can only put one light entity in each card).

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

```yaml
cards:
  - type: custom:slider-card
    entity: light.example
```

![Default Slider Config](/slider-card-captures/default.JPG)

#### Change Slider Height and Colors

```yaml
cards:
    - type: custom:slider-card
      entity: light.dinner_table_light
      brightnessHeight: '30px'
      mainSliderColor: 'green'
      secondarySliderColor: 'red'
```

![Change Slider Height and Colors Config](/slider-card-captures/colors-height.JPG)

#### Change Thumb Size and Colors

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

![Change Thumb Height and Colors Config](/slider-card-captures/thumb-colors-height.JPG)

#### Change Thumb Padding and Size

```yaml
cards:
###########  LEFT SLIDER  ############
  - type: custom:slider-card
    entity: light.dinner_table_light
    brightnessHeight: '30px'
    mainSliderColor: 'green'
    secondarySliderColor: 'red'
    thumbWidth: '0px'
    thumbHeight: '30px'
    thumbColor: 'pink'
    thumbHorizontalPadding: '0px'
    thumbVerticalPadding: '0px'

###########  RIGHT SLIDER  ############
  - type: custom:slider-card
    entity: light.sofa_light
    brightnessHeight: '30px'
    mainSliderColor: 'blue'
    secondarySliderColor: 'darkblue'
    thumbWidth: '5px'
    thumbHeight: '30px'
    thumbColor: 'black'
    thumbHorizontalPadding: '0px'
    thumbVerticalPadding: '0px'

```

![Change Thumb Height and Colors Config](/slider-card-captures/thumb-padding-2.JPG)

### NOTE

When changing the padding of the thumb. If you want for example padding on the sides (horizontal) you will have to triple the width of the thumb itself, this has something to do with the border styling. There is possibly a way around this, if I use some more time on the styling, but for now, this will have to do, since it serves the purpose I need it for. Plus if you just keep this in mind, there should be no trouble. But play around with it. This includes when wanting padding on top/bottom (vertical), you will have to change height of the thumb.

For the colors, you can use HEX colors ('#111111'), color names supported by CSS ('red', 'blue', 'black', etc.) and I assume you can also use rgb ('rgb(255, 255, 255)') and rgba ('rgba(255, 255, 255, 0.5)'). rgba is used when you want to change the opacity, this is the last number in the comma seperated list, where 1 is full opacity and 0 is full transparency.





















