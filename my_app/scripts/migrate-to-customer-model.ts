const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateToCustomerModel() {
  try {
    console.log('Starting migration to Customer model...')

    // 1. Get all unique customer phone numbers from orders
    const uniqueCustomers = await prisma.order.groupBy({
      by: ['phoneNumber', 'customerName', 'marketingConsent'],
      _count: {
        id: true
      },
      _min: {
        createdAt: true
      },
      _max: {
        createdAt: true
      }
    })

    console.log(`Found ${uniqueCustomers.length} unique customers`)

    // 2. Create Customer records
    for (const customer of uniqueCustomers) {
      const newCustomer = await prisma.customer.create({
        data: {
          phoneNumber: customer.phoneNumber,
          name: customer.customerName,
          marketingConsent: customer.marketingConsent,
          firstOrder: customer._min.createdAt,
          lastOrder: customer._max.createdAt,
          orderCount: customer._count.id,
          createdAt: customer._min.createdAt,
          updatedAt: new Date(),
        }
      })

      // 3. Link orders to the new customer
      await prisma.order.updateMany({
        where: {
          phoneNumber: customer.phoneNumber,
          customerId: null // Only update orders that haven't been linked yet
        },
        data: {
          customerId: newCustomer.id
        }
      })

      console.log(`Migrated customer ${customer.phoneNumber} with ${customer._count.id} orders`)
    }

    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

migrateToCustomerModel()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  }) 