let itemIndex = 0;

function addItem() {
    itemIndex++;
    const tableBody = document.querySelector("#itemsTable tbody");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" class="form-control desc"></td>
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

async function generatePDF() {
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("p", "mm", "a4");
    let y = 20;

    pdf.setFontSize(18);
    pdf.text("Chemsouq", 105, y, null, null, "center");
    y += 8;

    pdf.setFontSize(10);
    pdf.text("Dubai, UAE | TRN: 100XXXXXXX", 105, y, null, null, "center");
    y += 15;

    pdf.setFontSize(12);
    pdf.text("Invoice No: " + document.getElementById("invoiceNo").value, 14, y);
    y += 8;

    pdf.text("Customer: " + document.getElementById("custName").value, 14, y);
    y += 10;

    pdf.text("Total: AED " + document.getElementById("grandTotal").innerText, 14, y);

    pdf.save("Chemsouq-Invoice.pdf");
}
