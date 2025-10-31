const mongoose = require('./db');
const Product = require('./models/product');

// Category mapping based on product names
const categoryKeywords = {
  'Electronics': ['headphone', 'speaker', 'camera', 'laptop', 'phone', 'tablet', 'watch', 'smart'],
  'Apparel': ['shirt', 't-shirt', 'jacket', 'dress', 'hoodie', 'sweater', 'jeans', 'pants'],
  'Bags': ['bag', 'backpack', 'purse', 'tote', 'suitcase', 'luggage'],
  'Watches': ['watch', 'smartwatch', 'timepiece'],
  'Accessories': ['belt', 'wallet', 'sunglasses', 'hat', 'scarf', 'gloves', 'jewelry'],
  'Footwear': ['shoe', 'sneaker', 'boot', 'sandal', 'slipper', 'heel']
};

async function updateProductCategories() {
  try {
    console.log('🔄 Starting category update...\n');
    
    const products = await Product.find();
    console.log(`📦 Found ${products.length} products\n`);
    
    let updated = 0;
    
    for (const product of products) {
      let assignedCategory = 'Electronics'; // Default category
      
      // Check product name and description for keywords
      const searchText = (product.name + ' ' + (product.description || '')).toLowerCase();
      
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        for (const keyword of keywords) {
          if (searchText.includes(keyword.toLowerCase())) {
            assignedCategory = category;
            break;
          }
        }
        if (assignedCategory !== 'Electronics' && assignedCategory === category) break;
      }
      
      // Update the product
      product.category = assignedCategory;
      await product.save();
      updated++;
      
      console.log(`✅ Updated: ${product.name} → ${assignedCategory}`);
    }
    
    console.log(`\n🎉 Successfully updated ${updated} products!`);
    console.log('\n📊 Category Distribution:');
    
    // Show distribution
    for (const category of Object.keys(categoryKeywords)) {
      const count = await Product.countDocuments({ category });
      console.log(`   ${category}: ${count} products`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating categories:', error);
    process.exit(1);
  }
}

// Run the update
updateProductCategories();
