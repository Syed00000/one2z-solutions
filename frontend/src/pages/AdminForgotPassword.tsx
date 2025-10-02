import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/services/api";

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('📧 Sending OTP to:', email);
      const response = await api.auth.forgotPassword(email);
      
      if (response.success) {
        toast.success("OTP sent successfully!", {
          description: "Check your email for the 4-digit OTP code.",
        });
        setIsOtpDialogOpen(true);
      } else {
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error('❌ Error sending OTP:', error);
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      // Validate OTP
      if (otp.length !== 4) {
        toast.error("OTP must be 4 digits");
        setIsVerifying(false);
        return;
      }

      // Validate new password
      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        setIsVerifying(false);
        return;
      }

      // Validate password confirmation
      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        setIsVerifying(false);
        return;
      }

      console.log('🔑 Verifying OTP and resetting password...');
      const response = await api.auth.verifyOtpAndResetPassword({
        email,
        otp,
        newPassword
      });

      if (response.success) {
        toast.success("Password reset successfully!", {
          description: "You can now login with your new password.",
        });
        setIsOtpDialogOpen(false);
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/admin/login");
        }, 2000);
      } else {
        toast.error(response.message || "Invalid OTP or failed to reset password");
      }
    } catch (error: any) {
      console.error('❌ Error verifying OTP:', error);
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-8 h-8 text-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-tight">One2Z Solutions</span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a 4-digit OTP to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full bg-gradient-accent shadow-accent"
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>

            <div className="text-center mt-4">
              <Link 
                to="/admin/login" 
                className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* OTP Verification Dialog */}
      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle>Verify OTP & Reset Password</DialogTitle>
            <DialogDescription>
              Enter the 4-digit OTP sent to {email}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                required
                placeholder="Enter 4-digit OTP"
                maxLength={4}
                className="text-center text-2xl tracking-widest"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password"
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isVerifying || otp.length !== 4}
            >
              {isVerifying ? "Verifying..." : "Reset Password"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminForgotPassword;
