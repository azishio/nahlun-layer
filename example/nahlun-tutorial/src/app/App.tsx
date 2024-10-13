"use client";

import {DeckGL} from "@deck.gl/react";
import {useRef} from "react";
import {NahlunLayer, NahlunLayerData} from "@azishio/nahlun-layer";

export function App() {

    const nahlunData = useRef(new NahlunLayerData("localhost:3001", "localhost:3002"));

    const layer = new NahlunLayer({
        data: nahlunData.current,
    });

    return (
        <DeckGL
            initialViewState={
                {
                    longitude: 139.691722,
                    latitude: 35.689501,
                    zoom: 10
                }
            }
            controller
            layers={[layer]}
        >
        </DeckGL>
    );
}
