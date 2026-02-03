"use client"

import { Package, MapPin, Calendar, Clock, CheckCircle, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PickupDetails {
  wasteType: string
  date: string
  time: string
  address: string
  specialInstructions?: string
}

interface ConfirmationFlowProps {
  pickupDetails: PickupDetails
  onConfirm: () => void
  onBack: () => void
  isSubmitting?: boolean
}

export function ConfirmationFlow({
  pickupDetails,
  onConfirm,
  onBack,
  isSubmitting = false
}: ConfirmationFlowProps) {
  const wasteTypes: Record<string, string> = {
    "e-waste": "E-Waste (Electronics)",
    "furniture": "Large Appliances", 
    "mixed": "Mixed Recyclables"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-center">Confirm Pickup Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Waste Type */}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Waste Type</h3>
              <p className="text-sm text-muted-foreground">
                {wasteTypes[pickupDetails.wasteType] || pickupDetails.wasteType}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Date & Time</h3>
              <p className="text-sm text-muted-foreground">
                {pickupDetails.date && new Date(pickupDetails.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {pickupDetails.time}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Pickup Address</h3>
              <p className="text-sm text-muted-foreground">{pickupDetails.address}</p>
            </div>
          </div>

          {/* Special Instructions */}
          {pickupDetails.specialInstructions && (
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Special Instructions</h3>
                <p className="text-sm text-muted-foreground">{pickupDetails.specialInstructions}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="bg-blue-50 border-blue-100">
        <CardContent className="pt-6">
          <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Please have items ready 15 minutes before the scheduled time</li>
            <li>• Our team will call you upon arrival</li>
            <li>• You can track pickup status in real-time</li>
            <li>• Free cancellation up to 2 hours before pickup</li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={onConfirm}
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Confirming..."
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Confirm Pickup
            </>
          )}
        </Button>
      </div>
    </div>
  )
}