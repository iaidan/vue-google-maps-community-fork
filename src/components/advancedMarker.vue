<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
import buildComponent from './build-component.js';

const props = {
  position: {
    type: Object,
    twoWay: true,
    required: true,
  },
  title: {
    type: String,
    twoWay: true,
  },
  zIndex: {
    type: Number,
    twoWay: true,
  },
  clickable: {
    type: Boolean,
    default: true,
  },
  content: {
    type: [String, Object],
  },
  pinOptions: {
    type: Object,
  },
  draggable: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object,
  },
};

const events = [
  'click', // emitted as alias of gmp-click
  'gmp-click',
  'gmp-dragstart',
  'gmp-drag',
  'gmp-dragend',
  'position_changed',
  'zindex_changed',
  'title_changed',
];

export default buildComponent({
  mappedProps: props,
  events,
  name: 'advancedMarker',
  ctr: () => {
    const ctor = google?.maps?.marker?.AdvancedMarkerElement;
    if (!ctor) {
      throw new Error('google.maps.marker.AdvancedMarkerElement is not available');
    }
    return ctor;
  },

  emits: events,

  unmounted() {
    if (!this.$advancedMarkerObject) return;
    const inst = this.$advancedMarkerObject;
    if (inst && inst.setMap) inst.setMap(null);
  },

  beforeCreate(options) {
    if (Object.prototype.hasOwnProperty.call(options, 'clickable')) {
      options.gmpClickable = !!options.clickable;
      delete options.clickable;
    }

    if (Object.prototype.hasOwnProperty.call(options, 'draggable')) {
      options.gmpDraggable = !!options.draggable;
      delete options.draggable;
    }

    ;['animation', 'shape', 'cursor', 'visible', 'icon', 'label', 'place'].forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(options, k)) delete options[k];
    });

    try {
      if ((this.pinOptions && typeof options.content === 'undefined') || (this.pinOptions && options.content == null)) {
        const PinElement = google?.maps?.marker?.PinElement;
        if (PinElement) {
          options.content = new PinElement(this.pinOptions).element;
        }
      }
    } catch (e) {
      /* ignore */
    }

    if (typeof options.content === 'string') {
      const el = document.createElement('div');
      el.innerHTML = options.content;
      options.content = el;
    }
  },

  afterCreate(inst) {
    const normalizeContent = (val) => {
      if (val == null) return null;
      if (typeof val === 'string') {
        const el = document.createElement('div');
        el.innerHTML = val;
        return el;
      }
      return val;
    };

    try {
      const PinElement = google?.maps?.marker?.PinElement;
      if (this.pinOptions && PinElement) {
        inst.content = new PinElement(this.pinOptions).element;
      } else {
        inst.content = normalizeContent(this.content);
      }
    } catch (e) {
      /* ignore */
    }

    events.forEach((event) => {
      inst.addListener(event, (payload) => {
        this.$emit(event, payload);
      });
    });

    inst.addListener('gmp-click', (payload) => this.$emit('click', payload));


    this.$watch(
      'content',
      (val) => {
        try {
          inst.content = normalizeContent(val);
        } catch (e) {
          /* ignore */
        }
      },
      {immediate: false}
    );

    this.$watch(
      'pinOptions',
      (val) => {
        try {
          const PinElement = google?.maps?.marker?.PinElement;
          if (val && PinElement) {
            inst.content = new PinElement(val).element;
          } else {
            inst.content = normalizeContent(this.content);
          }
        } catch (e) {
          /* ignore */
        }
      },
      {immediate: false}
    );

    this.$watch(
      'clickable',
      (val) => {
        if (Object.prototype.hasOwnProperty.call(inst, 'gmpClickable')) {
          inst.gmpClickable = !!val;
        }
      },
      {immediate: false}
    );

    this.$watch(
      'draggable',
      (val) => {
        if (Object.prototype.hasOwnProperty.call(inst, 'gmpDraggable')) {
          inst.gmpDraggable = !!val;
        }
      },
      {immediate: false}
    );

    this.$watch(
      'zIndex',
      (val) => {
        if (typeof val !== 'undefined' && val !== null) {
          try {
            inst.zIndex = val;
          } catch (e) {
            /* ignore */
          }
        }
      },
      {immediate: false}
    );
  },
});
</script>
