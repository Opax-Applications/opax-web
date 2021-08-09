import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PageAuditSchema = new Schema({
    pageId: {type: Schema.Types.ObjectId, ref: 'Page', index: true, required: true},
    siteId: {type: Schema.Types.ObjectId, ref: 'Site', index: true, required: true},
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

export default mongoose.model('PageAudit', PageAuditSchema);
