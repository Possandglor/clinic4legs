const qrcode = require('qrcode');
const os = require('os');
const interfaces = os.networkInterfaces();
var myip = ""
// Перебираем все интерфейсы
for (const name of Object.keys(interfaces)) {
    // Перебираем все адреса для каждого интерфейса
    for (const address of interfaces[name]) {
      // Проверяем, что адрес является IPv4 и не является внутренним (локальным)
      if (address.family === 'IPv4' && !address.internal) {
        // Выводим адрес в консоль
        myip = address.address
      }
    }
  }


qrcode.toDataURL(myip+":3000", function (err, data) {
    if (err) throw err;
    document.getElementById("qr").setAttribute("src",data)
    document.getElementById("myip").innerText = myip+":3000"
  });

// qrcode.toFile('./qr.png', 'sample text', {
//     color: {
//         dark: '#00F',  // Blue dots
//         light: '#0000' // Transparent background
//     }
// }, function (err) {
//     if (err) throw err;
// });