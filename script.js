
// ========================================
// APARTMENT VISITOR MANAGEMENT SYSTEM
// COMPLETE JAVASCRIPT
// ========================================

const API = "view_visitors.php";


// ========================================
// LOAD DASHBOARD STATISTICS
// ========================================

async function loadStats() {

    try {

        const response = await fetch(`${API}?action=stats`);

        if (!response.ok) {
            throw new Error("Statistics request failed");
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Unable to load statistics");
        }

        const data = result.data || {};

        document.getElementById("totalVisitors").textContent =
            data.totalVisitors ?? 0;

        document.getElementById("todayVisitors").textContent =
            data.todayVisitors ?? 0;

        document.getElementById("insideVisitors").textContent =
            data.insideVisitors ?? 0;

        document.getElementById("checkedOut").textContent =
            data.checkedOut ?? 0;

    } catch (error) {

        console.error("Statistics Error:", error);

    }

}


// ========================================
// LOAD VISITORS
// ========================================

async function loadVisitors(search = "") {

    const table = document.getElementById("visitorTable");

    if (!table) {
        console.error("visitorTable element not found");
        return;
    }

    table.innerHTML = `
        <tr>
            <td colspan="9" style="text-align:center;">
                Loading visitors...
            </td>
        </tr>
    `;

    try {

        const response = await fetch(`${API}?action=visitors`);

        if (!response.ok) {
            throw new Error("Visitor request failed");
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Unable to load visitors");
        }

        const visitors = Array.isArray(result.data)
            ? result.data
            : [];

        table.innerHTML = "";

        // SEARCH FILTER

        const filteredVisitors = visitors.filter(visitor => {

            const searchText = [

                visitor.visitor_name,
                visitor.phone,
                visitor.flat_no,
                visitor.purpose,
                visitor.status

            ].join(" ").toLowerCase();

            return searchText.includes(search.toLowerCase());

        });


        // NO RECORDS FOUND

        if (filteredVisitors.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align:center;">
                        No visitors found.
                    </td>
                </tr>
            `;

            return;

        }


        // DISPLAY VISITOR RECORDS

        filteredVisitors.forEach(visitor => {

            const row = document.createElement("tr");


            // STATUS

            const status = String(visitor.status || "Registered")
                .trim();


            // STATUS CLASS

            let statusClass = "registered";

            if (status.toLowerCase() === "inside") {

                statusClass = "inside";

            } else if (status.toLowerCase() === "checked out") {

                statusClass = "checked-out";

            }


            // CHECK-IN TIME

            const checkInTime = visitor.check_in || "-";


            // CHECK-OUT TIME

            const checkOutTime = visitor.check_out || "-";


            // ACTION BUTTON

            let actionButton = "";

            if (status.toLowerCase() === "registered") {

                actionButton = `
                    <button
                        type="button"
                        class="checkin-btn"
                        onclick="checkinVisitor(${Number(visitor.id)})">
                        Check In
                    </button>
                `;

            } else if (status.toLowerCase() === "inside") {

                actionButton = `
                    <button
                        type="button"
                        class="checkout-btn"
                        onclick="checkoutVisitor(${Number(visitor.id)})">
                        Check Out
                    </button>
                `;

            } else if (status.toLowerCase() === "checked out") {

                actionButton = `
                    <span class="completed-text">
                        Completed
                    </span>
                `;

            } else {

                actionButton = `
                    <button
                        type="button"
                        class="checkout-btn"
                        onclick="checkoutVisitor(${Number(visitor.id)})">
                        Check Out
                    </button>
                `;

            }


            // TABLE ROW

            row.innerHTML = `
                <td>${escapeHTML(visitor.id)}</td>

                <td>${escapeHTML(visitor.visitor_name)}</td>

                <td>${escapeHTML(visitor.phone)}</td>

                <td>${escapeHTML(visitor.flat_no)}</td>

                <td>${escapeHTML(visitor.purpose)}</td>

                <td>${escapeHTML(checkInTime)}</td>

                <td>${escapeHTML(checkOutTime)}</td>

                <td>
                    <span class="status ${statusClass}">
                        ${escapeHTML(status)}
                    </span>
                </td>

                <td>
                    ${actionButton}
                </td>
            `;

            table.appendChild(row);

        });

    } catch (error) {

        console.error("Visitor Loading Error:", error);

        table.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;color:red;">
                    Unable to load visitor records.
                    Please check the database connection.
                </td>
            </tr>
        `;

    }

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

    const element = document.createElement("div");

    element.textContent = value ?? "";

    return element.innerHTML;

}


// ========================================
// REGISTER VISITOR
// ========================================

async function registerVisitor(event) {

    event.preventDefault();

    const form = document.getElementById("visitorForm");

    const formData = new FormData(form);

    const visitorData = {

        visitor_name: formData.get("visitor_name"),

        phone: formData.get("phone"),

        flat_no: formData.get("flat_no"),

        purpose: formData.get("purpose")

    };

    try {

        const response = await fetch("register_visitor.php", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(visitorData)

        });

        const result = await response.json();

        if (!result.success) {

            alert(result.message || "Registration failed");

            return;

        }

        alert("Visitor registered successfully!");

        form.reset();

        await loadVisitors();

        await loadStats();

    } catch (error) {

        console.error("Registration Error:", error);

        alert("Unable to register visitor.");

    }

}


// ========================================
// CHECK IN VISITOR
// ========================================

async function checkinVisitor(id) {

    if (!confirm("Do you want to check in this visitor?")) {
        return;
    }

    try {

        const response = await fetch("checkin.php", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id: id
            })

        });

        const result = await response.json();

        if (!result.success) {

            alert(result.message || "Check-in failed");

            return;

        }

        alert("Visitor checked in successfully!");

        await loadVisitors();

        await loadStats();

    } catch (error) {

        console.error("Check-in Error:", error);

        alert("Unable to check in visitor.");

    }

}


// ========================================
// CHECK OUT VISITOR
// ========================================

async function checkoutVisitor(id) {

    if (!confirm("Do you want to check out this visitor?")) {
        return;
    }

    try {

        const response = await fetch("checkout.php", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id: id
            })

        });

        const result = await response.json();

        if (!result.success) {

            alert(result.message || "Check-out failed");

            return;

        }

        alert("Visitor checked out successfully!");

        await loadVisitors();

        await loadStats();

    } catch (error) {

        console.error("Check-out Error:", error);

        alert("Unable to check out visitor.");

    }

}


// ========================================
// SEARCH VISITORS
// ========================================

function searchVisitors() {

    const searchInput = document.getElementById("searchVisitor");

    if (searchInput) {

        loadVisitors(searchInput.value);

    }

}


// ========================================
// INITIALIZE DASHBOARD
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const visitorForm = document.getElementById("visitorForm");

    const searchInput = document.getElementById("searchVisitor");


    // REGISTER VISITOR FORM

    if (visitorForm) {

        visitorForm.addEventListener("submit", registerVisitor);

    }


    // SEARCH

    if (searchInput) {

        searchInput.addEventListener("input", searchVisitors);

    }


    // LOAD DATA

    loadVisitors();

    loadStats();

});
