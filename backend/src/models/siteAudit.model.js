import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SiteAuditSchema = new Schema({
    firstURL: String,
    standard: String,
    checkSubdomains: Boolean,
    maxDepth: Number,
    maxPagesPerDomain: Number,
    sitemaps: Boolean,
    includeMatch: String,
    browser: String,
    postLoadingDelay: Number,
    dateStarted: Date,
    dateEnded: Date,
    nbCheckedURLs: Number,
    nbViolations: Number,
    nbScanErrors: Number,
    initialDomainName: String,
    violationStats: { // the key is the violation id
        type: Map,
        of: {
            description: String,
            descLink: String,
            impact: String,
            total: Number,
            domains: [{
                id: { type: Schema.Types.ObjectId, ref: 'Domain' },
                count: Number,
            }],
        },
        default: {},
    },
    categories: { // the key is the category name, the value is the count
        type: Map,
        of: Number,
        default: {},
    },
    complete: Boolean,
}, { timestamps: true });

SiteAuditSchema.virtual('domains', {
    ref: 'Domain',
    localField: '_id',
    foreignField: 'auditId'
});

SiteAuditSchema.set('toObject', { virtuals: true });
SiteAuditSchema.set('toJSON', { virtuals: true });

export default mongoose.model('SiteAudit', SiteAuditSchema);
