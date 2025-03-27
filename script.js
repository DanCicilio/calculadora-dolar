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

function calcularMediana(arr) {
    arr.sort((a, b) =&gt; a - b);
    const meio = Math.floor(arr.length / 2);

    if (arr.length % 2 === 0) {
        return (arr[meio - 1] + arr[meio]) / 2;
    } else {
        return arr[meio];
    }
}

function updateResults() {
    const diFuturoInput = document.getElementById('diFuturo').value.replace(',', '.');
    const diFuturo = parseFloat(diFuturoInput);
    
    const fechamentoDolarCheioInput = document.getElementById('fechamentoDolarCheio').value.replace(/[^\d,]/g, '').replace(',', '.');
    const fechamentoDolarCheio = parseFloat(fechamentoDolarCheioInput);
    
    const dolarComercialInput = document.getElementById('dolarComercial').value.replace(/[^\d,]/g, '').replace(',', '.');
    const dolarComercial = parseFloat(dolarComercialInput);
    
    const dxFuturoInput = document.getElementById('dxFuturo').value.replace(',', '.').replace('%', '');
    const dxFuturo = parseFloat(dxFuturoInput) / 100;

    const diasUteis = parseInt(document.getElementById('diasUteis').value);
    
    if (!isNaN(diFuturo) &amp;&amp; !isNaN(fechamentoDolarCheio) &amp;&amp; !isNaN(dolarComercial) &amp;&amp; !isNaN(diasUteis)) {
        const overRate = Math.pow(diFuturo + 1, 0.003968254);

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + diasUteis);
        
        const resultadoFinal = (overRate - 1) * diasUteis;

        const abertura = arredondarPara050(fechamentoDolarCheio * (1 + dxFuturo));
        const dolarJusto = arredondarPara050(dolarComercial * (1 + resultadoFinal / 100));

        const deltaReal = calcularDeltaMedio(diFuturo);
        const taxaOver = resultadoFinal.toFixed(5) + '%';

        const novoValor = diasUteis * 0.003968254 * deltaReal;
        const taxa = Math.pow(2.718281, novoValor);
        const doltaxa = fechamentoDolarCheio * taxa;
        const deltaRealResult = doltaxa - fechamentoDolarCheio;

        const deltas = [5, 10, 15, 20];
        let deltasResultados = [deltaRealResult];

        let resultHtml = `Abertura: R$ ${abertura.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}` + 
                         `&lt;br&gt;Dólar Justo: R$ ${dolarJusto.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}` + 
                         `&lt;br&gt;`;

        deltas.forEach(diasFixos =&gt; {
            const resultadoFinalFixo = (overRate - 1) * diasFixos;
            const novoValorFixo = diasFixos * 0.003968254 * deltaReal;
            const taxaFixo = Math.pow(2.718281, novoValorFixo);
            const doltaxaFixo = fechamentoDolarCheio * taxaFixo;

            const deltaFixo = doltaxaFixo - fechamentoDolarCheio;
            deltasResultados.push(deltaFixo);
        });

        const deltaMediana = calcularMediana(deltasResultados);

        const maxima = arredondarPara050(abertura + (resultadoFinal / 100) * abertura + deltaMediana);
        const minima = arredondarPara050(abertura + (resultadoFinal / 100) * abertura - deltaMediana);

        resultHtml += `Máxima: R$ ${maxima.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}` +
                      `&lt;br&gt;Mínima: R$ ${minima.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}` +
                      `&lt;br&gt;&lt;br&gt;Taxa over: ${taxaOver}`+
                      `&lt;br&gt;&lt;br&gt;&lt;i&gt;Calculo de Deltas&lt;/i&gt;&lt;br&gt;&lt;br&gt;`;

        const resultadosAdicionais = [
            { label: '+BC', percentage: 1.20 },
            { label: '+MAX3', percentage: 0.90 },
            { label: '+MAX2', percentage: 0.75 },
            { label: '+MAX1', percentage: 0.65 },
            { label: '+Δ3', percentage: 0.60 },
            { label: '+Δ2', percentage: 0.55 },
            { label: '+Δ1', percentage: 0.50 },
            { label: 'Abertura', percentage: -0.00 },
            { label: '-Δ1', percentage: -0.50 },
            { label: '-Δ2', percentage: -0.55 },
            { label: '-Δ3', percentage: -0.60 },
            { label: '-MAX1', percentage: -0.65 },
            { label: '-MAX2', percentage: -0.75 },
            { label: '-MAX3', percentage: -0.90 },
            { label: '-BC', percentage: -1.20 },
        ];

        resultadosAdicionais.forEach(item =&gt; {
            const valor = arredondarPara050(abertura * (1 + item.percentage / 100));
            resultHtml += `${item.label}: R$ ${valor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}&lt;br&gt;`;
        });

      resultHtml += `&lt;br&gt;Delta Mediana: ${deltaMediana.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}` +
                      `&lt;br&gt;&lt;br&gt;Data de Início: ${startDate.toLocaleDateString('pt-BR')}&lt;br&gt;` +
                      `Data de Fim: ${endDate.toLocaleDateString('pt-BR')}&lt;br&gt;` +
                      `Dias Úteis: ${diasUteis}&lt;br&gt;`;
                     
        document.getElementById('result').innerHTML = resultHtml;

        document.getElementById('ptaxGroup').style.display = 'block';
        document.getElementById('calcForm').setAttribute('data-resultado-final', resultadoFinal);
    } else {
        document.getElementById('result').innerHTML = '';
    }
}

function calcularPTAX() {
    const ptaxInput = document.getElementById('ptax').value.replace(/[^\d,]/g, '').replace(',', '.');
    const ptaxValue = parseFloat(ptaxInput);
    
    const resultadoFinal = parseFloat(document.getElementById('calcForm').getAttribute('data-resultado-final'));
    
    if (!isNaN(ptaxValue) &amp;&amp; !isNaN(resultadoFinal)) {
        const resultadoPTAX = arredondarPara050(ptaxValue + (ptaxValue*resultadoFinal)/100); 
        const resultHtml = `Resultado PTAX Calculada: R$ ${resultadoPTAX.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`;
        document.getElementById('result').innerHTML += `&lt;br&gt;${resultHtml}`;
    } else {
        alert('Por favor, insira um valor válido para PTAX.');
    }
}

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

function formatCurrency(input) {
    let value = input.value.replace(/[^\d,]/g, '');
    let parts = value.split(',');
    let integerPart = parts[0].replace(/\D/g, '');
    let decimalPart = parts.length &gt; 1 ? parts[1].replace(/\D/g, '').substring(0, 2) : '';

    if (integerPart.length &gt; 6) {
        integerPart = integerPart.substring(0, 6);
    }

    let formattedValue = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (decimalPart ? ',' + decimalPart : ',00');
    
    input.value = formattedValue;
}

function formatPercent(input) {
    let value = input.value.replace(/[^\d,-]/g, '');
    let parts = value.split(',');
    let integerPart = parts[0].replace(/\D/g, '');
    let decimalPart = parts.length &gt; 1 ? parts[1].replace(/\D/g, '').substring(0, 2) : '';

    if (decimalPart.length &lt; 2) {
        decimalPart = decimalPart.padEnd(2, '0');
    }

    let formattedValue = integerPart;
    if (decimalPart) {
        formattedValue += ',' + decimalPart;
    }

    if (value.startsWith('-')) {
        input.value = '-' + formattedValue + '%';
    } else {
        input.value = formattedValue + '%';
    }
}

function arredondarPara050(valor) {
    return Math.round(valor * 2) / 2;
}

function calcularDeltaMedio(diFuturo) {
    return diFuturo / 100;
}

document.getElementById('calculateButton').addEventListener('click', function() {
    updateResults();
});

document.getElementById('clearButton').addEventListener('click', function() {
    document.getElementById('calcForm').reset();
    document.getElementById('result').textContent = '';
    document.getElementById('ptaxGroup').style.display = 'none';
    document.getElementById('calcForm').removeAttribute('data-resultado-final');
});
