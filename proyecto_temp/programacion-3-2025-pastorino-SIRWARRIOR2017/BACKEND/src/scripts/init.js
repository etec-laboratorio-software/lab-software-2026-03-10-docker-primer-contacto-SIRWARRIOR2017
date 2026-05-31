const path = require('path');
require('dotenv').config();

const { sequelize } = require('../config/database');
const { Product, Category, User } = require('../models');

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
