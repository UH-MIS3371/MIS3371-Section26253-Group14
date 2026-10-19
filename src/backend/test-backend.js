// ==========================================================
// HOTEL RESERVATION - TEST FILE
//
// Run from the backend folder:   node reservation.test.js
// Print a results table:         node reservation.test.js --md
// ==========================================================

const { processReservation } = require("./reservationRules");

// A fixed "today" so every test gives the same answer on any day
const TODAY = "2026-10-16";

const tests = [
    // ---------------- VALID ----------------
    {
        id: "V1",
        type: "Valid",
        name: "Double room, 2 guests, 3 nights, no special request",
        input: { Name: "Ana Lopez", Age: "30", StartDate: "2026-11-01", EndDate: "2026-11-04", category: "double", amount: "2", description: "" },
        expected: { valid: true, status: "confirmed" }
    },
    {
        id: "V2",
        type: "Valid",
        name: "Suite, 3 guests, 2 nights, with a special request",
        input: { Name: "Sam Lee", Age: "30", StartDate: "2026-12-10", EndDate: "2026-12-12", category: "suite", amount: "3", description: "Late check-in" },
        expected: { valid: true, status: "pending director approval" }
    },

    // ---------------- INVALID ----------------
    {
        id: "I1",
        type: "Invalid",
        name: "End date is before the start date",
        input: { Name: "Kim Park", Age: "30", StartDate: "2026-11-10", EndDate: "2026-11-05", category: "king", amount: "2", description: "" },
        expected: { valid: false, errorIncludes: "after the start date" }
    },
    {
        id: "I2",
        type: "Invalid",
        name: "Single room with 2 guests (too many)",
        input: { Name: "Lee Chen", Age: "30", StartDate: "2026-11-01", EndDate: "2026-11-03", category: "single", amount: "2", description: "" },
        expected: { valid: false, errorIncludes: "at most 1 guest" }
    },
    {
        id: "I3",
        type: "Invalid",
        name: "Start date is in the past",
        input: { Name: "Jo Diaz", Age: "30", StartDate: "2026-10-10", EndDate: "2026-10-12", category: "double", amount: "2", description: "" },
        expected: { valid: false, errorIncludes: "in the past" }
    },

    {
        id: "I4",
        type: "Invalid",
        name: "Age left blank",
        input: { Name: "Pat Quinn", Age: "", StartDate: "2026-11-01", EndDate: "2026-11-03", category: "double", amount: "2", description: "" },
        expected: { valid: false, errorIncludes: "at least 21" }
    },

    // ---------------- BOUNDARY / EDGE ----------------
    {
        id: "B1",
        type: "Boundary",
        name: "Start date is today, 1 night, single room with 1 guest (max)",
        input: { Name: "Max Ray", Age: "30", StartDate: "2026-10-16", EndDate: "2026-10-17", category: "single", amount: "1", description: "" },
        expected: { valid: true, status: "confirmed" }
    },
    {
        id: "B2",
        type: "Boundary",
        name: "Stay of exactly 30 nights (longest allowed)",
        input: { Name: "Eva Gill", Age: "30", StartDate: "2026-11-01", EndDate: "2026-12-01", category: "king", amount: "2", description: "" },
        expected: { valid: true, status: "confirmed" }
    },
    {
        id: "B3",
        type: "Boundary",
        name: "Stay of 31 nights (one over the limit)",
        input: { Name: "Tom Fox", Age: "30", StartDate: "2026-11-01", EndDate: "2026-12-02", category: "king", amount: "2", description: "" },
        expected: { valid: false, errorIncludes: "longer than 30 nights" }
    },
    {
        id: "B4",
        type: "Boundary",
        name: "Special request contains only spaces (no approval needed)",
        input: { Name: "Ivy Moss", Age: "30", StartDate: "2026-11-01", EndDate: "2026-11-03", category: "double", amount: "2", description: "     " },
        expected: { valid: true, status: "confirmed" }
    },
    {
        id: "B5",
        type: "Boundary",
        name: "Guest is exactly 21 years old (youngest allowed)",
        input: { Name: "Rae Cole", Age: "21", StartDate: "2026-11-01", EndDate: "2026-11-03", category: "double", amount: "2", description: "" },
        expected: { valid: true, status: "confirmed" }
    },
    {
        id: "B6",
        type: "Boundary",
        name: "Guest is 20 years old (one under the limit)",
        input: { Name: "Zed Hart", Age: "20", StartDate: "2026-11-01", EndDate: "2026-11-03", category: "double", amount: "2", description: "" },
        expected: { valid: false, errorIncludes: "at least 21" }
    }
];

// ---------- helpers that describe expected and actual results ----------
function describeExpected(expected) {
    return expected.valid
        ? "valid, " + expected.status
        : "invalid, error contains \"" + expected.errorIncludes + "\"";
}

function describeActual(result) {
    return result.valid
        ? "valid, " + result.status
        : "invalid, " + result.errors.join(" ");
}

function passed(test, result) {
    if (result.valid !== test.expected.valid) {
        return false;
    }
    if (test.expected.valid) {
        return result.status === test.expected.status;
    }
    return result.errors.some(function (message) {
        return message.includes(test.expected.errorIncludes);
    });
}

// ---------- run every test ----------
let passCount = 0;
const rows = [];

tests.forEach(function (test) {
    const result = processReservation(test.input, TODAY);
    const ok = passed(test, result);
    if (ok) {
        passCount++;
    }

    console.log((ok ? "PASS" : "FAIL") + "  " + test.id + "  " + test.name);
    console.log("      expected: " + describeExpected(test.expected));
    console.log("      actual:   " + describeActual(result));

    rows.push("| " + test.id + " | " + test.type + " | " + test.name + " | "
        + describeExpected(test.expected) + " | " + describeActual(result) + " | "
        + (ok ? "PASS" : "FAIL") + " |");
});

console.log("\n" + passCount + " of " + tests.length + " tests passed.");

if (process.argv.includes("--md")) {
    console.log("\n| # | Type | Test case | Expected | Actual | Result |");
    console.log("|---|------|-----------|----------|--------|--------|");
    rows.forEach(function (row) { console.log(row); });
}

process.exit(passCount === tests.length ? 0 : 1);