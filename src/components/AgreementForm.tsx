import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import SignaturePad, { SignaturePadRef } from './SignaturePad';
import AgreementPreview from './AgreementPreview';
import { FileDown, Eye, PenTool, User } from 'lucide-react';

const AgreementForm: React.FC = () => {
  const [name, setName] = useState('');
  const [hasSignature, setHasSignature] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const signaturePadRef = useRef<SignaturePadRef>(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePreview = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (signaturePadRef.current?.isEmpty()) {
      toast.error('Please provide your signature');
      return;
    }

    const signature = signaturePadRef.current?.getSignature();
    setSignatureData(signature);
    setShowPreview(true);
  };

  const generatePDF = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    const signature = signaturePadRef.current?.getSignature();
    if (!signature) {
      toast.error('Please provide your signature');
      return;
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPosition = 30;

    // Header
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128);
    pdf.text('OFFICIAL DOCUMENT', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    pdf.setFontSize(24);
    pdf.setTextColor(30, 41, 59);
    pdf.text('Demo Agreement', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 8;
    pdf.setFontSize(9);
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Document ID: ${Date.now().toString(36).toUpperCase()}`, pageWidth / 2, yPosition, { align: 'center' });

    // Divider
    yPosition += 10;
    pdf.setDrawColor(229, 231, 235);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);

    // Date
    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setTextColor(30, 41, 59);
    pdf.text(`This Agreement is entered into as of ${currentDate}`, margin, yPosition);

    // Party Name Box
    yPosition += 15;
    pdf.setFillColor(241, 245, 249);
    pdf.roundedRect(margin, yPosition, contentWidth, 25, 3, 3, 'F');
    pdf.setFontSize(9);
    pdf.setTextColor(107, 114, 128);
    pdf.text('Party Name', margin + 5, yPosition + 8);
    pdf.setFontSize(14);
    pdf.setTextColor(30, 41, 59);
    pdf.text(name, margin + 5, yPosition + 18);

    // Terms
    yPosition += 35;
    pdf.setFontSize(14);
    pdf.setTextColor(30, 41, 59);
    pdf.text('Terms and Conditions', margin, yPosition);

    yPosition += 8;
    pdf.setFontSize(11);
    const termsIntro = 'By signing this document, the undersigned party acknowledges and agrees to the following terms and conditions of this demonstration agreement:';
    const splitIntro = pdf.splitTextToSize(termsIntro, contentWidth);
    pdf.text(splitIntro, margin, yPosition);

    yPosition += splitIntro.length * 6 + 5;
    const terms = [
      '1. This is a demonstration document for testing purposes only.',
      '2. No legal obligations are created by signing this document.',
      '3. The signature captured is for demonstration purposes.',
      '4. All data will be processed according to applicable privacy policies.',
    ];

    terms.forEach((term) => {
      pdf.text(term, margin + 5, yPosition);
      yPosition += 7;
    });

    // Acknowledgment
    yPosition += 10;
    pdf.setFontSize(14);
    pdf.text('Acknowledgment', margin, yPosition);

    yPosition += 8;
    pdf.setFontSize(11);
    const acknowledgment = `I, ${name}, hereby acknowledge that I have read and understood the terms outlined above.`;
    const splitAck = pdf.splitTextToSize(acknowledgment, contentWidth);
    pdf.text(splitAck, margin, yPosition);

    // Signature Section
    yPosition += 25;
    pdf.setDrawColor(229, 231, 235);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);

    yPosition += 15;
    pdf.setFontSize(9);
    pdf.setTextColor(107, 114, 128);
    pdf.text('Signature', margin, yPosition);
    pdf.text('Date', pageWidth / 2 + 10, yPosition);

    // Add signature image
    yPosition += 5;
    const sigWidth = 70;
    const sigHeight = 30;
    
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(margin, yPosition, sigWidth, sigHeight, 2, 2, 'F');
    pdf.addImage(signature, 'PNG', margin + 5, yPosition + 2, sigWidth - 10, sigHeight - 4);

    // Date box
    pdf.setFillColor(241, 245, 249);
    pdf.roundedRect(pageWidth / 2 + 10, yPosition, 60, sigHeight, 2, 2, 'F');
    pdf.setFontSize(11);
    pdf.setTextColor(30, 41, 59);
    pdf.text(currentDate, pageWidth / 2 + 40, yPosition + 18, { align: 'center' });

    // Name under signature
    yPosition += sigHeight + 5;
    pdf.setDrawColor(156, 163, 175);
    pdf.line(margin, yPosition, margin + sigWidth, yPosition);
    pdf.line(pageWidth / 2 + 10, yPosition, pageWidth / 2 + 70, yPosition);

    yPosition += 5;
    pdf.setFontSize(10);
    pdf.setTextColor(30, 41, 59);
    pdf.text(name, margin, yPosition);
    pdf.text('Date of Signing', pageWidth / 2 + 10, yPosition);

    // Footer
    const footerY = pdf.internal.pageSize.getHeight() - 15;
    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175);
    pdf.text(
      'This document was generated electronically and is valid without a physical signature.',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );

    // Save PDF
    pdf.save(`agreement-${name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    toast.success('Agreement PDF generated successfully!');
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <PenTool className="h-4 w-4" />
            Agreement Generator
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Create Your Agreement
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fill in your details, add your signature, and generate a professional PDF agreement in seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="form-card p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Your Information
            </h2>

            <div className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-base"
                  maxLength={100}
                />
              </div>

              {/* Signature Pad */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Signature <span className="text-destructive">*</span>
                </Label>
                <SignaturePad
                  ref={signaturePadRef}
                  onSignatureChange={setHasSignature}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  disabled={!name.trim() || !hasSignature}
                  className="flex-1 h-12 gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview Agreement
                </Button>
                <Button
                  type="button"
                  onClick={generatePDF}
                  disabled={!name.trim() || !hasSignature}
                  className="flex-1 h-12 gap-2 btn-generate"
                >
                  <FileDown className="h-4 w-4" />
                  Generate PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {showPreview ? (
              <AgreementPreview
                name={name}
                signatureData={signatureData}
                date={currentDate}
              />
            ) : (
              <div className="form-card p-8 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Eye className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Agreement Preview</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Fill in your name and signature, then click "Preview Agreement" to see how your document will look.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementForm;
