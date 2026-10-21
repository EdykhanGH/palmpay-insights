import { ChevronRight, Delete, Fingerprint } from "lucide-react";
import { useState } from "react";
import { ACCOUNTS, DEMO_PIN, maskPhone } from "../lib/accounts";

// The account shown as a saved login on this device.
const SAVED = ACCOUNTS[0];

export default function Login({ onLogin }: { onLogin: (personaId: string) => void }) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [step, setStep] = useState<"phone" | "pin">("phone");
  const [error, setError] = useState<string | null>(null);

  const account = ACCOUNTS.find((a) => a.phone === phone);

  function next() {
    if (!/^0\d{10}$/.test(phone)) return setError("Enter your 11-digit phone number, e.g. 08012345678");
    if (!account) return setError("No PalmPay account found with this number.");
    setError(null);
    setStep("pin");
  }

  function press(d: string) {
    setError(null);
    if (d === "del") return setPin((p) => p.slice(0, -1));
    const p = (pin + d).slice(0, 6);
    setPin(p);
    if (p.length === 6) {
      if (p === DEMO_PIN && account) setTimeout(() => onLogin(account.personaId), 150);
      else setTimeout(() => {
        setPin("");
        setError("Wrong PIN. Please try again.");
      }, 200);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white">
      <div className="rounded-b-[36px] bg-linear-to-br from-pp to-pp-dark px-6 pb-10 pt-12 text-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl font-black text-pp">P</div>
        <h1 className="mt-5 text-2xl font-extrabold">{step === "phone" ? "Welcome back" : `Hi ${account?.fullName.split(" ")[0]} 👋`}</h1>
        <p className="mt-1 text-sm opacity-85">
          {step === "phone" ? "Log in to your PalmPay account" : "Enter your 6-digit login PIN"}
        </p>
      </div>

      <div className="flex-1 px-6 pt-8">
        {step === "phone" ? (
          <>
            <label className="text-sm font-semibold text-muted">Phone number</label>
            <div className="mt-2 flex items-center rounded-xl border-2 border-pp/15 focus-within:border-pp">
              <span className="whitespace-nowrap border-r border-pp/15 px-3 py-3 text-sm font-semibold">🇳🇬 +234</span>
              <input
                inputMode="numeric"
                autoFocus
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                onKeyDown={(e) => e.key === "Enter" && next()}
                placeholder="080 1234 5678"
                className="w-full bg-transparent px-3 py-3 text-lg font-semibold tracking-wide outline-none"
              />
            </div>
            {error && <p className="mt-2 text-sm text-bad">{error}</p>}
            <button onClick={next} className="mt-6 w-full rounded-full bg-pp py-3.5 font-bold text-white hover:bg-pp-dark">
              Continue
            </button>

            <button
              onClick={() => {
                setPhone(SAVED.phone);
                setError(null);
                setStep("pin");
              }}
              className="mt-8 flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-card"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pp text-lg font-extrabold text-white">{SAVED.fullName[0]}</span>
              <span className="flex-1">
                <span className="block font-bold">{SAVED.fullName}</span>
                <span className="block text-sm text-muted">{maskPhone(SAVED.phone)}</span>
              </span>
              <ChevronRight className="text-pp" />
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-center gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`h-4 w-4 rounded-full ${i < pin.length ? "bg-pp" : "bg-pp/15"}`} />
              ))}
            </div>
            <p className="mt-3 h-5 text-center text-sm text-bad">{error}</p>
            <div className="mx-auto mt-4 grid max-w-xs grid-cols-3 gap-3">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "bio", "0", "del"].map((k) => (
                <button
                  key={k}
                  onClick={() => (k === "bio" ? setError("Fingerprint isn't set up on this device. Please use your PIN.") : press(k))}
                  className="flex h-16 items-center justify-center rounded-2xl text-2xl font-bold hover:bg-pp-soft active:bg-pp-soft"
                  aria-label={k === "del" ? "Delete" : k === "bio" ? "Fingerprint" : k}
                >
                  {k === "del" ? <Delete /> : k === "bio" ? <Fingerprint className="text-pp" /> : k}
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-sm font-semibold">
              <button onClick={() => { setStep("phone"); setPin(""); setError(null); }} className="text-muted">
                ← Change number
              </button>
              <span className="text-pp">Forgot PIN?</span>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
