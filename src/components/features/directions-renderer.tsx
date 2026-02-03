
import { useEffect, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";

interface DirectionsRendererProps {
    directions: google.maps.DirectionsResult;
    options?: google.maps.DirectionsRendererOptions;
}

export function DirectionsRenderer({ directions, options }: DirectionsRendererProps) {
    const map = useMap();
    const [renderer, setRenderer] = useState<google.maps.DirectionsRenderer | null>(null);

    useEffect(() => {
        if (!map) return;
        setRenderer(new google.maps.DirectionsRenderer(options));
    }, [map, options]); // Careful with options object reference equality

    useEffect(() => {
        if (!renderer || !map) return;
        renderer.setMap(map);
        return () => {
            renderer.setMap(null);
        };
    }, [renderer, map]);

    useEffect(() => {
        if (!renderer) return;
        renderer.setDirections(directions);
    }, [renderer, directions]);

    return null;
}
