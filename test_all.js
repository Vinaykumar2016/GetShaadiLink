// test_all.js - Integration Test Runner (ESM compatible)
// This script runs automated checks to ensure all APIs are fully functional.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const TEST_SLUG = `test-integration-${Date.now()}`;
let supportQueryId = null;


async function runTests() {
  console.log("==========================================");
  console.log("STARTING GETSHAADILINK INTEGRATION TESTS...");
  console.log("==========================================\n");

  try {
    // ----------------------------------------------------
    // TEST 1: GET /api/stats
    // ----------------------------------------------------
    console.log("Running Test 1: Querying GET /api/stats...");
    const statsRes = await fetch(`${BASE_URL}/api/stats`);
    if (!statsRes.ok) {
      throw new Error(`GET /api/stats failed with status ${statsRes.status}`);
    }
    const statsData = await statsRes.json();
    console.log("Stats Response:", JSON.stringify(statsData));
    
    if (typeof statsData.totalGenerated !== "number" || statsData.totalGenerated < 0) {
      throw new Error(`Invalid totalGenerated in stats response: ${statsData.totalGenerated}`);
    }
    if (statsData.rating !== 4.9) {
      throw new Error(`Invalid rating in stats response: ${statsData.rating}`);
    }
    console.log("✅ TEST 1 PASSED: Stats API returned valid data.\n");

    // ----------------------------------------------------
    // TEST 2: POST /api/invitations/generate
    // ----------------------------------------------------
    console.log(`Running Test 2: Generating new invitation with slug: ${TEST_SLUG}...`);
    const generatePayload = {
      bride: "Sneha",
      groom: "Rahul",
      wdate: "2026-11-20",
      city: "Udaipur",
      vname: "Taj Lake Palace",
      vaddr: "Pichola, Udaipur, Rajasthan 313001",
      lang: "hi",
      story: "We crossed paths at a coffee shop in Mumbai. A spilled mocha turned into an hour-long chat, and eventually, a promise of a lifetime.",
      upiId: "sneha-rahul@upi",
      shagunOn: true,
      photos: [],
      e1n: "Haldi Ceremony",
      e1t: "2026-11-20T10:00:00",
      e2n: "Sangeet Night",
      e2t: "2026-11-20T19:00:00",
      e3n: "Wedding Ceremony",
      e3t: "2026-11-21T18:00:00",
      slug: TEST_SLUG,
      editPassword: "integrationpass",
      groomParents: "Smt. Meena & Sri. Ramesh Kapoor",
      brideParents: "Smt. Kavita & Sri. Anil Sharma",
      familyBlessings: "With the blessings of ancestors and family members",
      postWeddingPhotosUrl: "",
      ownerEmail: "sneha.rahul@example.com",
      openingTheme: "jaipur",
      razorpayPaymentId: "pay_test_integration123"
    };

    const generateRes = await fetch(`${BASE_URL}/api/invitations/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(generatePayload)
    });

    const generateResult = await generateRes.json();
    console.log("Generate Response:", JSON.stringify(generateResult));

    if (!generateRes.ok) {
      throw new Error(`Generate API failed: ${generateResult.error || "Unknown error"}`);
    }

    if (!generateResult.success || generateResult.slug !== TEST_SLUG) {
      throw new Error(`Generate response indicates failure or mismatch: ${JSON.stringify(generateResult)}`);
    }

    // Verify invitation can be fetched via API
    const fetchRes = await fetch(`${BASE_URL}/api/invitations/${TEST_SLUG}?admin=true`);
    if (!fetchRes.ok) {
      throw new Error(`Failed to fetch generated invitation via API: ${fetchRes.status}`);
    }
    const savedContent = await fetchRes.json();
    if (savedContent.razorpayPaymentId !== "pay_test_integration123") {
      throw new Error(`Persisted razorpayPaymentId does not match input value`);
    }
    console.log("✅ TEST 2 PASSED: Invitation generated successfully and saved to database.\n");

    // ----------------------------------------------------
    // TEST 3: POST /api/invitations/:slug/add-note
    // ----------------------------------------------------
    console.log("Running Test 3: Submitting guestbook blessing note...");
    const notePayload = {
      name: "Ramesh Uncle & Family",
      note: "Sending you both our best wishes and blessings for this beautiful journey! 🌸",
      amount: 1001
    };

    const noteRes = await fetch(`${BASE_URL}/api/invitations/${TEST_SLUG}/add-note`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notePayload)
    });

    const noteResult = await noteRes.json();
    console.log("Note Response:", JSON.stringify(noteResult));

    if (!noteRes.ok) {
      throw new Error(`Add-note API failed: ${noteResult.error || "Unknown error"}`);
    }

    if (!noteResult.success || !Array.isArray(noteResult.notes)) {
      throw new Error(`Add-note response indicates failure: ${JSON.stringify(noteResult)}`);
    }

    const addedNote = noteResult.notes.find(n => n.name === notePayload.name);
    if (!addedNote) {
      throw new Error(`Could not find the submitted note in returned guest notes list`);
    }
    if (addedNote.note !== notePayload.note) {
      throw new Error(`Note content mismatch. Expected: "${notePayload.note}", Got: "${addedNote.note}"`);
    }
    console.log("✅ TEST 3 PASSED: Guestbook blessing registered successfully.\n");

    // ----------------------------------------------------
    // TEST 4: POST /api/invitations/:slug/update
    // ----------------------------------------------------
    console.log("Running Test 4: Updating invitation details...");
    const updatePayload = {
      password: "integrationpass",
      bride: "Sneha-Updated",
      groom: "Rahul-Updated",
      wdate: "2026-11-20",
      city: "Udaipur-Updated",
      vname: "Taj Lake Palace-Updated",
      vaddr: "Pichola, Udaipur, Rajasthan 313001",
      openingTheme: "lotus"
    };

    const updateRes = await fetch(`${BASE_URL}/api/invitations/${TEST_SLUG}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload)
    });

    const updateResult = await updateRes.json();
    console.log("Update Response:", JSON.stringify(updateResult));

    if (!updateRes.ok) {
      throw new Error(`Update API failed: ${updateResult.error || "Unknown error"}`);
    }

    // Verify updates via API
    const fetchRes2 = await fetch(`${BASE_URL}/api/invitations/${TEST_SLUG}?admin=true`);
    if (!fetchRes2.ok) {
      throw new Error(`Failed to fetch updated invitation via API: ${fetchRes2.status}`);
    }
    const updatedContent = await fetchRes2.json();
    if (updatedContent.bride !== "Sneha-Updated" || updatedContent.groom !== "Rahul-Updated" || updatedContent.city !== "Udaipur-Updated") {
      throw new Error(`Update was not persisted correctly`);
    }
    console.log("✅ TEST 4 PASSED: Invitation details updated successfully.\n");

    // ----------------------------------------------------
    // TEST 5: POST /api/invitations/:slug/update (with editPassword fallback)
    // ----------------------------------------------------
    console.log("Running Test 5: Updating invitation details using editPassword fallback...");
    const updateFallbackPayload = {
      editPassword: "integrationpass",
      bride: "Sneha-Updated-Fallback",
      groom: "Rahul-Updated-Fallback",
      wdate: "2026-11-20",
      city: "Udaipur-Updated-Fallback",
      vname: "Taj Lake Palace-Updated-Fallback",
      vaddr: "Pichola, Udaipur, Rajasthan 313001"
    };

    const updateFallbackRes = await fetch(`${BASE_URL}/api/invitations/${TEST_SLUG}/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateFallbackPayload)
    });

    const updateFallbackResult = await updateFallbackRes.json();
    console.log("Update Fallback Response:", JSON.stringify(updateFallbackResult));

    if (!updateFallbackRes.ok) {
      throw new Error(`Update Fallback API failed: ${updateFallbackResult.error || "Unknown error"}`);
    }

    // Verify updates via API
    const fetchRes3 = await fetch(`${BASE_URL}/api/invitations/${TEST_SLUG}?admin=true`);
    if (!fetchRes3.ok) {
      throw new Error(`Failed to fetch updated fallback invitation via API: ${fetchRes3.status}`);
    }
    const updatedFallbackContent = await fetchRes3.json();
    if (updatedFallbackContent.bride !== "Sneha-Updated-Fallback" || updatedFallbackContent.groom !== "Rahul-Updated-Fallback") {
      throw new Error(`Update fallback was not persisted correctly`);
    }
    console.log("✅ TEST 5 PASSED: Invitation details updated using editPassword fallback successfully.\n");

    // ----------------------------------------------------
    // TEST 6: POST /api/contact/submit
    // ----------------------------------------------------
    console.log("Running Test 6: Submitting contact/support form...");
    const contactPayload = {
      name: "Test User",
      email: "test.user@example.com",
      subject: "Test Subject",
      message: "This is a test support message query."
    };

    const contactRes = await fetch(`${BASE_URL}/api/contact/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactPayload)
    });

    const contactResult = await contactRes.json();
    console.log("Contact Submit Response:", JSON.stringify(contactResult));

    if (!contactRes.ok) {
      throw new Error(`Contact API failed: ${contactResult.error || "Unknown error"}`);
    }

    if (!contactResult.success) {
      throw new Error(`Contact API response did not indicate success`);
    }

    // Verify query can be fetched via Admin API in Test 7d below
    console.log("✅ TEST 6 PASSED: Support form submission succeeded.\n");

    // ----------------------------------------------------
    // TEST 7: Admin API Endpoints & Auth
    // ----------------------------------------------------
    console.log("Running Test 7: Admin API authentication and operations...");
    const adminPass = process.env.ADMIN_PASSWORD || "Vinay@admin";

    // 7a: Login request
    console.log("7a: Logging in as admin...");
    const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: process.env.ADMIN_USERNAME || "VinayMathad", password: adminPass })
    });
    const loginResult = await loginRes.json();
    if (!loginRes.ok || !loginResult.success || loginResult.token !== adminPass) {
      throw new Error(`Admin login failed: ${JSON.stringify(loginResult)}`);
    }
    console.log("   Admin login succeeded.");

    // 7b: Query stats without token (should fail)
    console.log("7b: Querying stats without authorization header...");
    const statsFailRes = await fetch(`${BASE_URL}/api/admin/stats`);
    if (statsFailRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized, got ${statsFailRes.status}`);
    }
    console.log("   Auth rejection verified.");

    // 7c: Query stats with token (should succeed)
    console.log("7c: Querying stats with authorization token...");
    const statsOkRes = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { "Authorization": `Bearer ${adminPass}` }
    });
    const statsResult = await statsOkRes.json();
    if (!statsOkRes.ok || !statsResult.success || typeof statsResult.stats !== "object") {
      throw new Error(`Stats fetch failed: ${JSON.stringify(statsResult)}`);
    }
    console.log(`   Stats verified: Total Invitations = ${statsResult.stats.totalInvitations}, Views = ${statsResult.stats.totalViews}`);

    // 7d: Query list of support queries
    console.log("7d: Querying support list...");
    const queriesListRes = await fetch(`${BASE_URL}/api/admin/queries`, {
      headers: { "Authorization": `Bearer ${adminPass}` }
    });
    const queriesListResult = await queriesListRes.json();
    if (!queriesListRes.ok || !queriesListResult.success || !Array.isArray(queriesListResult.queries)) {
      throw new Error(`Queries list fetch failed: ${JSON.stringify(queriesListResult)}`);
    }
    console.log(`   Queries list verified: found ${queriesListResult.queries.length} queries.`);
    
    // Find the test support query submitted in Test 6
    const foundQuery = queriesListResult.queries.find(q => q.email === contactPayload.email && q.subject === contactPayload.subject);
    if (!foundQuery) {
      throw new Error(`Could not find the submitted contact query in queries list`);
    }
    supportQueryId = foundQuery.id;
    console.log(`   Found test query. ID: ${supportQueryId}`);
    console.log("✅ TEST 7 PASSED: Admin Dashboard API verified successfully.\n");

    // ----------------------------------------------------
    // Clean up test data in database
    // ----------------------------------------------------
    console.log(`Cleaning up test invitation slug ${TEST_SLUG} via Admin API...`);
    const deleteInvRes = await fetch(`${BASE_URL}/api/admin/invitations/${TEST_SLUG}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${adminPass}` }
    });
    if (!deleteInvRes.ok) {
      console.warn("⚠️ Failed to delete test invitation");
    } else {
      console.log("   Test invitation deleted.");
    }
    
    if (supportQueryId) {
      console.log(`Cleaning up test contact query ${supportQueryId} via Admin API...`);
      const deleteQueryRes = await fetch(`${BASE_URL}/api/admin/queries/${supportQueryId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${adminPass}` }
      });
      if (!deleteQueryRes.ok) {
        console.warn("⚠️ Failed to delete test contact query");
      } else {
        console.log("   Test contact query deleted.");
      }
    }
    console.log("🧹 Cleanup complete.");

    console.log("\n==========================================");
    console.log("🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY!");
    console.log("==========================================");
    process.exit(0);

  } catch (error) {
    console.error("\n❌ TEST RUNNER DETECTED FAILURE:");
    console.error(error.message);
    console.log("==========================================");
    process.exit(1);
  }
}

runTests();
