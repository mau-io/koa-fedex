//const db 				    = require('../../db');
const endpoints     = require('../../routes/endpoints').v1.report;
const result		    = require('../../libraries/result');
const reportService	= require('../../services/reportService');
const reportModel   = require('../../models/reportModel');
const parsed = jsonText => JSON.parse(jsonText);

module.exports =  {

  getReport: async (ctx, next) => {

		ctx.verifyParams(endpoints.getReport.verifyParams);

		try {
      let params = ctx.query;
      let response;

      if(params.id){
        response = await reportModel.getReport(params.id);
      }else{
        response = await reportModel.getAllIdReports();
      }
     
			ctx.body = result(response);
		} catch(err) {
			ctx.throw(err);
		}

  },

  createReport: async (ctx, next) => {

		ctx.verifyParams(endpoints.createReport.verifyParams);

		try {
      let params = ctx.request.body;
      
      let report = await reportService.calculateReport(parsed(params.json));
      await reportModel.saveReport(report);

			ctx.body = result(report);
		} catch(err) {
			ctx.throw(err);
		}

  }
  
}
