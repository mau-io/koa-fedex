const sqlite = require('sqlite');

module.exports =  {

   saveReport: async function(json){
    const db = await sqlite.open('./database.sqlite');
    const insert = await db.all(`INSERT INTO reports (json) VALUES( '${JSON.stringify(json)}')`);
    console.log(insert);
    return insert;
   },

   getReport: async function(id){
    const db = await sqlite.open('./database.sqlite');
    const select = await db.all(`SELECT json FROM reports WHERE id = ${id}`);
    return JSON.parse(select[0].json);
   },

   getAllIdReports: async function(){
    const db = await sqlite.open('./database.sqlite');
    const select = await db.all(`SELECT id FROM reports`);
    return select;
   }

}