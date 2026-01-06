# LayersSelectControl

A high-performance React component for selecting layers, inspired by the **Google Maps** layer switcher. It provides a sleek, collapsed preview that expands into a scrollable panel with high-definition thumbnails and descriptions.

## Features

* **Google Maps UI:** Seamlessly transitions between a collapsed thumbnail and an expanded list.
* **Intelligent Image Loading:** The `ManagedImage` system handles HD transitions and fallbacks (`thumbnailHd` -> `thumbnail` -> `noImageThumb`) without UI flickering.
* **Ref/Imperative API:** Access internal state and control selection programmatically using `useImperativeHandle`.
* **Adaptive Positioning:** Anchor the control to any corner using `xRel` and `yRel`.
* **Dynamic Sizing:** Built-in `small`, `medium`, and `large` presets that scale all dimensions via CSS variables.
* **Interactive Scrolling:** Automatically detects overflow and provides navigation arrows for horizontal scrolling.
* **Lifecycle Hooks:** `onExpand` and `onCollapse` callbacks for integration with other UI elements.
* **Touch Optimized:** Includes pointer-event handling and touch-start detection for mobile map environments.

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
| `items` | `LayerItem[]` | **Required** | Array of items to display in the main scrollable area. |
| `onSelect` | `(item: LayerItem) => void` | **Required** | Callback triggered when a layer is selected. |
| `onDefault` | `(item?: LayerItem) => void` | **Required** | Callback for the "Default" tile click. |
| `value` | `string` | - | **Controlled mode**: The ID of the currently selected item. |
| `defaultValue` | `string` | - | **Uncontrolled mode**: The initial ID to be selected. |
| `defaultItem` | `LayerItem` | - | A special tile that appears fixed at the start of the list. |
| `moreItem` | `LayerItem` | - | Custom title/description for the "More" tile. |
| `size` | `"small" | "medium" | "large"` |
| `theme` | `"dark" | "light"` | `"dark"` |
| `maxVisible` | `number` | `5` | Number of items visible before enabling horizontal scroll. |
| `x`, `y` | `number` | `8`, `32` | Numerical offset from the anchor point. |
| `xRel` | `"left" | "right"` | `"left"` |
| `yRel` | `"top" | "bottom"` | `"bottom"` |
| `onMore` | `() => void` | - | If provided, a "More..." tile is appended to the list. |
| `onExpand` | `() => void` | - | Fired when the panel opens. |
| `onCollapse` | `() => void` | - | Fired when the panel closes. |
| `defaultThumb` | `string` | - | Override the default "reset" icon URL. |
| `noImageThumb` | `string` | - | Fallback image for items without thumbnails. |
| `moreThumb` | `string` | - | Icon for the "More" tile. |

## Data Interfaces

### LayerItem

```ts
export interface LayerItem {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;     // Standard thumbnail
    thumbnailHd?: string;   // HD version loaded only when panel expands
}

```

### Imperative Handle (Ref)

You can control the component externally by passing a `ref`:

```ts
export interface LayersSelectControlRef {
    setSelectedItem: (id: string) => void;
    getSelectedItem: () => LayerItem | undefined;
}

```

## Usage Example

```tsx
import React, { useRef } from "react";
import { LayersSelectControl, LayerItem, LayersSelectControlRef } from "layers-select-control";

const LAYERS: LayerItem[] = [
  { 
    id: "satellite", 
    title: "Satellite", 
    description: "Global imagery",
    thumbnail: "/thumbs/sat.jpg", 
    thumbnailHd: "/thumbs/sat-hd.jpg" 
  },
  { id: "terrain", title: "Terrain", description: "Topographic maps", thumbnail: "/thumbs/terrain.jpg" },
];

export const App = () => {
  const controlRef = useRef<LayersSelectControlRef>(null);

  return (
    <div style={{ position: "relative", width: "100%", height: "600px" }}>
      <LayersSelectControl
        ref={controlRef}
        items={LAYERS}
        size="medium"
        theme="light"
        defaultItem={{ id: "base", title: "Standard", description: "Default Map" }}
        onSelect={(item) => console.log("Active Layer:", item.id)}
        onDefault={() => console.log("Reset to default")}
        onMore={() => alert("Open full catalog")}
      />
    </div>
  );
};

```

## Styling & Theme

The component uses scoped CSS logic to manage layouts dynamically:

* **Responsive Scaling:** Uses internal configurations to calculate exact pixel dimensions for thumbnails and tiles.
* **Auto-Width:** Utilizes `ResizeObserver` on the parent container to ensure the expanded panel never overflows the screen boundaries.
* **Pointer Awareness:** Automatically switches between `hover` and `touch` events depending on the user's device.

## License

MIT © [Felipe Carrillo](https://github.com/felipecarrillo100)
