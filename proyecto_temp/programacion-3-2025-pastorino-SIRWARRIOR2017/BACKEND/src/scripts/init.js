const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('../config/database');
const { Product, Category, User } = require('../models');

const IMAGE_FIX_MAP = {
  categories: {
    'Procesadores': '/uploads/products/Sin_titulo-1763044295305-852818271.jpg',
    'Tarjetas Gráficas': '/uploads/products/x1-301-jpg-1761844706591-335621029.webp',
    'Memoria RAM': '/uploads/products/images-1763044243485-219560005.jpg',
    'Almacenamiento': '/uploads/products/images-1763044181331-126168710.jpg',
    'Placas Madre': '/uploads/products/D_NQ_NP_761150-MLU74431289807_022024-O-1763044159374-797189564.webp'
  },
  products: {
    'Intel Core i9-13900K': ['/uploads/products/Sin_titulo-1763044295305-852818271.jpg'],
    'AMD Ryzen 9 7950X': ['/uploads/products/images-1763044243485-219560005.jpg'],
    'NVIDIA GeForce RTX 4090': ['/uploads/products/x1-301-jpg-1761844706591-335621029.webp'],
    'AMD Radeon RX 7900 XTX': ['/uploads/products/images-1763044211800-785424488.jpg'],
    'Corsair Vengeance DDR5 32GB': ['/uploads/products/images-1763044181331-126168710.jpg'],
    'G.Skill Trident Z5 RGB 64GB': ['/uploads/products/Sin_titulo-1763044090567-223542333.jpg'],
    'Samsung 990 PRO 2TB': ['/uploads/products/images-1763044181331-126168710.jpg'],
    'WD Black SN850X 1TB': ['/uploads/products/images-1763044243485-219560005.jpg'],
    'ASUS ROG Strix Z790-E': ['/uploads/products/D_NQ_NP_761150-MLU74431289807_022024-O-1763044159374-797189564.webp'],
    'MSI MAG X670E Tomahawk': ['/uploads/products/D_Q_NP_624515-CBT72015795264_102023-O-1763044132784-207765084.webp']
  }
};

const resolveUploadFilePath = (imageUrl) => {
  const urlString = String(imageUrl || '').trim();
  if (!urlString.startsWith('/uploads/')) return null;
  return path.resolve(__dirname, '..', '..', 'public', urlString.replace(/^\/+/, ''));
};

const isLocalUploadMissing = (imageUrl) => {
  const resolved = resolveUploadFilePath(imageUrl);
  return resolved ? !fs.existsSync(resolved) : false;
};

const fixExistingImageUrls = async () => {
  try {
    const products = await Product.findAll();
    for (const product of products) {
      const currentImages = Array.isArray(product.images) ? product.images : [];
      const needsFix = currentImages.some((img) => {
        const str = String(img || '').trim();
        return str.includes('example.com') || (str.startsWith('/uploads/') && isLocalUploadMissing(str));
      });

      if (needsFix) {
        const replacement = IMAGE_FIX_MAP.products[product.name];
        if (replacement) {
          product.images = replacement;
          await product.save();
          console.log(`🔧 Actualizada imagen del producto ${product.name}`);
        }
      }
    }

    const categories = await Category.findAll();
    for (const category of categories) {
      const currentImage = String(category.image || '').trim();
      const needsFix = currentImage.includes('example.com') || (currentImage.startsWith('/uploads/') && isLocalUploadMissing(currentImage));

      if (needsFix) {
        const replacement = IMAGE_FIX_MAP.categories[category.name];
        if (replacement) {
          category.image = replacement;
          await category.save();
          console.log(`🔧 Actualizada imagen de la categoría ${category.name}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error al corregir imágenes existentes:', error);
  }
};

/**
 * Script de inicialización para Docker
 * - Sincroniza la base de datos
 * - Verifica si hay datos precargados
 * - Si no hay datos, ejecuta el seeder
 * - Crea un usuario administrador si no existe
 */

const initDatabase = async () => {
  try {
    console.log('🔄 Inicializando base de datos...');
    
    // 1. Sincronizar modelos con la BD
    console.log('📊 Sincronizando modelos...');
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados');

    // 2. Verificar si ya hay categorías (indicador de que ya fue seeded)
    const categoryCount = await Category.count();
    
    if (categoryCount === 0) {
      console.log('🌱 No se encontraron datos. Ejecutando seeder...');
      const seedData = require('../seeders/seedData');
      await seedData();
      console.log('✅ Seeder completado');
    } else {
      console.log(`✅ Base de datos ya contiene ${categoryCount} categorías. Saltando seeder.`);
      await fixExistingImageUrls();
    }

    // 3. Crear usuario admin si no existe
    const adminCount = await User.count({ where: { role: 'admin' } });
    if (adminCount === 0) {
      console.log('👤 Creando usuario administrador...');
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await User.create({
        email: 'admin@pcstore.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'PCStore',
        role: 'admin',
        isActive: true
      });
      console.log('✅ Usuario administrador creado: admin@pcstore.com / admin123');
    } else {
      console.log('✅ Usuario administrador ya existe');
    }

    console.log('✅ Inicialización completada exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    throw error;
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('\n✨ Base de datos lista para usar');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Fallo en la inicialización:', error);
      process.exit(1);
    });
}

module.exports = { initDatabase };
