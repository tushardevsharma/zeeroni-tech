import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PhoneFrame from '@/components/PhoneFrame';

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const handleSendOTP = () => {
    if (phone.length >= 10) {
      setStep('otp');
    }
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      navigate('/address');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <PhoneFrame>
        <div className="h-full flex flex-col pt-14 pb-10 px-7">
          {/* Header */}
          <button 
            onClick={() => step === 'otp' ? setStep('phone') : navigate('/')}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center mb-10 shadow-card"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex-1">
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mb-8 shadow-soft">
              <Phone className="w-7 h-7 text-primary-foreground" />
            </div>

            {step === 'phone' ? (
              <>
                <h1 className="text-3xl font-bold font-display text-foreground mb-4">
                  Enter your phone
                </h1>
                <p className="text-muted-foreground mb-10">
                  We'll send you a 6-digit code to verify your number
                </p>

                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="w-20 h-14 bg-card rounded-xl flex items-center justify-center border border-border text-foreground font-medium">
                      +91
                    </div>
                    <Input
                      type="tel"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="flex-1 h-14 text-lg bg-card border-border"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold font-display text-foreground mb-4">
                  Verify OTP
                </h1>
                <p className="text-muted-foreground mb-10">
                  Enter the code sent to +91 {phone}
                </p>

                <div className="flex gap-3 mb-6">
                  {[...Array(6)].map((_, i) => (
                    <Input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={otp[i] || ''}
                      onChange={(e) => {
                        const newOtp = otp.split('');
                        newOtp[i] = e.target.value;
                        setOtp(newOtp.join(''));
                        if (e.target.value && e.target.nextElementSibling) {
                          (e.target.nextElementSibling as HTMLInputElement).focus();
                        }
                      }}
                      className="w-12 h-14 text-center text-xl font-semibold bg-card border-border"
                    />
                  ))}
                </div>

                <button className="text-primary font-medium text-sm">
                  Resend code in 30s
                </button>
              </>
            )}
          </div>

          <Button 
            onClick={step === 'phone' ? handleSendOTP : handleVerify}
            disabled={step === 'phone' ? phone.length < 10 : otp.length < 6}
            className="w-full h-14 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {step === 'phone' ? 'Send OTP' : 'Verify'}
          </Button>
        </div>
      </PhoneFrame>
    </div>
  );
};

export default Login;
