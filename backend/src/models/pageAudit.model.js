import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PageAuditSchema = new Schema({
    pageId: {type: Schema.Types.ObjectId, ref: 'Page', index: true},
    standard: String,
    browser: String,
    postLoadingDelay: Number,
    dateEnded: Date,
    nbViolations: Number,
    errorMessage: String,
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

PageAuditSchema.set('toObject', { virtuals: true });
PageAuditSchema.set('toJSON', { virtuals: true });

export default mongoose.model('PageAudit', PageAuditSchema);
