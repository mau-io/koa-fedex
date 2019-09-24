//const db 				= require('../db');
const fedexAPI     = require('../libraries/fedex');

let lb2kg = (LB) => LB * 0.4536;
let In2cm = (IN) => IN * 2.54;
let totalWeight = (weight) => Math.ceil(weight);
let dimensionalWeight = function(weight, length, width, height) {
  var dimWeight = (length * width * height) / 5000;
  if(dimWeight > weight) {
    return dimWeight;
  } else {
    return weight;
  }
};

let relu = (x) => {
  return x > 0
    ? x
    : 0
}

module.exports =  {
  calculateReport: async function(objects, _count = 0, _array = []){

    let element = objects[_count];
    let PackageWeight;
    let PackageDimensions;
    let realdw;

    if(process.env.FEDEX_DEMO == 'false'){
      let response = await fedexAPI.track({
        SelectionDetails: {
          PackageIdentifier: {
            Type: 'TRACKING_NUMBER_OR_DOORTAG',
            Value: element.tracking_number
          }
        }
      });
      /**
        PackageWeight: { Units: 'LB', Value: '21.5' },
        PackageDimensions: { Length: '22', Width: '17', Height: '10', Units: 'IN' },
      */
      PackageWeight     = response.CompletedTrackDetails[0].TrackDetails[0].PackageWeight;
      PackageDimensions = response.CompletedTrackDetails[0].TrackDetails[0].PackageDimensions;
    }else{
      PackageWeight     = { Units: 'LB', Value: '2.5' };
      PackageDimensions = { Length: '22', Width: '17', Height: _count, Units: 'IN' };
    }
    
    let dw = dimensionalWeight(element.parcel.weight, element.parcel.length, element.parcel.width, element.parcel.height);

    let PackageWeightInKg = PackageWeight.Units == "LB" ?  lb2kg(PackageWeight.Value) : PackageWeight.Value;
    
    if(PackageDimensions.Units == "IN"){
      realdw = dimensionalWeight(PackageWeightInKg, In2cm(PackageDimensions.Length), In2cm(PackageDimensions.Width), In2cm(PackageDimensions.Height));
    }else{
      realdw = dimensionalWeight(PackageWeightInKg, PackageDimensions.Length, PackageDimensions.Width, PackageDimensions.Height);
    }
    
    let o = {
      trackId:                element.tracking_number,
      weight:                 element.parcel.weight,
      dimensionalWeight:      dw,
      totalWeight:            totalWeight(dw),
      realWeight:             PackageWeightInKg,
      realDimensionalWeight:  realdw,
      realTotalWeight:        totalWeight(realdw)
    }
  
    o.overweight = o.totalWeight < o.realTotalWeight;
    o.overweightDifference = relu(o.realTotalWeight - o.totalWeight);
  
    _count++;
 
    _array.push(o);
    
    if(_count < objects.length){ 
      return this.calculateReport(objects, _count, _array);
    }else{
      return _array;
    }
    
  }
}

