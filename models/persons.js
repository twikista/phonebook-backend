const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const uri = process.env.MONGODB_URI
mongoose
  .connect(uri)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message)
  })

const validateFn = (val) => {
  return /^\d{2,3}-\d{5,10}$/.test(val)
}

const validate = [
  validateFn,
  '{PATH} format must be 09-1234556 or 040-22334455',
]

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'name must be minimum three (3) charaters long'],
    required: [true, 'name is required'],
  },
  number: {
    type: String,
    minLength: [8, 'must be minimum 8 numbers'],
    validate: validate,
    required: [true, 'number is required'],
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObjects) => {
    returnedObjects.id = returnedObjects._id.toString()
    delete returnedObjects._id
    delete returnedObjects.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
