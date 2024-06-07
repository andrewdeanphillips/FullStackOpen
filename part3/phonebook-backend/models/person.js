const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI


console.log('connecting to', url)

mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

//Validate format: be formed of two parts that are separated by -
//the first part has two or three numbers and the second part also consists of numbers
const validateNumber = (num) => {
  const parts = num.split('-')
  console.log(parts[0], parts[1])

  if (parts.length !== 2) {
    return false;
  }

  if (parts[0].length !== 2 && parts[0].length !== 3) {
    return false;
  }
  //Test that there are only digits
  return /^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: validateNumber
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)