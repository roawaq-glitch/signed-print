import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Eraser } from 'lucide-react';

export interface SignaturePadRef {
  clear: () => void;
  getSignature: () => string | null;
  isEmpty: () => boolean;
}

interface SignaturePadProps {
  onSignatureChange?: (hasSignature: boolean) => void;
}

const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  ({ onSignatureChange }, ref) => {
    const signatureRef = useRef<SignatureCanvas>(null);

    useImperativeHandle(ref, () => ({
      clear: () => {
        signatureRef.current?.clear();
        onSignatureChange?.(false);
      },
      getSignature: () => {
        if (signatureRef.current?.isEmpty()) {
          return null;
        }
        // Use getCanvas instead of getTrimmedCanvas to avoid trim-canvas compatibility issues
        return signatureRef.current?.getCanvas().toDataURL('image/png') || null;
      },
      isEmpty: () => signatureRef.current?.isEmpty() ?? true,
    }));

    const handleEnd = () => {
      const isEmpty = signatureRef.current?.isEmpty() ?? true;
      onSignatureChange?.(!isEmpty);
    };

    const handleClear = () => {
      signatureRef.current?.clear();
      onSignatureChange?.(false);
    };

    return (
      <div className="space-y-3">
        <div className="relative">
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              className: 'signature-canvas w-full',
              style: { touchAction: 'none' },
            }}
            backgroundColor="rgb(248, 250, 252)"
            penColor="#1e293b"
            onEnd={handleEnd}
          />
          <div className="absolute bottom-3 left-3 right-3 border-b border-muted-foreground/30 pointer-events-none" />
          <span className="absolute bottom-1 left-3 text-xs text-muted-foreground pointer-events-none">
            Sign above the line
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="gap-2"
        >
          <Eraser className="h-4 w-4" />
          Clear Signature
        </Button>
      </div>
    );
  }
);

SignaturePad.displayName = 'SignaturePad';

export default SignaturePad;
