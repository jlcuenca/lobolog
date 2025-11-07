// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // 1. Crear usuario de prueba
  const hashedPassword = await hash('password123', 12);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@lobologistics.com' },
    update: {},
    create: {
      email: 'test@lobologistics.com',
      name: 'Usuario de Prueba',
      password: hashedPassword,
      phone: '5512345678',
      licenseNumber: 'ABC123456',
      city: 'Ciudad de México',
      state: 'CDMX',
    },
  });
  console.log('✅ Usuario de prueba creado:', testUser.email);

  // 2. Crear tipos de vehículos
  const camion35t = await prisma.vehicleType.upsert({
    where: { slug: 'camion-3-5t' },
    update: {},
    create: {
      slug: 'camion-3-5t',
      name: 'Camión 3.5 Toneladas',
      description: 'Camión de carga ideal para mudanzas y transporte de materiales',
      category: 'CAMION',
      capacity: '3.5 toneladas',
      dimensions: '6m x 2.5m x 2.8m',
      features: ['Rampa hidráulica', 'GPS', 'Caja cerrada', 'Aire acondicionado'],
      images: ['https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Camion+3.5t'],
      thumbnail: 'https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Camion+3.5t',
      isActive: true,
      priority: 1,
    },
  });

  const nissanEstaquitas = await prisma.vehicleType.upsert({
    where: { slug: 'nissan-estaquitas' },
    update: {},
    create: {
      slug: 'nissan-estaquitas',
      name: 'Nissan Estaquitas',
      description: 'Camioneta estaquitas perfecta para transporte local',
      category: 'CAMIONETA',
      capacity: '1.5 toneladas',
      dimensions: '4m x 2m x 1.8m',
      features: ['Lona protectora', 'Fácil acceso', 'Económica'],
      images: ['https://via.placeholder.com/800x600/50C878/FFFFFF?text=Nissan+Estaquitas'],
      thumbnail: 'https://via.placeholder.com/400x300/50C878/FFFFFF?text=Nissan+Estaquitas',
      isActive: true,
      priority: 2,
    },
  });

  const pickup = await prisma.vehicleType.upsert({
    where: { slug: 'camioneta-pickup' },
    update: {},
    create: {
      slug: 'camioneta-pickup',
      name: 'Camioneta Pickup',
      description: 'Pickup 4x4 ideal para cargas ligeras y terrenos difíciles',
      category: 'CAMIONETA',
      capacity: '1 tonelada',
      dimensions: '3m x 1.8m x 1.5m',
      features: ['4x4', 'Caja abierta', 'Bluetooth', 'Aire acondicionado'],
      images: ['https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Pickup+4x4'],
      thumbnail: 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Pickup+4x4',
      isActive: true,
      priority: 3,
    },
  });
  console.log('✅ Tipos de vehículos creados');

  // 3. Crear unidades de vehículos
  await prisma.vehicleUnit.createMany({
    data: [
      {
        vehicleTypeId: camion35t.id,
        plateNumber: 'ABC-123-MEX',
        nickname: 'El Rápido',
        status: 'AVAILABLE',
        kilometers: 45000,
        currentLocation: 'Bodega Norte',
      },
      {
        vehicleTypeId: camion35t.id,
        plateNumber: 'DEF-456-MEX',
        nickname: 'El Confiable',
        status: 'AVAILABLE',
        kilometers: 32000,
        currentLocation: 'Bodega Norte',
      },
      {
        vehicleTypeId: nissanEstaquitas.id,
        plateNumber: 'GHI-789-MEX',
        status: 'AVAILABLE',
        kilometers: 67000,
        currentLocation: 'Bodega Sur',
      },
      {
        vehicleTypeId: pickup.id,
        plateNumber: 'JKL-012-MEX',
        nickname: 'La Todoterreno',
        status: 'AVAILABLE',
        kilometers: 28000,
        currentLocation: 'Bodega Norte',
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Unidades de vehículos creadas');

  // 4. Crear reglas de precios
  // Camión 3.5t
  await prisma.pricingRule.createMany({
    data: [
      {
        vehicleTypeId: camion35t.id,
        durationType: 'HOURLY',
        basePrice: 250,
        pricePerExtraKm: 8,
        includedKm: 50,
        priority: 1,
      },
      {
        vehicleTypeId: camion35t.id,
        durationType: 'DAILY',
        basePrice: 1800,
        pricePerExtraKm: 8,
        includedKm: 200,
        priority: 2,
      },
      {
        vehicleTypeId: camion35t.id,
        durationType: 'WEEKLY',
        basePrice: 10000,
        pricePerExtraKm: 7,
        includedKm: 1500,
        priority: 3,
      },
    ],
    skipDuplicates: true,
  });

  // Nissan Estaquitas
  await prisma.pricingRule.createMany({
    data: [
      {
        vehicleTypeId: nissanEstaquitas.id,
        durationType: 'HOURLY',
        basePrice: 180,
        pricePerExtraKm: 6,
        includedKm: 40,
        priority: 1,
      },
      {
        vehicleTypeId: nissanEstaquitas.id,
        durationType: 'DAILY',
        basePrice: 1200,
        pricePerExtraKm: 6,
        includedKm: 150,
        priority: 2,
      },
    ],
    skipDuplicates: true,
  });

  // Pickup
  await prisma.pricingRule.createMany({
    data: [
      {
        vehicleTypeId: pickup.id,
        durationType: 'HOURLY',
        basePrice: 200,
        pricePerExtraKm: 7,
        includedKm: 45,
        priority: 1,
      },
      {
        vehicleTypeId: pickup.id,
        durationType: 'DAILY',
        basePrice: 1500,
        pricePerExtraKm: 7,
        includedKm: 180,
        priority: 2,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Reglas de precios creadas');

  // 5. Crear planes de membresía (IMPORTANTE: actualizar con Stripe Price IDs reales)
  await prisma.membershipTier.createMany({
    data: [
      {
        slug: 'socio',
        name: 'Socio',
        description: 'Plan básico con descuento en todas las rentas',
        monthlyPrice: 300,
        benefitType: 'DISCOUNT',
        benefits: {
          discountPercent: 15,
          appliesTo: 'all',
        },
        features: [
          '15% de descuento en todas las rentas',
          'Reservas prioritarias',
          'Soporte por WhatsApp',
        ],
        priority: 1,
        stripePriceId: null, // Actualizar después de crear en Stripe
      },
      {
        slug: 'frecuente',
        name: 'Frecuente',
        description: 'Plan intermedio con banco de días incluidos',
        monthlyPrice: 5000,
        benefitType: 'CREDIT_BANK',
        benefits: {
          includedDays: 12,
          rollover: false,
          discountAfterDepletion: 10,
        },
        features: [
          '12 días de uso incluidos al mes',
          '10% de descuento adicional al agotar días',
          'Prioridad alta en asignación',
          'Soporte telefónico 24/7',
        ],
        priority: 2,
        stripePriceId: null,
      },
      {
        slug: 'pro',
        name: 'Pro',
        description: 'Plan premium personalizado',
        monthlyPrice: 15000,
        benefitType: 'CUSTOM',
        benefits: {
          customDiscount: 25,
          prioritySupport: true,
          dedicatedVehicle: true,
        },
        features: [
          '25% de descuento permanente',
          'Vehículo dedicado opcional',
          'Gerente de cuenta personal',
          'Condiciones personalizadas',
          'Facturación especial',
        ],
        priority: 3,
        stripePriceId: null,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Planes de membresía creados');

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });