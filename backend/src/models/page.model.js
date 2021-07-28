import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PagesSchema = new Schema({
    domainId: {type: Schema.Types.ObjectId, ref: 'Domain', index: true},
    url: {
        type: String,
        index: true,
        unique: true,
    },
    status: String,
    errorMessage: String
}, {timestamps: true});

export default mongoose.model('Page', PagesSchema);
