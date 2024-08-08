let expenses = [];
let totalAmount = 0;
let editingIndex = null;

const categorySelect = document.getElementById("category_select");
const amountInput = document.getElementById("amount_input");
const infoInput = document.getElementById("info");
const dateInput = document.getElementById("date_input");
const addBtn = document.getElementById("add_btn");
const expenseTableBody = document.getElementById("expense-table-body");
const totalAmountCell = document.getElementById("total-amount");
const entryIdInput = document.getElementById("entry_id");

addBtn.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent form submission

    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const info = infoInput.value;
    const date = formatDate(dateInput.value);
    const id = entryIdInput.value;

    // Validation checks
    if (!category) {
        alert("Please select a category");
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        return;
    }
    if (!info) {
        alert("Please enter valid info");
        return;
    }
    if (!dateInput.value) {
        alert("Please select a date");
        return;
    }

    const expense = { category, amount, info, date, id };
    
    if (editingIndex !== null) {
        // Update existing entry
        expenses[editingIndex] = expense;
        editingIndex = null;
        entryIdInput.value = ''; // Clear hidden input
    } else {
        // Add new entry
        expenses.push(expense);
    }

    // Update the total amount
    if (category === "Income") {
        totalAmount += amount;
    } else if (category === "Expense") {
        totalAmount -= amount;
    }
    totalAmountCell.textContent = totalAmount;

    // Update table
    updateTable();
    resetForm();
});

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', options).toUpperCase();
}

function updateTable() {
    expenseTableBody.innerHTML = '';
    expenses.forEach((expense, index) => {
        const newRow = expenseTableBody.insertRow();
        newRow.insertCell().textContent = expense.category;
        newRow.insertCell().textContent = expense.amount;
        newRow.insertCell().textContent = expense.info;
        newRow.insertCell().textContent = expense.date;

        const editCell = newRow.insertCell();
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.addEventListener("click", function() {
            categorySelect.value = expense.category;
            amountInput.value = expense.amount;
            infoInput.value = expense.info;
            dateInput.value = formatDateToInput(expense.date);
            entryIdInput.value = expense.id;
            editingIndex = index;

            if (expense.category === "Income") {
                totalAmount -= expense.amount;
            } else if (expense.category === "Expense") {
                totalAmount += expense.amount;
            }
            totalAmountCell.textContent = totalAmount;
        });
        editCell.appendChild(editBtn);

        const deleteCell = newRow.insertCell();
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", function() {
            expenses.splice(index, 1);
            if (expense.category === "Income") {
                totalAmount -= expense.amount;
            } else if (expense.category === "Expense") {
                totalAmount += expense.amount;
            }
            totalAmountCell.textContent = totalAmount;
            updateTable();
        });
        deleteCell.appendChild(deleteBtn);
    });
}

function resetForm() {
    categorySelect.value = '';
    amountInput.value = '';
    infoInput.value = '';
    dateInput.value = '';
}

function formatDateToInput(dateString) {
    const [month, day, year] = dateString.split(" ");
    const months = { 'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12' };
    return `${year}-${months[month]}-${day}`;
}

updateTable();
