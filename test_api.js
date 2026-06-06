import fetch from "node-fetch"; // or standard global fetch in newer Node versions

async function testGeneration(slugName) {
  const payload = {
    bride: "Aditi",
    groom: "Kabir",
    wdate: "2026-12-18",
    city: "Jodhpur",
    vname: "Umaid Bhawan Palace",
    vaddr: "Circuit House Rd, Cantt Area, Jodhpur",
    lang: "en",
    story: "We met at college during an art class and shared a canvas. We have been painting our lives together ever since.",
    upiId: "test@upi",
    shagunOn: true,
    photos: [],
    e1n: "Haldi Ceremony",
    e1t: "2026-12-18T10:00:00",
    e2n: "Sangeet Night",
    e2t: "2026-12-18T18:00:00",
    e3n: "Wedding Ceremony",
    e3t: "2026-12-19T16:00:00",
    slug: slugName,
    editPassword: "secret123",
    groomParents: "Sri & Smt Sharma",
    brideParents: "Sri & Smt Verma",
    familyBlessings: "With blessings of families",
    postWeddingPhotosUrl: "",
    ownerEmail: "test@example.com",
    openingTheme: "jaipur"
  };

  console.log(`Sending generate request for slug: ${slugName}...`);
  try {
    const res = await fetch("http://localhost:3000/api/invitations/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const status = res.status;
    const bodyText = await res.text();
    console.log(`Response Status: ${status}`);
    console.log(`Response Body: ${bodyText}`);
    if (res.ok) {
      const data = JSON.parse(bodyText);
      if (data.success) {
        console.log(`SUCCESS! Invitation generated at /${data.slug}\n`);
        return true;
      }
    }
    console.error("FAILED to generate invitation\n");
    return false;
  } catch (error) {
    console.error("Request error:", error);
    return false;
  }
}

async function runTests() {
  console.log("Waiting 2 seconds for server to settle...");
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("--- RUN 1 ---");
  const run1 = await testGeneration("aditi-kabir-run1");
  
  console.log("--- RUN 2 ---");
  const run2 = await testGeneration("aditi-kabir-run2");
  
  if (run1 && run2) {
    console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
    process.exit(0);
  } else {
    console.log("TEST FAILURE DETECTED!");
    process.exit(1);
  }
}

runTests();
