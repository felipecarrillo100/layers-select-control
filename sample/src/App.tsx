import React, { useState, useRef } from "react";
import './App.css';
import '../../src/styles.scss';
import {LayersSelectControl} from "../../src";
import {LayersSelectControlRef} from "../../src/LayersSelectControl";

const ExternalItem =     {
    id: "foggy-forest",
    title: "Foggy Forest Landscape",
    description: "Misty forest with towering trees and soft fog",
    thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&fit=crop&auto=format",
    thumbnailHd: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&fit=crop&auto=format"
}

const PrimaryItem =     {
        id: "girl",
        title: "Cute girl",
        description: "Read head my love",
        thumbnail: "https://ix-marketing.imgix.net/focalpoint.png?ixembed=1731955445055&auto=format,compress",
        thumbnailHd: "https://ix-marketing.imgix.net/focalpoint.png?ixembed=1731955445055&auto=format,compress"
    }
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
    const ref1 = useRef<LayersSelectControlRef>(null);
    const ref2 = useRef<LayersSelectControlRef>(null);
    const [value, setValue] = useState("urban");
    const setExternal = () =>{
        ref1.current?.setSelectedItem(ExternalItem.id);
        ref2.current?.setSelectedItem(ExternalItem.id);
    }
    return (
        <>
            <div dir="ltr">
                <LayersSelectControl
                    x={10}
                    y={280}
                    theme="light"
                    size="large"
                    value={value}
                    defaultItem={PrimaryItem}
                    moreItem={{id: "", title:"More more", description:"Show moreeee"}}
                    items={layers}
                    onSelect={(item) => {
                        setValue(item.id)
                        console.log("Stateless/Selected:", item)
                    }}
                    onMore={() => console.log("More clicked")}
                    onDefault={(item) => {
                        item && setValue(item.id);
                        console.log("Stateless/UseDefault")
                    }}
                    panelGap={4}
                    parentGap={4}
                    defaultThumb="./firstplace.svg"
                    noImageThumb="noimage.png"
                    moreThumb="./multiple-images.png"
                />
            </div>
            <div dir="ltr">
                <LayersSelectControl
                    ref={ref1}
                    title={"Mexico"}
                    externalItem={ExternalItem}
                    x={10}
                    y={180}
                    theme="light"
                    defaultValue="urban"
                    defaultItem={PrimaryItem}
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
                    ref={ref2}
                    title={"Mexico"}
                    externalItem={ExternalItem}
                    size="medium"
                    xRel="left"
                    items={layers}
                    defaultValue="urban"
                    defaultItem={PrimaryItem}
                    onSelect={(item) => console.log("Selected:", item)}
                    onMore={() => console.log("More clicked")}
                    onDefault={() => console.log("UseDefault")}
                    panelGap={4}
                    parentGap={4}
                />
            </div>
            <button onClick={setExternal}>Here</button>
        </>
    );
};

export default App;
