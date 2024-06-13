const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "eilkiriaxogos@gmail.com",
        pass: "zjrd hbos cazf kbeb"
    }
})

const sendMail = (email, name) =>{

    let mensajeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Bienvenid@ a Galicasa ${name}</h1>
    <h3>Regsitro exitoso</h3>
</body>
</html>`

    //verificacion si la comunicación es correcta
    // transporter
    //     .verify()
    //     .then(()=>console.log("todo ok")
    //     .catch((err)=>err));

    const info = transporter.sendMail({
        from: ' "Samuel" <eilkiriaxogos@gmail.com>',
        to: email,
        subject: "Bienvenida a Galicasa",
        html: mensajeHtml
    })
    info
        .then(res=>console.log(res))
        .catch(err=>console.log(err))

}

module.exports = sendMail;