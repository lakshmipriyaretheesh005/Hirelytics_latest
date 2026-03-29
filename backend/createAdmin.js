import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@hirelytics.com' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            console.log(`📧 Email: admin@hirelytics.com`);
            await mongoose.connection.close();
            process.exit(0);
        }

        // Create admin user
        const admin = new User({
            fullName: 'Admin User',
            email: 'admin@hirelytics.com',
            password: 'admin123',
            role: 'admin',
            onboardingCompleted: true,
        });

        await admin.save();

        console.log('\n✅ Admin user created successfully!');
        console.log('\n📋 Admin Credentials:');
        console.log('   Email: admin@hirelytics.com');
        console.log('   Password: admin123');
        console.log('\n⚠️  Please change the password after first login!');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
