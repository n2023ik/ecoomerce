const mongoose = require('./db');
const Product = require('./models/product');

const sampleProducts = [
  {
    name: 'Wireless Headphones Pro',
    description: 'Premium noise-cancelling headphones with 40hr battery life and crystal clear sound quality',
    price: 149.99,
    images: ['headphones.jpg']
  },
  {
    name: 'Smart Watch Ultra',
    description: 'Track your fitness, monitor health, and stay connected on the go with this advanced smartwatch',
    price: 299.99,
    images: ['smartwatch.jpg']
  },
  {
    name: 'Laptop Pro 15"',
    description: 'Powerful laptop for professionals and creators with 16GB RAM and 512GB SSD',
    price: 1299.99,
    images: ['laptop.jpg']
  },
  {
    name: 'Smartphone X Max',
    description: 'Latest flagship phone with amazing 108MP camera and 5G connectivity',
    price: 899.99,
    images: ['smartphone.jpg']
  },
  {
    name: 'Tablet Plus 12"',
    description: 'Perfect for work and entertainment with stunning display and all-day battery',
    price: 499.99,
    images: ['tablet.jpg']
  },
  {
    name: 'Camera 4K Mirrorless',
    description: 'Professional mirrorless camera with 4K video recording and interchangeable lenses',
    price: 1499.99,
    images: ['camera.jpg']
  },
  {
    name: 'Gaming Console Next-Gen',
    description: 'Experience next-gen gaming with ray tracing and 120fps support',
    price: 499.99,
    images: ['console.jpg']
  },
  {
    name: 'Bluetooth Speaker Premium',
    description: 'Portable wireless speaker with 360° sound and waterproof design',
    price: 79.99,
    images: ['speaker.jpg']
  },
  {
    name: 'Wireless Earbuds Pro',
    description: 'True wireless earbuds with active noise cancellation and premium sound',
    price: 199.99,
    images: ['earbuds.jpg']
  },
  {
    name: 'Gaming Keyboard RGB',
    description: 'Mechanical gaming keyboard with customizable RGB lighting and macro keys',
    price: 129.99,
    images: ['keyboard.jpg']
  },
  {
    name: 'Gaming Mouse Wireless',
    description: 'High-precision wireless gaming mouse with 16000 DPI and programmable buttons',
    price: 89.99,
    images: ['mouse.jpg']
  },
  {
    name: '4K Monitor 27"',
    description: 'Ultra HD monitor with HDR support and 144Hz refresh rate for gaming',
    price: 449.99,
    images: ['monitor.jpg']
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    
    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully added ${products.length} products to the database!`);
    
    console.log('\n📦 Sample products:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price}`);
    });
    
    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Wait for MongoDB connection before seeding
setTimeout(() => {
  seedDatabase();
}, 2000);
