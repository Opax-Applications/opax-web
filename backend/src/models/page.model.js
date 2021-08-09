import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PagesSchema = new Schema({
    siteId: {type: Schema.Types.ObjectId, ref: 'Site', index: true, required: true},
    url: {
        type: String,
        index: true,
        unique: true,
    },
    status: String
}, {timestamps: true});

PagesSchema.virtual('audits', {
    ref: 'PageAudit',
    localField: '_id',
    foreignField: '_pageId'
})

PagesSchema.set('toObject', { virtuals: true });
PagesSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Page', PagesSchema);
