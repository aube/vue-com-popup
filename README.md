# Overview
vue-com-popup is a popup component for vue.js and yet nuxt.js

# Installation
```bash
$ npm i vue-com-popup
```

# Props
| Name                  | Description                                                      | Value                  | Default  |
|-----------------------|------------------------------------------------------------------|------------------------|----------|
| name                  | For using with event bus (Vue.prototype.$bus)                    | String                 | ''       |
| trigger               | Open/Close popup                                                 | Boolean                | false    |
| closeByClickOnContent | Close popup after click inside                                   | Boolean                | false    |
| closeByClickOnOverlay | Close popup after click outside                                  | Boolean                | false    |
| closeOnEvent          | Listen event from content (Use this.$parent.$emit in child)      | String                 | 'close'  |
| hideCloseIcon         | Thank you, Captain!                                              | Boolean                | false    |
| smallDeviceWidth      | Full screen mode for devices smaller this                        | Number                 | 768      |
| maxWidth              | max-with CSS value                                               | String                 | ''       |
| onOpen                | Callback for open event                                          | Function               | null     |
| onClose               | Callback for close event                                         | Function               | null     |



# Example
Using vue-com-popup inside another vue component:
```html
<template>
    <div class="image-container">
        <img
            :src="thumbnail"
            @click="popupState=!popupState"
            class="thumbnail">
        <com-popup :trigger="popupState">
            <img :src="src" class="full-image">
        </com-popup>
    </div>
</template>


<script>
import ComPopup from 'vue-com-popup';

export default {
    components: {
        ComPopup,
    },

    data() {
        return {
            popupState: false
        };
    },

    props: {
        suffix: {
            type: String,
            default: '-xs'
        },
        src: {
            type: String,
            default: ''
        },
    },

    computed: {
        thumbnail: function() {
            if (this.suffix) {
                return this.src.replace(/^(.*)\.(.{3,4})/i, '$1' + this.suffix + '.$2');
            }
            return this.src;
        }
    },
};
</script>
```
