# LayersSelectControl

A high-performance React component for selecting layers, inspired by the **Google Maps** layer switcher. It provides a sleek, collapsed preview that expands into a scrollable panel with high-definition thumbnails and descriptions.

## Features

* **Google Maps UI:** Seamlessly transitions between a collapsed thumbnail and an expanded list.
* **Intelligent Image Loading:** The `ManagedImage` system handles HD transitions and fallbacks without UI flickering.
* **Interactive Scrolling:** Automatically provides navigation arrows for horizontal scrolling when items exceed `maxVisible`.
* **Theming & Sizing:** Built-in `dark` and `light` themes with three size presets (`small`, `medium`, `large`).
* **Adaptive Positioning:** Easily anchor the control to any corner of its parent container.
* **Mobile Optimized:** Includes touch-start detection and pointer-event handling for mobile maps.

## Installation

```bash
# Using npm
npm install layers-select-control

# Using yarn
yarn add layers-select-control

```

## Props

The component is highly configurable to fit different map layouts and branding requirements.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `LayerItem[]` | **Required** | Array of items to display in the panel. |
| `onSelect` | `(item: LayerItem) => void` | **Required** | Callback triggered when a layer is selected. |
| `onDefault` | `(item?: LayerItem) => void` | **Required** | Callback for the "Default" tile click. |
| `value` | `string` | - | **Controlled mode**: The ID of the currently selected item. |
| `defaultValue` | `string` | - | **Uncontrolled mode**: The initial ID to be selected. |
| `defaultItem` | `LayerItem` | - | Optional item that appears as the "Default" tile. |
| `size` | `"small" | "medium" | "large"` | `"small"` | Adjusts dimensions of the control and tiles. |
| `theme` | `"dark" | "light"` | `"dark"` | Built-in color scheme. |
| `maxVisible` | `number` | `4` | Number of items visible before enabling horizontal scroll. |
| `x`, `y` | `number` | `8`, `32` | Numerical offset from the anchor point. |
| `xRel` | `"left" | "right"` | `"left"` | Horizontal anchor (relative to parent). |
| `yRel` | `"top" | "bottom"` | `"bottom"` | Vertical anchor (relative to parent). |
| `onMore` | `() => void` | - | If provided, a "More..." tile is appended to the list. |
| `hoverCloseDelayMs` | `number` | `160` | Delay before closing the panel on `mouseleave`. |
| `panelGap` | `number` | `8` | Space between the collapsed thumb and the panel. |
| `parentGap` | `number` | `8` | Margin maintained between the panel and the parent edge. |

## Data Interfaces

### LayerItem

```ts
export interface LayerItem {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;     // Standard thumbnail
    thumbnailHd?: string;   // High-quality version loaded when expanded
}

```

## Usage Example

```tsx
import React from "react";
import { LayersSelectControl, LayerItem } from "layers-select-control";

const LAYERS: LayerItem[] = [
  { 
    id: "satellite", 
    title: "Satellite", 
    description: "Global imagery",
    thumbnail: "/thumbs/sat.jpg", 
    thumbnailHd: "/thumbs/sat-hd.jpg" 
  },
  { id: "terrain", title: "Terrain", description: "Topographic maps", thumbnail: "/thumbs/terrain.jpg" },
  { id: "streets", title: "Streets", description: "Urban navigation", thumbnail: "/thumbs/streets.jpg" },
];

export const App = () => {
  return (
    <div style={{ position: "relative", width: "100%", height: "500px", background: "#eee" }}>
      <LayersSelectControl
        items={LAYERS}
        size="medium"
        theme="light"
        onSelect={(item) => console.log("Selected:", item.title)}
        onDefault={() => console.log("Reset to default")}
        onMore={() => alert("Open full catalog")}
      />
    </div>
  );
};

```

## Styling & Theme

The component uses scoped CSS injected via a `<style>` tag, ensuring no styles leak out to the rest of your application. It supports:

* **Automatic Overflow:** Handles parent container width constraints using `ResizeObserver`.
* **Responsive Scaling:** Sizes automatically adjust based on the `size` prop.

## License

MIT © [Felipe Carrillo](https://github.com/felipecarrillo100)
