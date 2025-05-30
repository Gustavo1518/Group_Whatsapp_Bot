const { rest } = require('./conexion.js')
  //CONSULTA DATOS DEL CLIENTE
  const consulta = async (USUARIO, PASS) => {
    try {
        let response = await rest.executeQuery("select * from Users_Api where USUARIO = @USUARIO and PASS = @PASS",
        [
         {
            name: "USUARIO",
            type: "nvarchar",
            value: USUARIO,
         },
         {
          name: "PASS",
          type: "nvarchar",
          value: PASS,
       }
        ])
        return response.data[0]
    } catch (error) {
        return error.response
    }
  }

  module.exports = { 
    consulta
  }
