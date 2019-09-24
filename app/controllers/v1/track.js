const endpoints = require('../../routes/endpoints').v1.track;
const result		= require('../../libraries/result');
const fedexAPI  = require('../../libraries/fedex');

module.exports =  {

  getTrack: async (ctx, next) => {

		ctx.verifyParams(endpoints.getTrack.verifyParams);

		try {
      let params = ctx.query;

      let response = await fedexAPI.track({
        SelectionDetails: {
          PackageIdentifier: {
           Type: 'TRACKING_NUMBER_OR_DOORTAG',
           Value: params.id
          }
        }
      });

			ctx.body = result(response);

		} catch(err) {
			ctx.throw(err);
		}

  }
  
}
