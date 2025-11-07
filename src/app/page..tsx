// src/app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [availabilityResult, setAvailabilityResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicleTypeId: '',
    startDate: '',
    endDate: '',
  });

  const checkAvailability = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleTypeId: formData.vehicleTypeId,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
        }),
      });

      const data = await response.json();
      setAvailabilityResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al verificar disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Lobo Logistics
          </h1>
          <p className="text-xl text-gray-600">
            Renta de vehículos comerciales con sistema de membresías
          </p>
        </div>

        {/* Test de Disponibilidad */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">🔍 Verificar Disponibilidad</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Vehículo</label>
              <select
                value={formData.vehicleTypeId}
                onChange={(e) => setFormData({ ...formData, vehicleTypeId: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un vehículo</option>
                <option value="camion-3-5t">Camión 3.5 Toneladas</option>
                <option value="nissan-estaquitas">Nissan Estaquitas</option>
                <option value="camioneta-pickup">Camioneta Pickup</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Fecha Inicio</label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Fecha Fin</label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={checkAvailability}
              disabled={loading || !formData.vehicleTypeId || !formData.startDate || !formData.endDate}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Verificando...' : 'Verificar Disponibilidad'}
            </button>
          </div>

          {/* Resultado */}
          {availabilityResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              availabilityResult.available 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className="font-bold mb-2">
                {availabilityResult.available ? '✅ Disponible' : '❌ No Disponible'}
              </h3>
              <p className="text-sm">{availabilityResult.message}</p>
              
              {availabilityResult.available && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold">Unidades disponibles:</p>
                  {availabilityResult.availableUnits.map((unit: any) => (
                    <div key={unit.id} className="text-sm bg-white p-2 rounded">
                      🚚 {unit.plateNumber} {unit.nickname ? `"${unit.nickname}"` : ''}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Links de Navegación */}
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4">
          <Link 
            href="/vehicles"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition text-center"
          >
            <div className="text-4xl mb-2">🚚</div>
            <div className="font-semibold">Vehículos</div>
          </Link>

          <Link 
            href="/membership"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition text-center"
          >
            <div className="text-4xl mb-2">⭐</div>
            <div className="font-semibold">Membresías</div>
          </Link>

          <Link 
            href="/dashboard"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition text-center"
          >
            <div className="text-4xl mb-2">📊</div>
            <div className="font-semibold">Dashboard</div>
          </Link>
        </div>

        {/* Status */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>🔧 Sistema en desarrollo | v0.1.0</p>
          <p className="mt-2">
            Usuario de prueba: <code className="bg-gray-200 px-2 py-1 rounded">test@lobologistics.com</code> | 
            Password: <code className="bg-gray-200 px-2 py-1 rounded">password123</code>
          </p>
        </div>
      </div>
    </div>
  );
}