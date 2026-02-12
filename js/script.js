let itemIndex = 0;

// ➕ Add New Item Row
function addItem() {
    itemIndex++;
    const tableBody = document.querySelector("#itemsTable tbody");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" class="form-control desc" placeholder="Item description"></td>
        <td><input type="number" class="form-control qty" value="1" onchange="calculateTotals()"></td>
        <td><input type="number" class="form-control rate" value="0" onchange="calculateTotals()"></td>
        <td class="itemTotal">0.00</td>
        <td>
            <button class="btn btn-danger btn-sm" 
                onclick="this.closest('tr').remove(); calculateTotals();">
                X
            </button>
        </td>
    `;

    tableBody.appendChild(row);
}

// 🧮 Calculate Totals
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

// 💾 Save Invoice To MongoDB
async function saveInvoiceToDB(invoiceData) {
    try {
        const response = await fetch("http://localhost:5000/api/invoices", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(invoiceData)
        });

        const result = await response.json();
        console.log(result);
        alert("Invoice saved to database ✅");

    } catch (error) {
        console.error("Error saving invoice:", error);
        alert("Error saving invoice ❌");
    }
}

// 🧾 Generate PDF + Save to Database
async function generatePDF() {

    const invoiceNumber = document.getElementById("invoiceNo").value;
    const customerName = document.getElementById("custName").value;

    let items = [];
    let subtotal = 0;

    document.querySelectorAll("#itemsTable tbody tr").forEach(row => {

        const description = row.querySelector(".desc").value || "-";
        const quantity = parseFloat(row.querySelector(".qty").value) || 0;
        const price = parseFloat(row.querySelector(".rate").value) || 0;

        const totalItem = quantity * price;
        subtotal += totalItem;

        items.push({
            description,
            quantity,
            price,
            totalItem
        });
    });

    const vat = subtotal * 0.05;
    const total = subtotal + vat;

    const invoiceData = {
        invoiceNumber,
        customerName,
        customerEmail: "notprovided@email.com",
        items,
        subtotal,
        vat,
        total
    };

    // 🔥 SAVE TO DATABASE
    await saveInvoiceToDB(invoiceData);

    // 📄 GENERATE PDF
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    let y = 20;

    // Company Header
    pdf.setFontSize(18);
    pdf.text("Chemsouq", 105, y, null, null, "center");
    y += 8;

    pdf.setFontSize(10);
    pdf.text("Dubai, UAE | TRN: 100XXXXXXX", 105, y, null, null, "center");
    y += 15;

    // Invoice Info
    pdf.setFontSize(12);
    pdf.text("Invoice No: " + invoiceNumber, 14, y);
    y += 8;

    pdf.text("Customer: " + customerName, 14, y);
    y += 12;

    // Table Header
    pdf.setFontSize(11);
    pdf.text("Description", 14, y);
    pdf.text("Qty", 110, y);
    pdf.text("Rate", 130, y);
    pdf.text("Total", 160, y);
    y += 8;

    // Divider Line
    pdf.line(14, y - 4, 195, y - 4);

    // Items
    items.forEach(item => {
        pdf.text(item.description, 14, y, { maxWidth: 80 });
        pdf.text(item.quantity.toString(), 110, y);
        pdf.text(item.price.toFixed(2), 130, y);
        pdf.text(item.totalItem.toFixed(2), 160, y);
        y += 8;
    });

    y += 5;

    // Totals
    pdf.line(120, y - 4, 195, y - 4);

    pdf.text("Subtotal: AED " + subtotal.toFixed(2), 130, y);
    y += 8;

    pdf.text("VAT (5%): AED " + vat.toFixed(2), 130, y);
    y += 8;

    pdf.setFontSize(13);
    pdf.text("Grand Total: AED " + total.toFixed(2), 130, y);

    pdf.save("Chemsouq-Invoice.pdf");
}
