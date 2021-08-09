import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SiteSchema = new Schema({
    url: {
        type: String,
        index: true,
        unique: true,
    },
    name: String
}, {timestamps: true});

SiteSchema.virtual('numberOfPages', {
    ref: 'Page',
    localField: '_id',
    foreignField: 'siteId',
    count: true
})

SiteSchema.virtual('numberOfDefects', {
    ref: 'PageAudit',
    localField: '_id',
    foreignField: 'siteId',
    count: true
})

SiteSchema.set('toObject', {virtuals: true});
SiteSchema.set('toJSON', {virtuals: true});

SiteSchema.statics.createSites = async function () {
    const telstra = await this.create({
        url: 'www.telstra.com.au',
        name: 'Telstra'
    });

    const agl = await this.create({
        url: 'www.agl.com.au',
        name: 'Agl'
    });
};

export default mongoose.model('Site', SiteSchema);
