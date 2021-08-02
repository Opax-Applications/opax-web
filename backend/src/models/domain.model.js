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

DomainsSchema.statics.createDomains = async function() {
    const telstra = await this.create({
        name: 'www.telstra.com.au'
    });

    const agl = await this.create({
        name: 'www.agl.com.au'
    });
};

export default mongoose.model('Domain', DomainsSchema);
