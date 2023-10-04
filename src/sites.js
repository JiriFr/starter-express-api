const config = require('./config')
const axios = require('axios')


const distance = (lat1,lon1,lat2,lon2) => {
    const R = 6371e3; // metres
    const psi1 = lat1 * Math.PI/180; // φ, λ in radians
    const psi2 = lat2 * Math.PI/180;
    const deltaPsi = (lat2-lat1) * Math.PI/180;
    const deltaLambda = (lon2-lon1) * Math.PI/180;
    
    const a = Math.sin(deltaPsi/2) * Math.sin(deltaPsi/2) +
              Math.cos(psi1) * Math.cos(psi2) *
              Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c / 1000; // in km
    
}

const accountDetails = async (req,res) => {
    const sitesResponse = await axios.get("https://www.paragliding-mapa.cz/api/v0.1/launch")
    var sitesData = []
    sitesResponse.data.data.forEach((el) => {
        //BRNO: const d = distance(49.1826582,16.6316407,el.latitude, el.longitude)
        const d = distance(50.0915,16.2631,el.latitude, el.longitude)
        
        if (d<50) {
            sitesData.push(
                {
                    id:el.id,
                    name:el.name,
                    distance:d,
                    wind_usable_from: el.wind_usable_from,
                    wind_usable_to: el.wind_usable_to,
                    wind_optimal_from: el.wind_optimal_from,
                    wind_optimal_to: el.wind_optimal_to,
                    flying_status: el.flying_status
                })
            console.log(el.name, el.latitude, el.longitude,d)
        }
        
    })
    return res.json(sitesData.sort((a,b)=>{ return a.distance - b.distance}))
}

const getWeather = async (req,res) => {
    //const apiResponse = await axios.get("https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=50.1072265&lon=16.2510433",
    const apiResponse = await axios.get("https://api.met.no/weatherapi/locationforecast/2.0/compact.json?lat=50.1072265&lon=16.2510433",
         {
            headers: {
             "User-Agent": "custom-user-agent string"
            }
         }
    )
    
    dt_start = new Date("2023-10-04T17:00:00Z")
    dt_stop  = new Date("2023-10-07T12:00:00Z")
    
    
    // {
    //     "time":"2023-10-04T20:00:00Z",
    //     "data": {
    //         "instant": {
    //             "details":{
    //                 "air_pressure_at_sea_level":1026.7,
    //                 "air_temperature":10.2,
    //                 "cloud_area_fraction":100.0,
    //                 "relative_humidity":83.4,
    //                 "wind_from_direction":127.1,
    //                 "wind_speed":2.1
    //              }
    //         },
    //         "next_12_hours":{"summary":{"symbol_code":"partlycloudy_night"}},
    //         "next_1_hours":{"summary":{"symbol_code":"cloudy"},"details":{"precipitation_amount":0.0}},
    //         "next_6_hours":{"summary":{"symbol_code":"partlycloudy_night"},"details":{"precipitation_amount":0.0}}
    //         }
    // },
    // {
    //     "time":"2023-10-04T21:00:00Z",
    //     "data": {
    //         "instant":{"details":{"air_pressure_at_sea_level":1026.5,"air_temperature":10.6,"cloud_area_fraction":100.0,"relative_humidity":76.7,"wind_from_direction":149.0,"wind_speed":2.2}},
    //         "next_12_hours":{"summary":{"symbol_code":"partlycloudy_day"}},
    //         "next_1_hours":{"summary":{"symbol_code":"partlycloudy_night"},"details":{"precipitation_amount":0.0}},
    //         "next_6_hours":{"summary":{"symbol_code":"partlycloudy_night"},"details":{"precipitation_amount":0.0}}
    //     }
    // },

    ts = await apiResponse.data.properties.timeseries
    ts0 = ts.filter((el) => new Date(el.time) > dt_start && new Date(el.time) < dt_stop)
    
    timeSeries = []
    ts0.forEach((el) => timeSeries.push(
        {
            time: el.time, 
            wind_from_direction: el.data.instant.details.wind_from_direction,
            wind_speed: el.data.instant.details.wind_speed,
            precipitation_amount: el.data.next_1_hours.details.precipitation_amount

        }))
   
    console.log(timeSeries)
    return res.json(timeSeries)
}



module.exports = {
    accountDetails,
    getWeather
}


//Němčany 49.1562 16.9249
//16.6316407&y=49.1826582
//BRNO x=16.9249&y=49.1562
//DOUDLEBY x=16.2510433&y=50.1072265&z=16