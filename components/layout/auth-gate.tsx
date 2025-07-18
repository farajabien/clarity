"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuthContext } from "@/lib/auth-context";
import { Loader2, Mail, Shield } from "lucide-react";

export function AuthGate() {
  const { user, isLoading, signInWithOTP, verifyOTP, signOut } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setSending(true);
    setError(null);

    try {
      await signInWithOTP(email);
      setStep("code");
    } catch {
      setError("Failed to send magic code. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      setError("Please enter the verification code");
      return;
    }

    setSending(true);
    setError(null);

    try {
      await verifyOTP(email, code);
      setOpen(false);
      setStep("email");
      setEmail("");
      setCode("");
    } catch  {
      setError("Invalid code. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };
  
  const resetForm = () => {
    setStep("email");
    setEmail("");
    setCode("");
    setError(null);
  };

  // If user is authenticated, show sign out option
  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {user.email}
        </span>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    );
  }

  // If loading, show loading state
  if (isLoading) {
    return (
      <Button disabled variant="outline" size="sm">
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Shield className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {step === "email" ? "Sign In to Clarity" : "Enter Verification Code"}
          </DialogTitle>
          <DialogDescription>
            {step === "email" 
              ? "Enter your email to receive a magic link" 
              : `We sent a verification code to ${email}`
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {step === "email" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                  disabled={sending}
                />
              </div>
              <Button 
                onClick={handleSendCode} 
                disabled={sending || !email}
                className="w-full"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending Code...
                  </>
                ) : (
                  "Send Magic Code"
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
                  disabled={sending}
                  maxLength={6}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep("email")}
                  disabled={sending}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleVerifyCode} 
                  disabled={sending || !code}
                  className="flex-1"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
              </div>
            </>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AuthGate; 