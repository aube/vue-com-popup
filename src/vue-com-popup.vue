<template>
    <transition name="fade">
        <div v-if="isOpen" class="com-popup" :class="{'open': isOpen, 'small-device': isFullScreen}">
            <div class="com-popup__container">
                <div class="com-popup__container-cell">
                    <div class="com-popup__closer" v-if="!hideCloseIcon"></div>
                    <div class="com-popup__content" ref="popup-content" :style="{'max-width': maxWidth}">
                        <slot></slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>


<script>

const isServer = typeof window === 'undefined';

export default {

    data() {
        return {
            isOpen: false,
            isFullScreen: false,
            eventKeyupHandler: null,
            eventMousedownHandler: null
        };
    },

    props: {
        name: {
            type: String,
            default: ''
        },
        trigger: {
            type: Boolean,
            default: false
        },
        closeByClickOnContent: {
            type: Boolean,
            default: false
        },
        hideCloseIcon: {
            type: Boolean,
            default: false
        },
        onOpen: {
            type: Function,
            default: null
        },
        onClose: {
            type: Function,
            default: null
        },
        fullScreenMaxWidth: {
            type: Number,
            default: 768
        },
        maxWidth: {
            type: String,
            default: null
        },
    },

    watch: {
        trigger(val) {
            this.togglePopup();
        },
    },

    methods: {
        closeOnClick(event) {
            if (!this.isOpen) {
                return;
            }
            if (!this.closeByClickOnContent && !this.isFullScreen) {
                let path = event.path || (event.composedPath && event.composedPath());
                for (let i = 0; i < path.length; i++) {
                    if (path[i] === this.$refs['popup-content']) {
                        return;
                    }
                }
            }
            this.closePopup();
        },

        closeOnKey(event) {
            if (!this.isOpen) {
                return;
            }
            if (event.key && event.key.toUpperCase() === 'ESCAPE') {
                this.closePopup();
            }
        },

        closePopup() {
            this.isOpen = false;
            this.onClose && this.onClose();
            if (!isServer) {
                document.documentElement.classList.remove('popup-opened');
            }
        },

        openPopup() {
            this.isOpen = true;
            this.onOpen && this.onOpen();
            if (!isServer) {
                this.isFullScreen = window.innerWidth <= this.fullScreenMaxWidth;
                document.documentElement.classList.add('popup-opened');
            }
        },

        togglePopup() {
            this.isOpen ? this.closePopup() : this.openPopup();
        }
    },

    created() {
        this.isOpen = this.trigger;
        if (!isServer) {
            this.eventMousedownHandler = document.addEventListener('mousedown', this.closeOnClick);
            this.eventKeyupHandler = document.addEventListener('keyup', this.closeOnKey);
            this.$bus.$on('toggle-popup-' + this.name, this.togglePopup);
        }
    },

    destroyed() {
        if (!isServer) {
            document.removeEventListener('click', this.eventMousedownHandler);
            document.removeEventListener('keyup', this.eventKeyupHandler);

            this.$bus.$off('toggle-popup-' + this.name);
        }
    }
};
</script>


<style lang="scss">
.com-popup {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 10000;
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: auto;
    background: rgba(0, 0, 0, .5);
    &.hidden {
        display: none;
    }
}
.com-popup__container {
    min-height: 100%;
    position: relative;
    display: table;
    text-align: center;
    overflow: hidden;
    width: 100%;
}
.com-popup__container-cell {
    display: table-cell;
    vertical-align: middle;
}
.com-popup__content {
    background: #fff;
    display: inline-block;
    position: relative;
    margin: 5%;
    max-width: 1200px;
    padding: 0;
    overflow: hidden;
}
.com-popup__closer {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    opacity: 0.5;
    cursor: pointer;
    z-index: 10;
    &:hover {
        opacity: 1;
    }
    &:before,
    &:after {
        position: absolute;
        left: 14px;
        content: " ";
        height: 100%;
        width: 2px;
        background-color: #fff;
        box-shadow: 0 0 1px #333;
    }
    &:before {
        transform: rotate(45deg);
    }
    &:after {
        transform: rotate(-45deg);
    }
}

.small-device {
    .com-popup {
        height: 100%;
    }
    .com-popup__content {
        width: 98%;
        margin: 1%;
    }
    .com-popup__container {
        height: 100%;
    }
    .com-popup__container-cell {
        vertical-align: top;
    }
    .com-popup__closer {
        display: none;
    }
}

// double scroll correction
html.popup-opened {
    overflow: hidden;
}

// animation
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

</style>