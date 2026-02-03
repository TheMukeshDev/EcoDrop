"use client"

import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { X } from "lucide-react"

import { useTranslation } from "@/context/language-context"

interface QRScannerProps {
    onScan: (qrCode: string) => void
    onError?: (error: string) => void
    onClose: () => void
}

export function QRScanner({ onScan, onError, onClose }: QRScannerProps) {
    const { t } = useTranslation()
    const [isScanning, setIsScanning] = useState(false)
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const stopScanner = async () => {
        const scanner = scannerRef.current
        if (scanner) {
            try {
                // @ts-ignore
                if (scanner.isScanning) {
                    await scanner.stop()
                    scanner.clear()
                }
                setIsScanning(false)
            } catch (err: any) {
                if (!err?.message?.includes("not running")) {
                    console.warn("Error stopping scanner:", err)
                }
                setIsScanning(false)
            }
        }
    }

    useEffect(() => {
        let scanner: Html5Qrcode | null = null

        async function startScanner() {
            try {
                // Cleanup specific element if exists from previous run (fix for "HTML5 Code Scanner is already running")
                const element = document.getElementById("qr-reader")
                if (element?.innerHTML) {
                    element.innerHTML = ""
                }

                setIsScanning(true)
                scanner = new Html5Qrcode("qr-reader")
                scannerRef.current = scanner

                // Wait a bit to ensure DOM is ready and previous streams are closed
                await new Promise(r => setTimeout(r, 100))

                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0
                    },
                    (decodedText) => {
                        onScan(decodedText)
                        stopScanner()
                    },
                    (errorMessage) => {
                        // Ignore
                    }
                )
            } catch (err: any) {
                const errorMsg = err?.message || "Failed to access camera"
                setErrorMessage(errorMsg)
                onError?.(errorMsg)
                setIsScanning(false)
            }
        }

        startScanner()

        return () => {
            stopScanner()
        }
    }, [onScan, onError])

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
            {/* Header */}
            <div className="w-full max-w-md flex justify-between items-center mb-4">
                <h2 className="text-white text-lg font-bold">{t("scan_title")}</h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <X className="h-5 w-5 text-white" />
                </button>
            </div>

            {/* Scanner Container */}
            <div className="w-full max-w-md bg-black rounded-2xl overflow-hidden border-2 border-primary/50">
                <div id="qr-reader" className="w-full"></div>
            </div>

            {/* Instructions */}
            <div className="mt-4 text-white/70 text-sm text-center max-w-md">
                {errorMessage ? (
                    <div className="text-red-400 bg-red-500/10 p-3 rounded-lg">
                        {errorMessage}
                    </div>
                ) : (
                    <p>{t("scan_instruction")}</p>
                )}
            </div>

            {/* Loading / Simulation Controls */}
            {isScanning && !errorMessage && (
                <div className="mt-6 w-full max-w-sm bg-black/50 backdrop-blur-md p-4 rounded-xl border border-white/10">
                    <p className="text-white/70 text-xs font-semibold mb-3 uppercase tracking-wider text-center">
                        ⚡ {t("simulate_scan")}
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { name: "Test Bin", code: "BIN_TEST_01" },
                            { name: "Sangam Ghat", code: "BIN_PRY_001" },
                            { name: "Civil Lines", code: "BIN_PRY_002" },
                            { name: "University", code: "BIN_PRY_003" },
                            { name: "Junction", code: "BIN_PRY_004" },
                            { name: "Anand Bhawan", code: "BIN_PRY_005" }
                        ].map((loc) => (
                            <button
                                key={loc.code}
                                onClick={() => {
                                    stopScanner()
                                    onScan(loc.code)
                                }}
                                className="text-xs bg-white/5 hover:bg-primary/20 hover:text-primary hover:border-primary/50 text-white/90 px-3 py-2 rounded-lg transition-all border border-white/10 text-left truncate"
                            >
                                {loc.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
