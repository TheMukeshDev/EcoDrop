"use client"

import { motion } from "framer-motion"
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface LocationPermissionFallbackProps {
    onRetry?: () => void
    onManualVerification?: () => void
}

export function LocationPermissionFallback({ 
    onRetry, 
    onManualVerification 
}: LocationPermissionFallbackProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
        >
            <Card className="border-2 border-orange-200 bg-orange-50">
                <CardContent className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-orange-800">Location Required</h3>
                            <p className="text-sm text-orange-600">Verification needs location access</p>
                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="space-y-3">
                        <p className="text-sm text-orange-700">
                            To verify your e-waste drop, we need to confirm you're within 50 meters of the selected bin. This helps prevent fraud and ensures accurate tracking.
                        </p>

                        <div className="bg-white/50 rounded-lg p-3 space-y-2">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-orange-600 mt-0.5" />
                                <div className="text-sm text-orange-700">
                                    <strong>Why location is needed:</strong>
                                    <ul className="mt-1 ml-4 list-disc space-y-1">
                                        <li>Verify proximity to E-Bin</li>
                                        <li>Prevent false confirmations</li>
                                        <li>Ensure accurate impact tracking</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                        <Button 
                            onClick={onRetry}
                            className="w-full bg-orange-600 hover:bg-orange-700"
                            size="sm"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Enable Location Access
                        </Button>
                        
                        {onManualVerification && (
                            <Button 
                                variant="outline" 
                                onClick={onManualVerification}
                                className="w-full border-orange-200 text-orange-700 hover:bg-orange-100"
                                size="sm"
                            >
                                Use Manual Verification
                            </Button>
                        )}
                    </div>

                    {/* Quick Fix Instructions */}
                    <div className="text-xs text-orange-600 bg-orange-100 rounded-lg p-2">
                        <strong>Quick fix:</strong> Look for location icon 📍 in your browser address bar and click "Allow"
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}