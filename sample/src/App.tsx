import React, { useState } from "react";
import './App.css';
import { LayersSelectControl } from "../../src";

const layers = [
    {
        id: "forest",
        title: "Forest Map",
        description: "Detailed forest cover and vegetation",
        thumbnail: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=200&q=60",
        thumbnailHd: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "desert",
        title: "Desert Map",
        description: "Arid regions and desert terrain",
        thumbnail: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=200&q=60",
        thumbnailHd: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "urban",
        title: "Urban Map",
        description: "City layouts and building footprints",
        thumbnail: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=200&q=60",
        thumbnailHd: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "winter",
        title: "Winter Map",
        description: "Snow-covered regions and icy terrain",
        thumbnail: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=200&q=60",
        thumbnailHd: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "satellite-night",
        title: "Satellite Night",
        description: "Night-time satellite imagery",
        thumbnail: "https://images.unsplash.com/photo-1502209524169-6d0f6cf4c7cd?auto=format&fit=crop&w=200&q=60",
        thumbnailHd: "https://images.unsplash.com/photo-1502209524169-6d0f6cf4c7cd?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "coastal",
        title: "Coastal Map",
        description: "Shorelines, beaches, and harbors",
        thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=60",
        thumbnailHd: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    }
];


const App: React.FC = () => {
    return (
        <>
            <div dir="ltr">
                <LayersSelectControl
                    x={10}
                    y={180}
                    theme="light"
                    items={layers}
                    onSelect={(item) => console.log("Selected:", item)}
                    onMore={() => console.log("More clicked")}
                    onDefault={() => console.log("UseDefault")}
                    panelGap={4}
                    parentGap={4}
                    defaultThumb="./firstplace.svg"
                    noImageThumb="noimage.png"
                    moreThumb="./multiple-images.png"
                />
            </div>
            <div dir="ltr">
                <LayersSelectControl
                    size="medium"
                    xRel="left"
                    items={layers}
                    onSelect={(item) => console.log("Selected:", item)}
                    onMore={() => console.log("More clicked")}
                    onDefault={() => console.log("UseDefault")}
                    panelGap={4}
                    parentGap={4}

                />
            </div>
        </>
    );
};

export default App;
