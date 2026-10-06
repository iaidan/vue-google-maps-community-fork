import type {App, Component} from 'vue'

export interface InstallOptions {
  installComponents?: boolean
  autobindAllEvents?: boolean
  load?: Record<string, any>
}

export interface PluginInstallFunction {
  (app: App, options?: InstallOptions): void
}

export const loadGMapApi: (options: Record<string, any>) => void

export const Marker: Component
export const AdvancedMarker: Component
export const Polyline: Component
export const Polygon: Component
export const Circle: Component
export const GMapCluster: Component
export const Rectangle: Component
export const InfoWindow: Component
export const Map: Component
export const Heatmap: Component
export const Autocomplete: Component
export const PlaceAutocomplete: Component

declare module 'vue' {
  export interface GlobalComponents {
    GMapMap: typeof Map
    GMapMarker: typeof Marker
    GMapAdvancedMarker: typeof AdvancedMarker
    GMapInfoWindow: typeof InfoWindow
    GMapCluster: typeof GMapCluster
    GMapPolyline: typeof Polyline
    GMapPolygon: typeof Polygon
    GMapCircle: typeof Circle
    GMapRectangle: typeof Rectangle
    GMapAutocomplete: typeof Autocomplete
    GMapPlaceAutocomplete: typeof PlaceAutocomplete
    GMapHeatmap: typeof Heatmap
  }
}

declare const plugin: PluginInstallFunction
export default plugin
