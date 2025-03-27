function clearField(fieldId) {
    document.getElementById(fieldId).value = '';
}

function formatDiFuturo(input) {
    let value = input.value.replace(/[^\d,]/g, '').replace(',', '.');
    const numberValue = parseFloat(value);
    if (!isNaN(numberValue)) {
        input.value = numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).replace('.', ',');
    } else {
        input.value = '';
    }
}

// Adicione as outras funções JavaScript aqui, como calcularPTAX, updateResults, etc.

document.getElementById('calculateButton').addEventListener('click', function() {
    updateResults();
});

document.getElementById('clearButton').addEventListener('click', function() {
    document.getElementById('calcForm').reset();
    document.getElementById('result').textContent = '';
    document.getElementById('ptaxGroup').style.display = 'none';
});
