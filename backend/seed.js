import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Company from './models/Company.js';
import { companiesData } from './data/companies.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');

        // Clear existing companies
        await Company.deleteMany({});
        console.log('🗑️ Cleared existing companies');

        // Insert new companies
        const inserted = await Company.insertMany(companiesData);
        console.log(`✅ Seeded ${inserted.length} companies`);

        // Display seeded companies
        console.log('\n📊 Seeded Companies:');
        inserted.forEach((company) => {
            console.log(`  - ${company.name} (${company.industry})`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();
