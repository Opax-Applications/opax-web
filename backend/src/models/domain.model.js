import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DomainsSchema = new Schema({
  name: {
    type: String,
    index: true,
    unique: true,
  }
}, {timestamps: true});

DomainsSchema.set('toObject', {virtuals: true});
DomainsSchema.set('toJSON', {virtuals: true});

export default mongoose.model('Domain', DomainsSchema);
