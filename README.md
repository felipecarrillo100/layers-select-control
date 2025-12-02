# LayersSelectControl

A React component for selecting layers with thumbnails, titles, and descriptions. Inspired by Google Maps layer selection, it provides a collapsed view with a single thumbnail and an expandable scrollable panel for multiple items.

## Features

* Collapsed and expandable views
* Default item and optional "More…" tile
* Smooth thumbnail loading (`ManagedImage`)
* Scrollable horizontal list with arrow buttons
* Supports dark and light themes
* Fully keyboard accessible
* Touch detection for mobile devices
* Configurable maximum visible items
* Customizable size: small, medium, large
* Parent and panel gap adjustments

## Installation

```bash
# Using npm
npm install your-package-name

# Using yarn
yarn add your-package-name
```

## Props

| Prop                | Type                             | Default               | Description                                              |
| ------------------- | -------------------------------- | --------------------- | -------------------------------------------------------- |
| `items`             | `LayerItem[]`                    | -                     | Array of items to display                                |
| `defaultItem`       | `LayerItem`                      | -                     | Optional default item                                    |
| `x`                 | `number`                         | 8                     | X offset of collapsed control                            |
| `y`                 | `number`                         | 32                    | Y offset of collapsed control                            |
| `xRel`              | `"left" \| "right"`              | `"left"`              | Horizontal anchor                                        |
| `yRel`              | `"top" \| "bottom"`              | `"bottom"`            | Vertical anchor                                          |
| `onDefault`         | `(item?: LayerItem) => void`     | -                     | Callback when default tile clicked                       |
| `onSelect`          | `(item: LayerItem) => void`      | -                     | Callback when an item is selected                        |
| `onMore`            | `() => void`                     | -                     | Optional callback for "More…" tile                       |
| `maxVisible`        | `number`                         | 4                     | Maximum number of visible items in panel                 |
| `hoverCloseDelayMs` | `number`                         | 160                   | Delay before closing panel on hover leave                |
| `theme`             | `"dark" \| "light"`              | `"dark"`              | Theme of the control                                     |
| `defaultThumb`      | `string`                         | `"./firstplace.svg"`  | Default thumbnail image URL                              |
| `noImageThumb`      | `string`                         | `"./noimage.png"`     | Fallback image if no thumbnail is available              |
| `moreThumb`         | `string`                         | `"./more-images.png"` | Image for "More…" tile                                   |
| `size`              | `"small" \| "medium" \| "large"` | `"small"`             | Size of collapsed and tile thumbnails                    |
| `panelGap`          | `number`                         | 8                     | Gap between collapsed thumbnail and expanded panel       |
| `parentGap`         | `number`                         | 8                     | Distance from expanded panel's far edge to parent border |

## LayerItem Interface

```ts
export interface LayerItem {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    thumbnailHd?: string;
}
```

## Usage Example

```tsx
import React from "react";
import { LayersSelectControl, LayerItem } from "./LayerSelectControl";

const items: LayerItem[] = [
  { id: "satellite", title: "Satellite", thumbnail: "/sat.jpg", thumbnailHd: "/sat-hd.jpg" },
  { id: "terrain", title: "Terrain", thumbnail: "/terrain.jpg" },
  { id: "streets", title: "Streets", thumbnail: "/streets.jpg" },
];

export const App = () => {
  const handleSelect = (item: LayerItem) => {
    console.log("Selected:", item);
  };

  const handleDefault = (item?: LayerItem) => {
    console.log("Default selected:", item);
  };

  const handleMore = () => {
    console.log("Show all items");
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <LayersSelectControl
        items={items}
        onSelect={handleSelect}
        onDefault={handleDefault}
        onMore={handleMore}
        maxVisible={3}
        theme="dark"
      />
    </div>
  );
};
```

## Styling

The component uses inline scoped styles and supports customization via `theme` prop (`dark` or `light`) and `size` prop.

## License

MIT
