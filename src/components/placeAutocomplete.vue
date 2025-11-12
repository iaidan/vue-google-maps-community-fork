<template>
  <template v-if="$slots['input']">
    <slot name="input" v-bind="$attrs"></slot>
  </template>
  <input v-else-if="!$slots['input']" ref="input" v-bind="$attrs" v-on="domListeners"/>
</template>

<script>
import downArrowSimulator from '../utils/simulateArrowDown.js';

const mappedProps = {
  componentRestrictions: {
    type: Object,
    noBind: true,
  },
  locationBias: {
    type: [Object, String],
  },
  locationRestriction: {
    type: [Object, String],
  },
  types: {
    type: Array,
    default: function () {
      return [];
    },
  },
};

const props = {
  selectFirstOnEnter: {
    required: false,
    type: Boolean,
    default: false,
  },
  options: {
    type: Object,
  },
};

export default {
  name: 'placeAutocomplete',
  emits: ['place_changed'],
  mounted() {
    const _this = this;
    this.$gmapApiPromiseLazy().then(() => {
      // get correct input from fallback or slot
      let refInput = _this.$refs.input;
      if (_this.$slots.input) {
        const vnodes = _this.$slots.input();
        if (vnodes && vnodes.length && vnodes[0].props && vnodes[0].props.ref) {
          const refName = vnodes[0].props.ref;
          const scopedInput = vnodes[0].ref?.i?.ctx?.$refs?.[refName];
          if (scopedInput) {
            refInput = scopedInput.$el.getElementsByTagName('input')[0];
          }
        }
      }

      if (this.selectFirstOnEnter && refInput) {
        downArrowSimulator(refInput);
      }

      const ctor = google?.maps?.places?.PlaceAutocompleteElement;
      if (typeof ctor !== 'function') {
        throw new Error(
            'google.maps.places.PlaceAutocompleteElement is undefined. Ensure you\'re loading the \'places\' library and Maps JS version that includes the Place Autocomplete Element.'
        );
      }

      const element = new ctor();

      // Apply mapped props and options to the element
      const finalOptions = {
        ...this.options,
      };

      // Assign primitive/known props directly if present
      if (this.types && this.types.length) {
        element.types = this.types;
      }
      if (this.locationBias) {
        element.locationBias = this.locationBias;
      }
      if (this.locationRestriction) {
        element.locationRestriction = this.locationRestriction;
      }
      if (this.componentRestrictions) {
        element.componentRestrictions = this.componentRestrictions;
      }

      // Assign any additional options provided by user
      if (finalOptions && typeof finalOptions === 'object') {
        Object.assign(element, finalOptions);
      }

      // Bind to the input element
      element.inputElement = refInput;

      // Keep a reference
      this.$placeAutocompleteElement = element;

      // Listen to place select event and emit standardized event
      element.addEventListener('gmp-placeselect', (e) => {
        const place = e?.place || element?.getPlace?.();
        this.$emit('place_changed', place);
      });

      // Watch for reactive changes to componentRestrictions
      this.$watch('componentRestrictions', (v) => {
        if (v !== undefined && this.$placeAutocompleteElement) {
          this.$placeAutocompleteElement.componentRestrictions = v;
        }
      });
    });
  },
  computed: {
    domListeners() {
      const allowMap = {
        onChange: 'change',
        onInput: 'input',
        onFocus: 'focus',
        onBlur: 'blur',
        onKeydown: 'keydown',
        onKeyup: 'keyup',
        onKeypress: 'keypress',
        onCompositionstart: 'compositionstart',
        onCompositionupdate: 'compositionupdate',
        onCompositionend: 'compositionend',
        onClick: 'click',
        onDblclick: 'dblclick',
        onMousedown: 'mousedown',
        onMouseup: 'mouseup',
        onMouseenter: 'mouseenter',
        onMouseleave: 'mouseleave',
        onMousemove: 'mousemove',
        onWheel: 'wheel',
        onPaste: 'paste',
        onCut: 'cut',
        onCopy: 'copy',
      };

      const out = {};
      for (const [key, val] of Object.entries(this.$attrs)) {
        const domEvent = allowMap[key];
        if (domEvent && (typeof val === 'function' || Array.isArray(val))) {
          out[domEvent] = val;
        }
      }
      return out;
    },
  },
  props: {
    ...mappedProps,
    ...props,
  },
};
</script>
