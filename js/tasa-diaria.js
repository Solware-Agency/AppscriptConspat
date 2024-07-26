const cache = {
    tasaValor: null, 
    timestamp: null
  };

  async function getExchangeRateGHL() {
    try {
      // Verificar si la tasa de cambio está en caché y no ha expirado
      if (cache.tasaValor !== null && cache.timestamp + 300000 > Date.now()) {
        document.getElementById('tasa-valor-ghl').textContent = `Tasa: ${cache.tasaValor.toLocaleString('es-VE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
        return;
      }

      // Realizar la solicitud HTTP para obtener la tasa de cambio
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();

      // Procesar la respuesta y obtener la tasa de cambio
      const tasaValor = data.rates.VES;

      if (!isNaN(tasaValor) && tasaValor > 0) {
        cache.tasaValor = tasaValor;
        cache.timestamp = Date.now();
        document.getElementById('tasa-valor-ghl').textContent = `Tasa: ${tasaValor.toLocaleString('es-VE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
        updateConversion();
      } else {
        throw new Error('Valor de tasa inválido');
      }
    } catch (error) {
      console.error('Error al obtener la tasa de cambio:', error);
      document.getElementById('tasa-valor-ghl').textContent = 'Error al obtener la tasa de cambio';
    }
  }

  function updateConversion() {
    const montoUSD = document.getElementById('monto-usd').value;
    if (montoUSD !== '' && !isNaN(montoUSD) && cache.tasaValor) { // Verificar si hay tasa válida
      const resultadoVES = montoUSD * cache.tasaValor;
      document.getElementById('resultado-ves').textContent = `Bs. ${resultadoVES.toFixed(1)}`; 
    } else {
      document.getElementById('resultado-ves').textContent = 'Bs. 0.0';
    }
  }

  document.getElementById('monto-usd').addEventListener('input', updateConversion);

  // Llamar a la función para obtener la tasa de cambio
  getExchangeRateGHL();

  // Actualizar la tasa de cambio cada 5 minutos
  setInterval(getExchangeRateGHL, 300000);