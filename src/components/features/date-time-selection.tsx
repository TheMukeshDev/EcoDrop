"use client"
import { Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DateTimeSelectionProps {
  onDateSelect: (date: string) => void
  onTimeSelect: (time: string) => void
  selectedDate?: string
  selectedTime?: string
}

export function DateTimeSelection({
  onDateSelect,
  onTimeSelect,
  selectedDate,
  selectedTime
}: DateTimeSelectionProps) {
  const today = new Date()
  const maxDate = new Date()
  maxDate.setDate(today.getDate() + 30)

  const availableTimeSlots = [
    { id: "morning", label: "Morning", time: "9:00 AM - 12:00 PM" },
    { id: "afternoon", label: "Afternoon", time: "1:00 PM - 4:00 PM" },
    { id: "evening", label: "Evening", time: "5:00 PM - 8:00 PM" }
  ]

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="date"
            min={today.toISOString().split('T')[0]}
            max={maxDate.toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(e) => onDateSelect(e.target.value)}
            className="w-full p-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {selectedDate && (
            <p className="mt-2 text-sm text-muted-foreground">
              Selected: {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Time Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Select Time Slot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {availableTimeSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => onTimeSelect(slot.time)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedTime === slot.time
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                }`}
              >
                <div className="font-medium">{slot.label}</div>
                <div className="text-sm text-muted-foreground">{slot.time}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}