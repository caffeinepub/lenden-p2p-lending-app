import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, BadgeIndianRupee, Wallet } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../store/appStore";
import { type WithdrawalRecord, formatCurrency } from "../types";

interface AdminWithdrawalProps {
  onNavigate: (page: string) => void;
}

export function AdminWithdrawal({ onNavigate }: AdminWithdrawalProps) {
  const { currentUser, totalAdminEarnings, withdrawals, addWithdrawal } =
    useApp();

  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("barkat.6y@ptyes");
  const [note, setNote] = useState("");

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <main className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-destructive font-semibold">Access Denied</p>
      </main>
    );
  }

  const totalWithdrawn = withdrawals.reduce((s, w) => s + w.amount, 0);
  const availableBalance = Math.max(0, totalAdminEarnings - totalWithdrawn);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (amt > availableBalance) {
      toast.error(
        `Cannot withdraw more than available balance ${formatCurrency(availableBalance)}`,
      );
      return;
    }
    if (!upiId.trim()) {
      toast.error("UPI ID is required");
      return;
    }
    const record: WithdrawalRecord = {
      id: `wd_${Date.now()}`,
      amount: amt,
      upiId: upiId.trim(),
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      note: note.trim(),
    };
    addWithdrawal(record);
    toast.success(`Withdrawal request of ${formatCurrency(amt)} submitted!`);
    setAmount("");
    setNote("");
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        data-ocid="withdrawal.link"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wallet className="w-6 h-6 text-primary" />
          Admin Withdrawal
        </h1>
        <p className="text-muted-foreground mt-1">
          Request a withdrawal of your platform earnings
        </p>
      </motion.div>

      {/* Balance Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="border-primary/40 bg-primary/5 col-span-1 sm:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <BadgeIndianRupee className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Available Balance
                </p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(availableBalance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Total Earned</p>
            <p className="text-xl font-bold">
              {formatCurrency(totalAdminEarnings)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Total Withdrawn</p>
            <p className="text-xl font-bold">
              {formatCurrency(totalWithdrawn)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Form */}
      <Card className="border-border mb-8">
        <CardHeader>
          <CardTitle className="text-base">Request Withdrawal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWithdraw} className="space-y-5">
            <div>
              <Label htmlFor="wd-amount">Withdrawal Amount (₹)</Label>
              <Input
                id="wd-amount"
                type="number"
                min={1}
                max={availableBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Max: ₹${availableBalance.toLocaleString("en-IN")}`}
                data-ocid="withdrawal.input"
              />
            </div>
            <div>
              <Label htmlFor="wd-upi">UPI ID</Label>
              <Input
                id="wd-upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. name@upi"
                data-ocid="withdrawal.input"
              />
            </div>
            <div>
              <Label htmlFor="wd-note">Note (optional)</Label>
              <Textarea
                id="wd-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any note for this withdrawal..."
                rows={2}
                data-ocid="withdrawal.textarea"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={availableBalance <= 0}
              data-ocid="withdrawal.submit_button"
            >
              Request Withdrawal
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Withdrawal History */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table data-ocid="withdrawal.table">
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Amount</TableHead>
                <TableHead className="text-xs">UPI ID</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                    data-ocid="withdrawal.empty_state"
                  >
                    No withdrawals yet
                  </TableCell>
                </TableRow>
              ) : (
                [...withdrawals]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((w, idx) => (
                    <TableRow
                      key={w.id}
                      data-ocid={`withdrawal.row.${idx + 1}`}
                    >
                      <TableCell className="text-xs">{w.date}</TableCell>
                      <TableCell className="text-xs font-bold text-primary">
                        {formatCurrency(w.amount)}
                      </TableCell>
                      <TableCell className="text-xs">{w.upiId}</TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            w.status === "completed"
                              ? "bg-[oklch(0.94_0.05_158)] text-[oklch(0.38_0.09_158)]"
                              : "bg-[oklch(0.96_0.06_85)] text-[oklch(0.55_0.16_85)]"
                          }`}
                        >
                          {w.status === "completed" ? "Completed" : "Pending"}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {w.note || "—"}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
