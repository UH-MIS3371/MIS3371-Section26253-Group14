

const MAX_NIGHTS = 30;
const MIN_AGE = 21;

// Maximum guests allowed per room type (keys match the <option> values)
const MAX_GUESTS = {
    single: 1,
    double: 4,
    king: 2,
    suite: 4
};

const DAY_MS = 24 * 60 * 60 * 1000;

// Turns "YYYY-MM-DD" into a Date at UTC midnight (so time zones can't
// shift the day). Returns null if the text isn't a real date.
function parseDate(text) {
    if (typeof text !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(text)) {
        return null;
    }
    const date = new Date(text + "T00:00:00Z");
    return isNaN(date.getTime()) ? null : date;
}

// rule one stay dates: start date must be today or later, end date must be after start date, stay cannot be longer than 30 nights
function checkStayDates(startText, endText, todayText) {
    const start = parseDate(startText);
    const end = parseDate(endText);
    const today = parseDate(todayText);

    if (!start || !end || !today) {
        return { errors: ["Start date and end date are required (YYYY-MM-DD)."], nights: 0 };
    }

    const errors = [];
    const nights = Math.round((end - start) / DAY_MS);

    if (start < today) {
        errors.push("Start date cannot be in the past.");
    }
    if (nights < 1) {
        errors.push("End date must be after the start date.");
    } else if (nights > MAX_NIGHTS) {
        errors.push("A stay cannot be longer than " + MAX_NIGHTS + " nights.");
    }

    return { errors: errors, nights: nights };
}

// rule 2 max people per room
function checkCapacity(category, amount) {
    const max = MAX_GUESTS[category];
    const guests = Number(amount);

    if (!max) {
        return ["Choose a valid room type."];
    }
    if (!Number.isInteger(guests) || guests < 1) {
        return ["Number of guests must be at least 1."];
    }
    if (guests > max) {
        return ["A " + category + " room holds at most " + max + " guest" + (max > 1 ? "s" : "") + "."];
    }
    return [];
}

// rule 3 if any input is filled in special reservation request, director approval is required
function needsDirectorApproval(description) {
    // Spaces alone don't count as a request
    return typeof description === "string" && description.trim() !== "";
}

// rule 4: guest age
function checkAge(ageValue) {
    const age = parseInt(ageValue, 10);
    if (isNaN(age) || age < MIN_AGE) {
        return ["You must be at least " + MIN_AGE + " years old to reserve a room."];
    }
    return [];
}

// ---------------- Puts the rules together ----------------
// reservation: { Name, Age, StartDate, EndDate, category, amount, description }
// today: "YYYY-MM-DD" (passed in so tests give the same answer every day)
function processReservation(reservation, today) {
    const todayText = today || new Date().toISOString().slice(0, 10);

    const dateResult = checkStayDates(reservation.StartDate, reservation.EndDate, todayText);
    const capacityErrors = checkCapacity(reservation.category, reservation.amount);
    const ageErrors = checkAge(reservation.Age);
    const errors = dateResult.errors.concat(capacityErrors, ageErrors);

    if (errors.length > 0) {
        return { valid: false, status: "rejected", errors: errors, nights: dateResult.nights };
    }

    const status = needsDirectorApproval(reservation.description)
        ? "pending director approval"
        : "confirmed";

    return { valid: true, status: status, errors: [], nights: dateResult.nights };
}

module.exports = {
    processReservation,
    checkStayDates,
    checkCapacity,
    needsDirectorApproval,
    checkAge,
    MAX_NIGHTS,
    MIN_AGE,
    MAX_GUESTS
};