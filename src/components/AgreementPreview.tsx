import React from 'react';
import { FileText } from 'lucide-react';

interface AgreementPreviewProps {
  name: string;
  signatureData: string | null;
  date: string;
}

const AgreementPreview: React.FC<AgreementPreviewProps> = ({
  name,
  signatureData,
  date,
}) => {
  return (
    <div className="document-paper p-8 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-border">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Official Document
          </span>
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Demo Agreement
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Document ID: {Date.now().toString(36).toUpperCase()}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6 text-foreground leading-relaxed">
        <p className="text-lg">
          This Agreement is entered into as of{' '}
          <span className="font-semibold text-primary">{date}</span>
        </p>

        <div className="bg-secondary/50 rounded-lg p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Party Name</p>
          <p className="text-xl font-semibold">
            {name || <span className="text-muted-foreground italic">Not provided</span>}
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-display font-semibold">Terms and Conditions</h2>
          <p>
            By signing this document, the undersigned party acknowledges and agrees to the
            following terms and conditions of this demonstration agreement:
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-4">
            <li>This is a demonstration document for testing purposes only.</li>
            <li>No legal obligations are created by signing this document.</li>
            <li>The signature captured is for demonstration purposes.</li>
            <li>All data will be processed according to applicable privacy policies.</li>
          </ol>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-display font-semibold">Acknowledgment</h2>
          <p>
            I, <span className="font-semibold">{name || '[Name]'}</span>, hereby acknowledge
            that I have read and understood the terms outlined above.
          </p>
        </div>
      </div>

      {/* Signature Section */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-muted-foreground mb-3">Signature</p>
            <div className="h-24 bg-signature-bg rounded-lg border border-border flex items-center justify-center overflow-hidden">
              {signatureData ? (
                <img
                  src={signatureData}
                  alt="Signature"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-muted-foreground italic text-sm">
                  No signature provided
                </span>
              )}
            </div>
            <div className="mt-2 pt-2 border-t border-muted-foreground/30">
              <p className="text-sm font-medium">{name || 'Signatory Name'}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-3">Date</p>
            <div className="h-24 bg-secondary/30 rounded-lg border border-border flex items-center justify-center">
              <span className="text-lg font-medium">{date}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-muted-foreground/30">
              <p className="text-sm font-medium">Date of Signing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          This document was generated electronically and is valid without a physical signature.
        </p>
      </div>
    </div>
  );
};

export default AgreementPreview;
