import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, IndianRupee } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../store/appStore";
import type { LoanRequest } from "../types";

interface NewLoanRequestProps {
  onNavigate: (page: string) => void;
}

export function NewLoanRequest({ onNavigate }: NewLoanRequestProps) {
  const { currentUser, addLoanRequest } = useApp();
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [duration, setDuration] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    const amt = Number.parseFloat(amount);
    if (!amount || Number.isNaN(amt) || amt <= 0)
      errs.amount = "राशि आवश्यक है / Amount required";
    else if (amt > 100000) errs.amount = "अधिकतम ₹1,00,000 / Max ₹1,00,000";
    if (!purpose.trim()) errs.purpose = "उद्देश्य आवश्यक है / Purpose required";
    const dur = Number.parseInt(duration);
    if (!duration || Number.isNaN(dur) || dur < 1 || dur > 60)
      errs.duration = "1-60 महीने / 1-60 months";
    const ir = Number.parseFloat(interestRate);
    if (!interestRate || Number.isNaN(ir) || ir < 0 || ir > 36)
      errs.interestRate = "0-36% ब्याज / 0-36% interest";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!currentUser) return;

    const req: LoanRequest = {
      id: `req${Date.now()}`,
      borrowerId: currentUser.id,
      amount: Number.parseFloat(amount),
      purpose: purpose.trim(),
      durationMonths: Number.parseInt(duration),
      requestedInterestRate: Number.parseFloat(interestRate),
      createdAt: new Date().toISOString().split("T")[0],
    };
    addLoanRequest(req);
    toast.success("ऋण अनुरोध सफलतापूर्वक जमा हुआ! / Loan request submitted!");
    onNavigate("dashboard");
  };

  const amt = Number.parseFloat(amount) || 0;
  const dur = Number.parseInt(duration) || 0;
  const ir = Number.parseFloat(interestRate) || 0;
  const totalDue = amt + (((amt * ir) / 100) * dur) / 12;
  const monthlyEMI = dur > 0 ? totalDue / dur : 0;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        data-ocid="newloan.link"
      >
        <ArrowLeft className="w-4 h-4" /> वापस जाएं / Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-devanagari flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-primary" />
              नया ऋण अनुरोध / New Loan Request
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              अधिकतम ₹1,00,000 / Maximum ₹1,00,000
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="font-devanagari">
                  ऋण राशि / Loan Amount (₹)
                </Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 50000"
                  max={100000}
                  data-ocid="newloan.input"
                />
                {errors.amount && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="newloan.error_state"
                  >
                    {errors.amount}
                  </p>
                )}
              </div>

              <div>
                <Label className="font-devanagari">ऋण का उद्देश्य / Purpose</Label>
                <Textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="जैसे: व्यापार विस्तार, चिकित्सा खर्च..."
                  rows={3}
                  data-ocid="newloan.textarea"
                />
                {errors.purpose && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="newloan.error_state"
                  >
                    {errors.purpose}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-devanagari">
                    अवधि (महीने) / Duration (Months)
                  </Label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 12"
                    min={1}
                    max={60}
                    data-ocid="newloan.input"
                  />
                  {errors.duration && (
                    <p
                      className="text-destructive text-xs mt-1"
                      data-ocid="newloan.error_state"
                    >
                      {errors.duration}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="font-devanagari">
                    अपेक्षित ब्याज दर (%) / Expected Interest
                  </Label>
                  <Input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="e.g. 10"
                    min={0}
                    max={36}
                    step={0.5}
                    data-ocid="newloan.input"
                  />
                  {errors.interestRate && (
                    <p
                      className="text-destructive text-xs mt-1"
                      data-ocid="newloan.error_state"
                    >
                      {errors.interestRate}
                    </p>
                  )}
                </div>
              </div>

              {/* Preview Calculation */}
              {amt > 0 && dur > 0 && (
                <div className="p-4 bg-secondary rounded-lg space-y-2">
                  <p className="text-sm font-semibold font-devanagari">
                    अनुमानित गणना / Estimated Calculation
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground font-devanagari">
                        कुल देय
                      </p>
                      <p className="font-bold text-primary">
                        ₹{totalDue.toFixed(0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-devanagari">
                        मासिक किस्त
                      </p>
                      <p className="font-bold text-primary">
                        ₹{monthlyEMI.toFixed(0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-devanagari">
                        कुल ब्याज
                      </p>
                      <p className="font-bold text-[oklch(0.55_0.16_50)]">
                        ₹{(totalDue - amt).toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                data-ocid="newloan.submit_button"
              >
                ऋण अनुरोध जमा करें / Submit Loan Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
