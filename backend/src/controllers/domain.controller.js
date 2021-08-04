import { domainReadAllowed } from '../core/permissions';
import DomainModel from '../models/domain.model';
import PageModel from '../models/page.model';

exports.get_domain = async (req, res) => {
  const { domainId } = req.params;
  if (typeof(domainId) != 'string' || !domainId.match(/^[0-9a-fA-F]{24}$/)) {
    res.json({ success: false, error: "Missing or wrong domain id" });
    return;
  }
  try {
    const domain = await DomainModel.findById(domainId).populate({
      path: 'pages',
      select: '-violations',
      options: { sort: { nbViolations: -1, url: 1 } },
    }).lean().exec();
    if (domain == null) {
      res.json({ success: false, error: "Domain not found !" });
      return;
    }
    if (!domainReadAllowed(req.user, domain.name)) {
      res.json({ success: false, error: "You are not allowed to read this domain." });
      return;
    }
    res.json({ success: true, data: domain });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};

exports.get_domains = async (req, res) => {
  try {
    const domains = await DomainModel.find();
    if (domains == null) {
      res.json({ success: false, error: "Domain not found !" });
      return;
    }
    res.json({ success: true, data: domains });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};

exports.get_domain_pages = async (req, res) => {
  const { domainId } = req.params;
  try {
    const domains = await PageModel.find({domainId: domainId});
    if (domains == null) {
      res.json({ success: false, error: "Domain not found !" });
      return;
    }
    res.json({ success: true, data: domains });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};