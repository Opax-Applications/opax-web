import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PagesSchema = new Schema({
  auditId: {type: Schema.Types.ObjectId, ref: 'Audit', index: true},
  url: String,
  status: String,
  errorMessage: String,
  nbViolations: Number,
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
}, {timestamps: true});

export default mongoose.model('Page', PagesSchema);
