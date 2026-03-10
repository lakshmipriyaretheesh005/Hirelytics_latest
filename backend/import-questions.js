import 'dotenv/config.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models
import Company from './models/Company.js';

async function importQuestions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB');

    // Read the questions JSON file
    const questionsPath = path.join(__dirname, 'questions-bulk-import.json');
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    console.log(`✓ Loaded ${questionsData.length} questions from JSON`);

    // Group questions by company
    const questionsByCompany = {};
    questionsData.forEach((question) => {
      if (!questionsByCompany[question.company]) {
        questionsByCompany[question.company] = [];
      }
      questionsByCompany[question.company].push({
        title: question.title,
        description: question.description,
        difficulty: question.difficulty,
        category: question.category,
      });
    });

    console.log('\n📊 Questions grouped by company:');
    Object.keys(questionsByCompany).forEach((company) => {
      console.log(`  ${company}: ${questionsByCompany[company].length} questions`);
    });

    // Update companies with questions
    let totalUpdated = 0;
    let totalAdded = 0;

    for (const [companyName, questions] of Object.entries(questionsByCompany)) {
      const company = await Company.findOne({ name: companyName });

      if (!company) {
        console.log(`✗ Company "${companyName}" not found in database`);
        continue;
      }

      // Initialize sampleQuestions array if it doesn't exist
      if (!company.sampleQuestions) {
        company.sampleQuestions = [];
      }

      // Get existing question titles to avoid duplicates
      const existingQuestions = new Set(company.sampleQuestions.map((q) => q.question));

      // Add new questions
      let addedCount = 0;
      questions.forEach((question) => {
        if (!existingQuestions.has(question.description)) {
          company.sampleQuestions.push({
            topic: question.category,
            question: question.description,
            difficulty: question.difficulty,
          });
          addedCount++;
          totalAdded++;
        }
      });

      // Save the updated company
      await company.save();
      totalUpdated++;
      console.log(`✓ ${companyName}: Added ${addedCount}/${questions.length} questions (total: ${company.sampleQuestions.length})`);
    }

    console.log(`\n✅ Import completed!`);
    console.log(`   - Companies updated: ${totalUpdated}`);
    console.log(`   - Questions added: ${totalAdded}`);

    // Display sample of imported data
    console.log('\n📝 Sample imported data:');
    for (const [companyName, questions] of Object.entries(questionsByCompany)) {
      const company = await Company.findOne({ name: companyName });
      if (company && company.sampleQuestions.length > 0) {
        console.log(`\n${companyName}:`);
        company.sampleQuestions.slice(0, 2).forEach((q, idx) => {
          console.log(`  ${idx + 1}. ${q.question.substring(0, 60)}... (${q.difficulty})`);
        });
        if (company.sampleQuestions.length > 2) {
          console.log(`  ... and ${company.sampleQuestions.length - 2} more questions`);
        }
      }
    }

    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
  } catch (error) {
    console.error('❌ Error during import:', error.message);
    process.exit(1);
  }
}

importQuestions();
