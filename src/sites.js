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

module.exports = {
    accountDetails
}


//Němčany 49.1562 16.9249
//16.6316407&y=49.1826582
//BRNO x=16.9249&y=49.1562
//DOUDLEBY x=16.2510433&y=50.1072265&z=16