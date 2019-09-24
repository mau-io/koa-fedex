//////////////////////////////////////////////
// Config Web API
//////////////////////////////////////////////
// Para ver mas reglas de configuracion de parametros
// https://github.com/node-modules/parameter

module.exports = {
  v1:{
    
    track:{  

      getTrack:{
        description: "description...",
        verb:"GET",
        verifyParams:{
          id: { type: 'string',  required: true },
        }
      }

    },
    
    report:{  

      getReport:{
        description: "description...",
        verb:"GET",
        verifyParams:{
          id: { type: 'string', required: false },
        }
      },

      createReport:{
        description: "description...",
        verb:"POST",
        verifyParams:{
          json: { type: 'string', required: true },
        }
      }

    }
    
  }
}