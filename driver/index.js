const express = require('express');
const slashes = require('connect-slashes');
const cors = require('cors');

if(process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const PORT = process.env.PORT || 5000;

// Setting up the server
const app = express();
app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 
app.use(slashes(false));
app.listen(PORT, () => console.log(`Driver software is running on ${PORT}`));


let temperature = 25; // Set initial temperature to 25°C
let humidity = 50; // Set initial humidity to 50%
function validateFields(){
  if(!temperature)
    temperature = 25;
  if(!humidity)
    humidity = 50;
  
}

function randomRangeAbsolute(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomChange(){
  return Math.random() - 0.5;
}

function activateSensor(){
  // Generate random changes for temperature and humidity
  const temperatureChange = randomChange();
  const humidityChange = randomChange();
  
  // Update temperature and humidity with the random changes
  temperature += temperatureChange;
  humidity += humidityChange;
  
  // Ensure that temperature and humidity stay within realistic ranges
  if (temperature < 10) {
    temperature = 10;
  } else if (temperature > 40) {
    temperature = 40;
  }
  
  if (humidity < 30) {
    humidity = 30;
  } else if (humidity > 70) {
    humidity = 70;
  }

  temperature = Number(temperature.toFixed(3));
  humidity = Number(humidity.toFixed(3));

  return {
    temperature,
    humidity,
    timestamp: new Date()
  }
}



app.get('/driver/sensor', (req, res) => {
  res.status(200).json({
    ...activateSensor(),
  })
})

// Scenarios
const scenarios = {
  normal: {
    temp: {
      min: 23,
      max: 27,
    },
    humidity: {
      min: 43,
      max: 52,
    }
  },
  coldStorage: {
    temp: {
      min: 10,
      max: 15,
    },
    humidity: {
      min: 45,
      max: 60,
    }
  },
  coldStorageCompromised: {
    temp: {
      min: 17,
      max: 20,
    },
    humidity: {
      min: 61,
      max: 72,
    }
  },
}
function setComponentConditions(component){
  if(!component)
    component = scenarios.normal;
  temperature = randomRangeAbsolute(component.temp.min, component.temp.max) + randomChange();
  humidity = randomRangeAbsolute(component.humidity.min, component.humidity.max) + randomChange();
}


app.get('/normal', (req, res) => {
  setComponentConditions(scenarios.normal)
  res.json({ message: "Success !", temperature, humidity });
})
app.get('/coldStorage', (req, res) => {
  setComponentConditions(scenarios.coldStorage)
  res.json({ message: "Success !", temperature, humidity });
})
app.get('/coldStorageCompromised', (req, res) => {
  setComponentConditions(scenarios.coldStorageCompromised)
  res.json({ message: "Success !", temperature, humidity });
})


// Test
app.get('/test', (req, res) => {
  res.status(200).send( "Server is running !!");
})
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: "Server is running !!" });
})
app.get('/api/ping', (req, res)=>{
  res.status(200).send('-- ok --');
});


// 404 pages for development
app.get('*', (req, res)=>{
    res.status(404).send("API not found :(  <br> ¯\\_(ツ)_/¯");
});