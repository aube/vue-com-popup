(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.VueComPopup = {}));
}(this, function (exports) { 'use strict';

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //


    var isServer = typeof window === 'undefined';

    var script = {

        data: function data() {
            return {
                isOpen: false,
                isSmallDevice: false,
                eventKeyupHandler: null,
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
            closeByClickOnOverlay: {
                type: Boolean,
                default: true
            },
            closeOnEvent: {
                type: String,
                default: 'close'
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
            smallDeviceWidth: {
                type: Number,
                default: 768
            },
            inlineStyle: {
                type: Object,
                default: null
            },
        },

        watch: {
            trigger: function trigger() {
                this.togglePopup();
            },
        },

        methods: {

            clickOnContent: function clickOnContent() {
                this.closeByClickOnContent && this.closePopup();
            },

            clickOnOverlay: function clickOnOverlay() {
                this.closeByClickOnOverlay && this.closePopup();
            },

            closeOnKey: function closeOnKey(event) {
                if (!this.isOpen) {
                    return;
                }
                if (event.key && event.key.toUpperCase() === 'ESCAPE') {
                    this.closePopup();
                }
            },

            closePopup: function closePopup() {
                this.isOpen = false;
                this.onClose && this.onClose();
                if (!isServer) {
                    document.documentElement.classList.remove('popup-opened');
                }
            },

            openPopup: function openPopup() {
                this.isOpen = true;
                this.onOpen && this.onOpen();
                if (!isServer) {
                    this.isSmallDevice = window.innerWidth <= this.smallDeviceWidth;
                    document.documentElement.classList.add('popup-opened');
                }
            },

            togglePopup: function togglePopup() {
                this.isOpen ? this.closePopup() : this.openPopup();
            },
        },

        created: function created() {
            this.isOpen = this.trigger;
            if (!isServer) {
                this.eventKeyupHandler = document.addEventListener('keyup', this.closeOnKey);
                this.$on(this.closeOnEvent, this.closePopup);
            }
        },

        destroyed: function destroyed() {
            if (!isServer) {
                document.removeEventListener('keyup', this.eventKeyupHandler);
                this.$off(this.closeOnEvent);
            }
        }
    };

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
    /* server only */
    , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
      } // Vue.extend constructor export interop.


      var options = typeof script === 'function' ? script.options : script; // render functions

      if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true; // functional template

        if (isFunctionalTemplate) {
          options.functional = true;
        }
      } // scopedId


      if (scopeId) {
        options._scopeId = scopeId;
      }

      var hook;

      if (moduleIdentifier) {
        // server build
        hook = function hook(context) {
          // 2.3 injection
          context = context || // cached call
          this.$vnode && this.$vnode.ssrContext || // stateful
          this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
          // 2.2 with runInNewContext: true

          if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
            context = __VUE_SSR_CONTEXT__;
          } // inject component styles


          if (style) {
            style.call(this, createInjectorSSR(context));
          } // register component module identifier for async chunk inference


          if (context && context._registeredComponents) {
            context._registeredComponents.add(moduleIdentifier);
          }
        }; // used by ssr in case component is cached and beforeCreate
        // never gets called


        options._ssrRegister = hook;
      } else if (style) {
        hook = shadowMode ? function () {
          style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
        } : function (context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook) {
        if (options.functional) {
          // register for functional component in vue file
          var originalRender = options.render;

          options.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context);
          };
        } else {
          // inject component registration as beforeCreate hook
          var existing = options.beforeCreate;
          options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }

      return script;
    }

    var normalizeComponent_1 = normalizeComponent;

    var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
    function createInjector(context) {
      return function (id, style) {
        return addStyle(id, style);
      };
    }
    var HEAD = document.head || document.getElementsByTagName('head')[0];
    var styles = {};

    function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = {
        ids: new Set(),
        styles: []
      });

      if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;

        if (css.map) {
          // https://developer.chrome.com/devtools/docs/javascript-debugging
          // this makes source maps inside style tags work properly in Chrome
          code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

          code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
        }

        if (!style.element) {
          style.element = document.createElement('style');
          style.element.type = 'text/css';
          if (css.media) { style.element.setAttribute('media', css.media); }
          HEAD.appendChild(style.element);
        }

        if ('styleSheet' in style.element) {
          style.styles.push(code);
          style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
        } else {
          var index = style.ids.size - 1;
          var textNode = document.createTextNode(code);
          var nodes = style.element.childNodes;
          if (nodes[index]) { style.element.removeChild(nodes[index]); }
          if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
        }
      }
    }

    var browser = createInjector;

    /* script */
    var __vue_script__ = script;

    /* template */
    var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"fade"}},[(_vm.isOpen)?_c('div',{ref:"popup-overlay",staticClass:"com-popup",class:{'open': _vm.isOpen, 'small-device': _vm.isSmallDevice},on:{"click":function($event){$event.stopPropagation();return _vm.clickOnOverlay($event)}}},[_c('div',{staticClass:"com-popup__container"},[_c('div',{staticClass:"com-popup__container-cell"},[(!_vm.hideCloseIcon)?_c('div',{staticClass:"com-popup__closer",on:{"click":function($event){$event.stopPropagation();return _vm.closePopup($event)}}}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"com-popup__content",style:(_vm.inlineStyle),on:{"click":function($event){$event.stopPropagation();return _vm.clickOnContent($event)}}},[_vm._t("default")],2)])])]):_vm._e()])};
    var __vue_staticRenderFns__ = [];

      /* style */
      var __vue_inject_styles__ = function (inject) {
        if (!inject) { return }
        inject("data-v-4c6621af_0", { source: ".com-popup{top:0;left:0;width:100%;height:100%;position:fixed;z-index:10000;overflow:hidden;overflow-x:hidden;overflow-y:auto;background:rgba(0,0,0,.5)}.com-popup.hidden{display:none}.com-popup__container{min-height:100%;position:relative;display:table;text-align:center;overflow:hidden;width:100%}.com-popup__container-cell{display:table-cell;vertical-align:middle}.com-popup__content{background:#fff;display:inline-block;position:relative;margin:5%;max-width:1200px;padding:0;overflow:hidden}.com-popup__closer{position:fixed;top:20px;right:20px;width:40px;height:40px;opacity:.5;cursor:pointer;z-index:10}.com-popup__closer:hover{opacity:1}.com-popup__closer:after,.com-popup__closer:before{position:absolute;left:14px;content:\" \";height:100%;width:2px;background-color:#fff;box-shadow:0 0 1px #333}.com-popup__closer:before{transform:rotate(45deg)}.com-popup__closer:after{transform:rotate(-45deg)}.small-device .com-popup{height:100%}.small-device .com-popup__content{width:98%;margin:1%}.small-device .com-popup__container{height:100%}.small-device .com-popup__container-cell{vertical-align:top}.small-device .com-popup__closer{display:none}html.popup-opened{overflow:hidden}.fade-enter-active,.fade-leave-active{transition:opacity .5s}.fade-enter,.fade-leave-to{opacity:0}", map: undefined, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__ = undefined;
      /* module identifier */
      var __vue_module_identifier__ = undefined;
      /* functional template */
      var __vue_is_functional_template__ = false;
      /* style inject SSR */
      

      
      var component = normalizeComponent_1(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        browser,
        undefined
      );

    // Import vue component

    // install function executed by Vue.use()
    function install(Vue) {
      if (install.installed) { return; }
      install.installed = true;
      Vue.component('VueComPopup', component);
    }

    // Create module definition for Vue.use()
    var plugin = {
      install: install,
    };

    // To auto-install when vue is found
    /* global window global */
    var GlobalVue = null;
    if (typeof window !== 'undefined') {
      GlobalVue = window.Vue;
    } else if (typeof global !== 'undefined') {
      GlobalVue = global.Vue;
    }
    if (GlobalVue) {
      GlobalVue.use(plugin);
    }

    // Inject install function into component - allows component
    // to be registered via Vue.use() as well as Vue.component()
    component.install = install;

    // It's possible to expose named exports when writing components that can
    // also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
    // export const RollupDemoDirective = component;

    exports.default = component;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
