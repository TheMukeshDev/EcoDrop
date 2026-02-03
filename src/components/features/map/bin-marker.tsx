"use client"

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps"
import { IBin } from "@/models/Bin"

// Type adapter for Client side (Mongoose _id vs string)
export type MapBin = Omit<IBin, "_id"> & { _id: string }

interface BinMarkerProps {
    bin: MapBin
    onClick: (bin: MapBin) => void
}

export function BinMarker({ bin, onClick }: BinMarkerProps) {
    return (
        <AdvancedMarker
            position={{ lat: bin.latitude, lng: bin.longitude }}
            onClick={() => onClick(bin)}
        >
            <Pin
                background={getBinColor(bin.status)}
                glyphColor={"#fff"}
                borderColor={"#fff"}
            />
        </AdvancedMarker>
    )
}

function getBinColor(status: string) {
    switch (status) {
        case "operational": return "#22c55e" // green-500
        case "full": return "#ef4444" // red-500
        case "maintenance": return "#eab308" // yellow-500
        default: return "#9ca3af" // gray-400
    }
}
