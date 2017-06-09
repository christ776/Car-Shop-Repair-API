
const RepairStatus = ['complete','incomplete'];

// Define user model schema
var CarRepairSchema = new mongoose.Schema({
  title:{
      type:String,
      required:true
  },
  created: {
    type: { type: Date, default: Date.now },
    unique: true,
    required: true
  },
  status: {
    type: String,
    required: true,
    default:'incomplete',
    enum:RepairStatus
  },
  comments:{
    type:String,
    required:false
  }
});

// Export user model
module.exports = mongoose.model('Repair', CarRepairSchema);