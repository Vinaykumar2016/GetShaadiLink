/**
 * Migration Script — Import local JSON card files into MongoDB Atlas
 * Run once: node migrate_to_mongodb.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file!');
  process.exit(1);
}

// Same schema as server — strict:false allows all fields
const invitationSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
}, { strict: false });

const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
}, { strict: false });

const Invitation = mongoose.model('Invitation', invitationSchema);
const Review = mongoose.model('Review', reviewSchema);

const INVITATIONS_DIR = path.join(__dirname, 'data', 'invitations');
const REVIEWS_FILE = path.join(__dirname, 'data', 'reviews.json');

async function migrate() {
  console.log('🔗 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { dbName: 'getshaadilink' });
  console.log('✅ Connected!\n');

  // ── Migrate Invitations ──────────────────────────
  console.log('📦 Migrating invitation cards...');
  const files = fs.readdirSync(INVITATIONS_DIR).filter(f => f.endsWith('.json'));

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const slug = file.replace('.json', '');
    const filePath = path.join(INVITATIONS_DIR, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      // Upsert: insert if not exists, update if slug already in MongoDB
      await Invitation.findOneAndUpdate(
        { slug },
        { $set: data },
        { upsert: true, new: true }
      );
      console.log(`  ✅ Imported: ${slug} (${data.bride || '?'} & ${data.groom || '?'})`);
      successCount++;
    } catch (err) {
      console.error(`  ❌ Failed: ${slug} — ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Invitations: ${successCount} imported, ${skipCount} skipped, ${errorCount} errors`);

  // ── Migrate Reviews ──────────────────────────────
  console.log('\n📦 Migrating reviews...');
  if (fs.existsSync(REVIEWS_FILE)) {
    try {
      const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf-8'));
      let reviewSuccess = 0;
      for (const review of reviews) {
        if (!review.id) continue;
        await Review.findOneAndUpdate(
          { id: review.id },
          { $set: review },
          { upsert: true, new: true }
        );
        reviewSuccess++;
      }
      console.log(`  ✅ Imported ${reviewSuccess} reviews`);
    } catch (err) {
      console.error(`  ❌ Reviews failed: ${err.message}`);
    }
  } else {
    console.log('  ℹ️  No reviews.json found, skipping');
  }

  // ── Verify ───────────────────────────────────────
  console.log('\n🔍 Verifying data in MongoDB...');
  const totalInvitations = await Invitation.countDocuments();
  const totalReviews = await Review.countDocuments();
  console.log(`  📋 Total invitations in MongoDB: ${totalInvitations}`);
  console.log(`  ⭐ Total reviews in MongoDB: ${totalReviews}`);

  // List all slugs and their login credentials
  const allCards = await Invitation.find().select('slug bride groom ownerEmail editPassword').lean();
  console.log('\n🔑 Cards in MongoDB (login credentials):');
  console.log('─'.repeat(60));
  for (const card of allCards) {
    console.log(`  Slug: ${card.slug}`);
    console.log(`  Bride & Groom: ${card.bride} & ${card.groom}`);
    console.log(`  Email: ${card.ownerEmail}`);
    console.log(`  Password: ${card.editPassword}`);
    console.log('─'.repeat(60));
  }

  console.log('\n✅ Migration complete! Your cards are now in MongoDB.');
  console.log('🌐 Login will work on the live site now.');
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
