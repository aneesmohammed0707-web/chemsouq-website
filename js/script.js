function addItem() {

    const tableBody = document.querySelector("#itemsTable tbody");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>
            <select class="form-control desc">
                <option value="">Select Item</option>
                <option value="SOAP">SOAP</option>
                <option value="SHIRT">SHIRT</option>
                <option value="PANT">PANT</option>
                <option value="BAT">BAT</option>
                <option value="BALL">BALL</option>
            </select>
        </td>
        <td><input type="number" class="form-control qty" value="1" onchange="calculateTotals()"></td>
        <td><input type="number" class="form-control rate" value="0" onchange="calculateTotals()"></td>
        <td class="itemTotal">0.00</td>
        <td><button class="btn btn-danger btn-sm" onclick="this.closest('tr').remove(); calculateTotals();">X</button></td>
    `;

    tableBody.appendChild(row);
}

function calculateTotals() {

    let subtotal = 0;

    document.querySelectorAll("#itemsTable tbody tr").forEach(row => {
        const qty = parseFloat(row.querySelector(".qty").value) || 0;
        const rate = parseFloat(row.querySelector(".rate").value) || 0;
        const total = qty * rate;

        row.querySelector(".itemTotal").innerText = total.toFixed(2);
        subtotal += total;
    });

    const vat = subtotal * 0.05;
    const grandTotal = subtotal + vat;

    document.getElementById("subTotal").innerText = subtotal.toFixed(2);
    document.getElementById("vat").innerText = vat.toFixed(2);
    document.getElementById("grandTotal").innerText = grandTotal.toFixed(2);
}

function fillAddress() {

    const company = document.getElementById("custName").value;
    const addressField = document.getElementById("custAddress");

    const addresses = {
        "ARIF TRADING": "Dubai Industrial Area 2, Dubai, UAE",
        "GLOBAL CHEM LLC": "Sharjah Free Zone, UAE",
        "AL NOOR INDUSTRIES": "Abu Dhabi Industrial City, UAE"
    };

    addressField.value = addresses[company] || "";
}

async function generatePDF() {

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const invoiceNumber = document.getElementById("invoiceNo").value;
    const customerName = document.getElementById("custName").value;
    const customerAddress = document.getElementById("custAddress").value;

    let y = 20;

    pdf.setFontSize(18);
    pdf.text("Chemsouq", 105, y, null, null, "center");
    y += 10;

    pdf.setFontSize(12);
    pdf.text("Invoice No: " + invoiceNumber, 14, y);
    y += 8;

    pdf.text("Customer: " + customerName, 14, y);
    y += 8;

    pdf.text("Address: " + customerAddress, 14, y);
    y += 12;

    pdf.text("Description", 14, y);
    pdf.text("Qty", 100, y);
    pdf.text("Rate", 120, y);
    pdf.text("Total", 160, y);
    y += 8;

    document.querySelectorAll("#itemsTable tbody tr").forEach(row => {
        const desc = row.querySelector(".desc").value;
        const qty = row.querySelector(".qty").value;
        const rate = row.querySelector(".rate").value;
        const total = row.querySelector(".itemTotal").innerText;

        pdf.text(desc || "-", 14, y);
        pdf.text(qty, 100, y);
        pdf.text(rate, 120, y);
        pdf.text(total, 160, y);
        y += 8;
    });

    y += 10;

    pdf.text("Total: AED " + document.getElementById("grandTotal").innerText, 140, y);

    pdf.save("Chemsouq-Invoice.pdf");
}
