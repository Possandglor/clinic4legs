const qr = require('qrcode');

const os = require('os');
let currentIP = ""
// Получение информации о сетевых интерфейсах
const networkInterfaces = os.networkInterfaces();

// Перебор сетевых интерфейсов и вывод информации
for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
            currentIP = iface.address + ":3000"
        }
    }
}


// Текст или данные, которые вы хотите закодировать в QR-код
const data = currentIP;

// Параметры для настройки внешнего вида QR-кода (необязательно)
const options = {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    rendererOpts: {
        quality: 0.3
    }
};

// Создайте QR-код из текста или данных
qr.toFile('site/styles/qrcode.png', data, options, (err) => {
    if (err) throw err;
    console.log('QR-код успешно создан!');
});

