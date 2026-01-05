import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebLayout from '@/components/layout/WebLayout';

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
    <WebLayout className="py-8 md:py-16">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => step === 'otp' ? setStep('phone') : navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Login Card */}
        <div className="bg-card rounded-2xl shadow-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
              <Phone className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-2">
              {step === 'phone' ? 'Welcome to Zeeroni' : 'Verify Your Number'}
            </h1>
            <p className="text-muted-foreground">
              {step === 'phone' 
                ? 'Enter your phone number to get started' 
                : `Enter the 6-digit code sent to +91 ${phone}`
              }
            </p>
          </div>

          {step === 'phone' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <div className="flex gap-3">
                  <div className="w-20 h-12 bg-muted rounded-lg flex items-center justify-center border border-border text-foreground font-medium flex-shrink-0">
                    +91
                  </div>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 h-12 text-lg bg-background border-border"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSendOTP}
                disabled={phone.length < 10}
                className="w-full h-12 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Send OTP
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12">
                  <Mail className="w-5 h-5 mr-2" />
                  Email
                </Button>
                <Button variant="outline" className="h-12">
                  <Lock className="w-5 h-5 mr-2" />
                  Google
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Verification Code
                </label>
                <div className="flex gap-2">
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
                      className="flex-1 h-12 text-center text-xl font-semibold bg-background border-border"
                    />
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleVerify}
                disabled={otp.length < 6}
                className="w-full h-12 text-lg font-semibold gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Verify & Continue
              </Button>

              <button className="w-full text-center text-primary font-medium text-sm hover:underline">
                Resend code in 30s
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </p>
      </div>
    </WebLayout>
  );
};

export default Login;
