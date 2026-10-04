// Function to check rooms available, takes in selectedDates parameter from the user and unavailableDates parameter from the system's database

function checkRoomAvailability(selectedDates, unavailableDates) {

    for (let date of selectedDates) {
        if (unavailableDates.includes(date)) {
            return "Room not available";
        }
    }
    return "Room available";
}

//Test 1: all selected dates are available
console.log(checkRoomAvailability(["2026-10-10", "2026-10-11", "2026-10-12"], ["2026-10-15", "2026-10-16"])
);

//Test 2: Only one selected date is available
console.log(checkRoomAvailability(["2026-10-14", "2026-10-15", "2026-10-16"], ["2026-10-15", "2026-10-16"])
);

//Test 3: All selected dates are unavailable
console.log(checkRoomAvailability(["2026-10-15", "2026-10-16"], ["2026-10-15", "2026-10-16"])
);

