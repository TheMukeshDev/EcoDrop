"use client"

import { useState } from "react"
import { MapPin, Plus, Edit2, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Address {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  isDefault?: boolean
}

interface AddressManagementProps {
  selectedAddress?: string
  onAddressSelect: (address: string) => void
}

export function AddressManagement({
  selectedAddress,
  onAddressSelect
}: AddressManagementProps) {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      street: "123 Green Street",
      city: "Prayagraj",
      state: "Uttar Pradesh",
      zipCode: "211001",
      isDefault: true
    },
    {
      id: "2", 
      street: "456 Eco Avenue",
      city: "Prayagraj",
      state: "Uttar Pradesh",
      zipCode: "211002"
    }
  ])

  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: ""
  })

  const formatAddress = (address: Address) => 
    `${address.street}, ${address.city}, ${address.state} - ${address.zipCode}`

  const handleAddAddress = () => {
    if (newAddress.street && newAddress.city && newAddress.state && newAddress.zipCode) {
      const address: Address = {
        id: Date.now().toString(),
        ...newAddress
      }
      setAddresses([...addresses, address])
      setNewAddress({ street: "", city: "", state: "", zipCode: "" })
      setIsAddingAddress(false)
    }
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id))
  }

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Pickup Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Addresses */}
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedAddress === formatAddress(address) || 
                (selectedAddress === "" && address.isDefault)
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onAddressSelect(formatAddress(address))}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium">{formatAddress(address)}</div>
                  {address.isDefault && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full mt-1 inline-block">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSetDefault(address.id)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteAddress(address.id)
                    }}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Address */}
        {!isAddingAddress ? (
          <Button
            variant="outline"
            onClick={() => setIsAddingAddress(true)}
            className="w-full border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Address
          </Button>
        ) : (
          <div className="space-y-3 p-4 border-2 border-dashed border-border rounded-xl">
            <input
              type="text"
              placeholder="Street Address"
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
              className="w-full p-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="w-full p-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                className="w-full p-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <input
              type="text"
              placeholder="ZIP Code"
              value={newAddress.zipCode}
              onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
              className="w-full p-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <Button onClick={handleAddAddress} size="sm">
                Add Address
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingAddress(false)
                  setNewAddress({ street: "", city: "", state: "", zipCode: "" })
                }}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}