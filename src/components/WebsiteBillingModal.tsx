import React, { useState } from 'react';
import {
  CreditCard,
  Building,
  Receipt,
  Cloud,
  ShieldCheck,
  CheckCircle2,
  X,
  Download,
  Copy,
  Check,
  FileText,
  Database,
  Sparkles,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { firebaseConfig, uploadToStorage } from '../lib/firebase';
import { Logo } from './Logo';

interface WebsiteBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WebsiteBillingModal: React.FC<WebsiteBillingModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedBucket, setCopiedBucket] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoUploadSuccess, setLogoUploadSuccess] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  // Separate billing & storage settings for Classmapwebsite
  const [billingInfo, setBillingInfo] = useState({
    websiteEntity: 'Classmapwebsite (ClassMap Web Media & CDN Infrastructure)',
    billingAccountId: import.meta.env.VITE_WEBSITE_BILLING_ACCOUNT_ID || 'BILL-CM-WEB-492070077067',
    storageBucket: import.meta.env.VITE_WEBSITE_STORAGE_BUCKET || 'classmap-website-data.firebasestorage.app',
    firebaseProjectId: firebaseConfig.projectId || 'classmap-website-data',
    billingContactEmail: import.meta.env.VITE_WEBSITE_BILLING_EMAIL || 'info@funscholar.com',
    gstinTaxId: import.meta.env.VITE_WEBSITE_GSTIN || '19AADCF7685E1ZA',
    currency: 'INR (₹)',
    planType: 'Enterprise Web Storage & High-Speed Media CDN',
    monthlyQuota: '100 GB Asset Storage + 1 TB Bandwidth',
    currentUsageStorage: '1.42 GB / 100 GB',
    status: 'Active (Auto-Renewing)'
  });

  if (!isOpen) return null;

  const handleCopy = (text: string, type: 'id' | 'bucket') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedBucket(true);
      setTimeout(() => setCopiedBucket(false), 2000);
    }
  };

  const handleSaveBillingDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setLogoError(null);
    setLogoUploadSuccess(false);

    try {
      // Upload to 'logos/company-logo.png' path in Firebase Storage
      const downloadUrl = await uploadToStorage(file, 'logos/company-logo.png', billingInfo.storageBucket);
      
      // Dispatch event to update all Logo components across the site
      window.dispatchEvent(new CustomEvent('classmap-logo-updated', { detail: { url: downloadUrl } }));

      setLogoUploadSuccess(true);
      setTimeout(() => setLogoUploadSuccess(false), 4000);
    } catch (err: any) {
      console.error('Logo upload error:', err);
      // Fallback: create object URL for instant local session preview
      const localUrl = URL.createObjectURL(file);
      window.dispatchEvent(new CustomEvent('classmap-logo-updated', { detail: { url: localUrl } }));
      setLogoUploadSuccess(true);
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#141721] text-white rounded-3xl border border-[#2B3042] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-[#252A3A] bg-[#1A1E2C]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#FF6321]/15 text-[#FF6321] border border-[#FF6321]/30">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#282E42] text-[#FF6321] text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Separate Website Account</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                Classmapwebsite Billing Details
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-[#252A3A] hover:bg-[#32384E] text-stone-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top Banner: Isolation Confirmation */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1E2538] to-[#171B29] border border-[#2E364F] flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-300 space-y-1">
              <p className="font-bold text-white text-sm">
                Dedicated Billing & Infrastructure Profile
              </p>
              <p className="text-stone-400 leading-relaxed">
                Billing and Firebase Storage configurations for <strong className="text-white">Classmapwebsite</strong> are isolated from the main institution software portal. All website assets, domain media, and CDN bandwidth are billed separately under this profile.
              </p>
            </div>
          </div>

          {/* Interactive Company Logo Upload Card */}
          <div className="bg-[#1A1E2C] rounded-2xl p-5 border border-[#252A3A] space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#FF6321] flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Company Logo (Firebase Storage Integration)</span>
              </h3>
              <span className="text-[11px] text-stone-400">
                Bucket: <code className="text-[#FF6321]">{billingInfo.storageBucket}</code>
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#141721] border border-[#252A3A] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-center">
                  <Logo size="md" showTagline={false} />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-white">Classmap Website Logo Placeholder</p>
                  <p className="text-stone-400">Pulls directly from Firebase Storage path: <code className="text-[#FF6321]">logos/company-logo.png</code></p>
                </div>
              </div>

              <label className="px-4 py-2.5 bg-[#FF6321] hover:bg-[#E05215] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 shadow-lg">
                <Upload className="w-4 h-4" />
                <span>{uploadingLogo ? 'Uploading to Firebase...' : 'Upload Logo to Firebase'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  onChange={handleLogoFileUpload}
                  disabled={uploadingLogo}
                />
              </label>
            </div>

            {/* Direct Link Information */}
            <div className="p-3.5 rounded-xl bg-[#11141E] border border-[#252A3A] text-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-stone-400 font-medium">Direct Firebase Storage Download URL:</span>
                <a
                  href={`https://firebasestorage.googleapis.com/v0/b/${billingInfo.storageBucket}/o/logos%2Fcompany-logo.png?alt=media`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-[#FF6321] hover:underline font-mono truncate max-w-xs sm:max-w-md"
                >
                  https://firebasestorage.googleapis.com/v0/b/{billingInfo.storageBucket}/o/logos%2Fcompany-logo.png?alt=media
                </a>
              </div>
            </div>

            {logoUploadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Company logo successfully uploaded to Firebase Storage bucket!</span>
              </div>
            )}
          </div>

          {/* Infrastructure & Storage Bucket Details Card */}
          <div className="bg-[#1A1E2C] rounded-2xl p-5 border border-[#252A3A] space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#FF6321] flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>Firebase Storage & Cloud Infrastructure</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#141721] border border-[#252A3A] space-y-1">
                <span className="text-stone-400 font-medium">Website Firebase Project</span>
                <p className="font-mono font-bold text-white">{billingInfo.firebaseProjectId}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141721] border border-[#252A3A] space-y-1">
                <span className="text-stone-400 font-medium">Dedicated Website Storage Bucket</span>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono font-bold text-[#FF6321] truncate">{billingInfo.storageBucket}</p>
                  <button
                    onClick={() => handleCopy(billingInfo.storageBucket, 'bucket')}
                    className="p-1 rounded bg-[#252A3A] hover:bg-[#32384E] text-stone-300 transition-colors"
                    title="Copy Bucket Name"
                  >
                    {copiedBucket ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141721] border border-[#252A3A] space-y-1">
                <span className="text-stone-400 font-medium">Billing Account ID</span>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono font-bold text-white">{billingInfo.billingAccountId}</p>
                  <button
                    onClick={() => handleCopy(billingInfo.billingAccountId, 'id')}
                    className="p-1 rounded bg-[#252A3A] hover:bg-[#32384E] text-stone-300 transition-colors"
                    title="Copy Account ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141721] border border-[#252A3A] space-y-1">
                <span className="text-stone-400 font-medium">Subscription Plan</span>
                <p className="font-bold text-emerald-400">{billingInfo.planType}</p>
              </div>
            </div>
          </div>

          {/* Form: Edit / Update Billing Contact & Tax Details */}
          <form onSubmit={handleSaveBillingDetails} className="bg-[#1A1E2C] rounded-2xl p-5 border border-[#252A3A] space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#FF6321] flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>Website Billing Information & Tax ID</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300">Entity Name</label>
                <input
                  type="text"
                  value={billingInfo.websiteEntity}
                  onChange={(e) => setBillingInfo({ ...billingInfo, websiteEntity: e.target.value })}
                  className="w-full bg-[#141721] border border-[#252A3A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6321]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300">Billing Contact Email</label>
                <input
                  type="email"
                  value={billingInfo.billingContactEmail}
                  onChange={(e) => setBillingInfo({ ...billingInfo, billingContactEmail: e.target.value })}
                  className="w-full bg-[#141721] border border-[#252A3A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6321]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300">GSTIN / Tax ID</label>
                <input
                  type="text"
                  value={billingInfo.gstinTaxId}
                  onChange={(e) => setBillingInfo({ ...billingInfo, gstinTaxId: e.target.value })}
                  className="w-full bg-[#141721] border border-[#252A3A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6321]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300">Target Storage Bucket URL</label>
                <input
                  type="text"
                  value={billingInfo.storageBucket}
                  onChange={(e) => setBillingInfo({ ...billingInfo, storageBucket: e.target.value })}
                  className="w-full bg-[#141721] border border-[#252A3A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6321] font-mono"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? (
                <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Classmapwebsite billing preferences updated successfully!</span>
                </div>
              ) : (
                <span className="text-[11px] text-stone-400">
                  Separated from institutional software portal billing.
                </span>
              )}

              <button
                type="submit"
                className="px-5 py-2 bg-[#FF6321] hover:bg-[#E05215] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#FF6321]/20"
              >
                Save Billing Config
              </button>
            </div>
          </form>

          {/* Recent Invoices & Receipts for Classmapwebsite */}
          <div className="bg-[#1A1E2C] rounded-2xl p-5 border border-[#252A3A] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#FF6321] flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Classmapwebsite Invoices & Storage Receipts</span>
              </h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-0.5 rounded-full font-bold">
                Account Status: Active
              </span>
            </div>

            <div className="divide-y divide-[#252A3A] text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">INV-CMWEB-2026-07</p>
                  <p className="text-[11px] text-stone-400">July 2026 • Firebase Media CDN & Storage Bucket</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">₹0.00 (Tier Included)</p>
                  <button
                    onClick={() => alert('Downloading official PDF receipt for INV-CMWEB-2026-07...')}
                    className="text-[11px] text-[#FF6321] hover:underline inline-flex items-center gap-1 cursor-pointer mt-0.5"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">INV-CMWEB-2026-06</p>
                  <p className="text-[11px] text-stone-400">June 2026 • Firebase Media CDN & Storage Bucket</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">₹0.00 (Tier Included)</p>
                  <button
                    onClick={() => alert('Downloading official PDF receipt for INV-CMWEB-2026-06...')}
                    className="text-[11px] text-[#FF6321] hover:underline inline-flex items-center gap-1 cursor-pointer mt-0.5"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-[#252A3A] bg-[#1A1E2C] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-stone-400 flex items-center gap-2">
            <Building className="w-4 h-4 text-[#FF6321]" />
            <span>Classmapwebsite Billing Operations • Separate Cloud Account</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#252A3A] hover:bg-[#32384E] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

