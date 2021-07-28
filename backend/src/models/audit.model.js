import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AuditsSchema = new Schema({
    pageId: {type: Schema.Types.ObjectId, ref: 'Page', index: true},
    firstURL: String,
    initialDomainName: String,
    standard: String,
    browser: String,
    postLoadingDelay: Number,
    dateStarted: Date,
    dateEnded: Date,
    nbScanErrors: Number,
    violations: [{
        id: String,
        description: String,
        descLink: String,
        impact: String,
        nodes: [{
            target: String,
            html: String
        }],
        category: String
    }],
    complete: Boolean,
}, { timestamps: true });

AuditsSchema.set('toObject', { virtuals: true });
AuditsSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Audit', AuditsSchema);
