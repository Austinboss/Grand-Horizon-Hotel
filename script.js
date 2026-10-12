/* =========================================
   GRAND HORIZON HOTEL & SUITES
   WEBSITE JAVASCRIPT
========================================= */

/*
IMPORTANT:
Paste your existing deployed Google Apps Script
Web App URL between the quotation marks below.

Example format:
const SCRIPT_URL = "";
*/

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzFnpsVDArGUOUK7RiyHm2Fe8tLHNIwWrgb5fcF5Coi4P5z1MCY-XrY4uM2KwwOhUo/exec";


document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       1. MOBILE HAMBURGER MENU
    ===================================== */

    const menuButton = document.getElementById("menuButton");
    const menuOverlay = document.getElementById("menuOverlay");
    const closeMenuButton = document.getElementById("closeMenu");

    function openMenu() {
        if (!menuButton || !menuOverlay) return;

        menuOverlay.classList.add("active");
        menuButton.classList.add("active");

        menuButton.setAttribute("aria-expanded", "true");
        menuButton.setAttribute("aria-label", "Close navigation menu");

        menuOverlay.setAttribute("aria-hidden", "false");

        document.body.classList.add("menu-open");
    }

    function closeMenu() {
        if (!menuButton || !menuOverlay) return;

        menuOverlay.classList.remove("active");
        menuButton.classList.remove("active");

        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");

        menuOverlay.setAttribute("aria-hidden", "true");

        document.body.classList.remove("menu-open");
    }

    if (menuButton && menuOverlay) {

        menuButton.addEventListener("click", function () {

            if (menuOverlay.classList.contains("active")) {
                closeMenu();
            } else {
                openMenu();
            }

        });

        if (closeMenuButton) {
            closeMenuButton.addEventListener("click", closeMenu);
        }

        // Close the menu when a navigation link is selected.
        menuOverlay.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", closeMenu);

        });

        // Close if the user taps the empty background.
        menuOverlay.addEventListener("click", function (event) {

            if (event.target === menuOverlay) {
                closeMenu();
            }

        });

        // Close when Escape is pressed.
        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

    }


    /* =====================================
       2. PHONE COUNTRY SELECTOR
    ===================================== */

    const countrySelect = document.getElementById("country");
    const dialCodeDisplay = document.getElementById("selectedDialCode");

    function updateDialCode() {

        if (!countrySelect || !dialCodeDisplay) return;

        const selectedOption =
            countrySelect.options[countrySelect.selectedIndex];

        const dialCode = selectedOption
            ? selectedOption.dataset.dial
            : "+234";

        dialCodeDisplay.textContent = dialCode || "+234";

    }

    if (countrySelect) {

        countrySelect.addEventListener("change", updateDialCode);

        // Set the initial dial code.
        updateDialCode();

    }


    /* =====================================
       3. ROOM SELECTION
    ===================================== */

    const roomSelect = document.getElementById("room");

    const roomLinks = document.querySelectorAll(
        ".room-link[data-room], .room-image-link[data-room]"
    );

    roomLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            const selectedRoom = link.dataset.room;

            if (roomSelect && selectedRoom) {

                roomSelect.value = selectedRoom;

            }

        });

    });


    /* =====================================
       4. BOOKING FORM ELEMENTS
    ===================================== */

    const bookingForm = document.getElementById("hotelBookingForm");

    if (!bookingForm) {
        console.error("Booking form not found.");
        return;
    }

    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const emailInput = document.getElementById("email");

    const checkinInput = document.getElementById("checkin");
    const checkoutInput = document.getElementById("checkout");

    const guestsInput = document.getElementById("guests");
    const arrivalInput = document.getElementById("arrival");
    const bedInput = document.getElementById("bed");
    const messageInput = document.getElementById("message");

    const resultMessage = document.getElementById("result");

    const submitButton = bookingForm.querySelector(
        'button[type="submit"]'
    );


    /* =====================================
       5. FORM STATUS MESSAGES
    ===================================== */

    function showMessage(message, type) {

        if (!resultMessage) return;

        resultMessage.textContent = message;

        resultMessage.classList.remove("success", "error");

        resultMessage.classList.add(type);

        resultMessage.style.display = "block";

    }

    function clearMessage() {

        if (!resultMessage) return;

        resultMessage.textContent = "";

        resultMessage.classList.remove("success", "error");

        resultMessage.style.display = "none";

    }


    /* =====================================
       6. LOCAL DATE HELPERS
    ===================================== */

    function getLocalToday() {

        const today = new Date();

        const year = today.getFullYear();

        const month = String(today.getMonth() + 1).padStart(2, "0");

        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }

    function addDaysToDate(dateString, numberOfDays) {

        const date = new Date(dateString + "T12:00:00");

        date.setDate(date.getDate() + numberOfDays);

        const year = date.getFullYear();

        const month = String(date.getMonth() + 1).padStart(2, "0");

        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }


    /* =====================================
       7. CHECK-IN AND CHECK-OUT VALIDATION
    ===================================== */

    function updateCheckoutMinimum() {

        if (!checkinInput || !checkoutInput) return;

        const today = getLocalToday();

        checkinInput.min = today;

        if (!checkinInput.value || checkinInput.value < today) {

            checkoutInput.min = addDaysToDate(today, 1);

        } else {

            checkoutInput.min = addDaysToDate(
                checkinInput.value,
                1
            );

        }

        // Clear checkout if it is no longer valid.
        if (
            checkoutInput.value &&
            checkoutInput.value <= checkinInput.value
        ) {

            checkoutInput.value = "";

        }

    }

    if (checkinInput && checkoutInput) {

        updateCheckoutMinimum();

        checkinInput.addEventListener("change", function () {

            updateCheckoutMinimum();

        });

    }


    /* =====================================
       8. PHONE NUMBER VALIDATION
    ===================================== */

    function getCleanPhoneNumber(value) {

        return value.replace(/[\s\-().]/g, "");

    }

    function isValidPhoneNumber(value) {

        const cleanNumber = getCleanPhoneNumber(value);

        // This field should contain the national number,
        // without repeating the selected country dial code.
        return /^\+?\d{7,15}$/.test(cleanNumber);

    }


    /* =====================================
       9. BOOKING FORM SUBMISSION
    ===================================== */

    bookingForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        clearMessage();

        // Let the browser report missing required fields.
        if (!bookingForm.checkValidity()) {

            bookingForm.reportValidity();

            return;

        }

        const guestName = nameInput.value.trim();

        const guestEmail = emailInput.value.trim();

        const nationalPhone = getCleanPhoneNumber(
            phoneInput.value.trim()
        );

        const countryCode = countrySelect.value;

        const selectedCountryOption =
            countrySelect.options[countrySelect.selectedIndex];

        const countryName = selectedCountryOption.textContent
            .replace(/\s*\([^)]*\)\s*$/, "")
            .trim();

        const dialCode = selectedCountryOption.dataset.dial || "+234";

        const internationalPhone =
            dialCode + nationalPhone.replace(/^\+/, "");

        const checkinDate = checkinInput.value;

        const checkoutDate = checkoutInput.value;

        const preferredRoom = roomSelect.value;


        // Validate name.
        if (guestName.length < 2) {

            showMessage(
                "Please enter your full name.",
                "error"
            );

            nameInput.focus();

            return;

        }


        // Validate email.
        if (!emailInput.validity.valid) {

            showMessage(
                "Please enter a valid email address.",
                "error"
            );

            emailInput.focus();

            return;

        }


        // Validate phone.
        if (!isValidPhoneNumber(nationalPhone)) {

            showMessage(
                "Please enter a valid phone number for your selected country.",
                "error"
            );

            phoneInput.focus();

            return;

        }


        // Validate dates.
        const today = getLocalToday();

        if (checkinDate < today) {

            showMessage(
                "Check-in cannot be in the past. Please choose today or a future date.",
                "error"
            );

            checkinInput.focus();

            return;

        }

        if (checkoutDate <= checkinDate) {

            showMessage(
                "Your check-out date must be after your check-in date.",
                "error"
            );

            checkoutInput.focus();

            return;

        }


        // Validate room selection.
        if (!preferredRoom) {

            showMessage(
                "Please select your preferred room.",
                "error"
            );

            roomSelect.focus();

            return;

        }


        // Confirm the Apps Script URL has been configured.
        if (
            !SCRIPT_URL ||
            SCRIPT_URL === "PASTE_YOUR_EXISTING_APPS_SCRIPT_URL_HERE" ||
            !SCRIPT_URL.startsWith("https://script.google.com/")
        ) {

            showMessage(
                "The booking connection has not been configured yet. Please add your existing Google Apps Script Web App URL to script.js.",
                "error"
            );

            console.error(
                "Booking submission stopped: SCRIPT_URL is missing or invalid."
            );

            return;

        }


        /* =================================
           10. PREPARE BOOKING DATA
        ================================= */

        const booking = {

            name: guestName,

            country: countryCode,

            countryName: countryName,

            dialCode: dialCode,

            phone: nationalPhone,

            internationalPhone: internationalPhone,

            email: guestEmail,

            checkin: checkinDate,

            checkout: checkoutDate,

            room: preferredRoom,

            guests: guestsInput ? guestsInput.value : "",

            arrival: arrivalInput ? arrivalInput.value : "",

            bed: bedInput ? bedInput.value : "",

            message: messageInput
                ? messageInput.value.trim()
                : "",

            submittedAt: new Date().toISOString(),

            source: "Grand Horizon Hotel & Suites Website"

        };


        /* =================================
           11. SEND TO GOOGLE APPS SCRIPT
        ================================= */

        const originalButtonText = submitButton
            ? submitButton.innerHTML
            : "";

        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent = "Sending Enquiry...";

        }

        showMessage(
            "Sending your enquiry. Please wait...",
            "success"
        );


        try {

            /*
             * The Apps Script doPost(e) function must accept
             * JSON from e.postData.contents.
             *
             * With mode: "no-cors", the browser cannot read
             * the response from Apps Script. A resolved fetch
             * therefore does NOT prove that the spreadsheet
             * or email operation succeeded.
             */

            await fetch(SCRIPT_URL, {

                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },

                body: JSON.stringify(booking)

            });


            /*
             * This means the browser did not report a network
             * rejection. It does not confirm that Apps Script
             * saved the booking or sent an email.
             */

            showMessage(
                "Your enquiry has been submitted for sending. Please contact us on WhatsApp if you need to confirm that we received it.",
                "success"
            );

            bookingForm.reset();

            // Restore the default country and dial code.
            if (countrySelect) {

                countrySelect.value = "NG";

                updateDialCode();

            }

            // Restore default date constraints.
            updateCheckoutMinimum();


        } catch (error) {

            console.error("Booking submission error:", error);

            showMessage(
                "We couldn't send your enquiry. Please check your internet connection and try again, or contact us on WhatsApp.",
                "error"
            );

        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.innerHTML = originalButtonText;

            }

        }

    });


    /* =====================================
       12. CLEAR ERRORS WHEN EDITING
    ===================================== */

    bookingForm.querySelectorAll("input, select, textarea").forEach(
        function (field) {

            field.addEventListener("input", function () {

                if (resultMessage &&
                    resultMessage.classList.contains("error")) {

                    clearMessage();

                }

            });

            field.addEventListener("change", function () {

                if (resultMessage &&
                    resultMessage.classList.contains("error")) {

                    clearMessage();

                }

            });

        }
    );


    console.log(
        "Grand Horizon Hotel & Suites website JavaScript loaded successfully."
    );

});