import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { createAccount, findByPhone, PROFILES } from "../lib/accounts";

export default function SignUp({ onCreated, onBack }: { onCreated: (id: string) => void; onBack: () => void }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [personaId, setPersonaId] = useState(PROFILES[0].personaId);
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (fullName.trim().split(/\s+/).length < 2) return setError("Enter your first and last name.");
    if (!/^0\d{10}$/.test(phone)) return setError("Enter an 11-digit phone number, e.g. 08012345678.");
    if (findByPhone(phone)) return setError("An account with this number already exists. Go back and log in.");
    if (!/^\d{6}$/.test(pin)) return setError("Your PIN must be 6 digits.");
    if (pin !== confirm) return setError("The two PINs don’t match.");
    const account = createAccount({ fullName, phone, pin, personaId });
    onCreated(account.id);
  }

  const field = "w-full rounded-xl border-2 border-pp/15 bg-transparent px-3 py-3 text-base font-semibold outline-none focus:border-pp";

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white">
      <div className="rounded-b-[36px] bg-linear-to-br from-pp to-pp-dark px-6 pb-10 pt-8 text-white">
        <button onClick={onBack} className="rounded-full bg-white/15 p-2" aria-label="Back to log in">
          <ArrowLeft size={18} />
        </button>
        <h1 className="mt-5 text-2xl font-extrabold">Create your account</h1>
        <p className="mt-1 text-sm opacity-85">It takes less than a minute.</p>
      </div>

      <form
        className="flex-1 space-y-4 px-6 pb-10 pt-6"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div>
          <label className="text-sm font-semibold text-muted" htmlFor="su-name">Full name</label>
          <input id="su-name" className={`mt-1.5 ${field}`} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Ada Okafor" autoComplete="name" />
        </div>

        <div>
          <label className="text-sm font-semibold text-muted" htmlFor="su-phone">Phone number</label>
          <div className="mt-1.5 flex items-center rounded-xl border-2 border-pp/15 focus-within:border-pp">
            <span className="whitespace-nowrap border-r border-pp/15 px-3 py-3 text-sm font-semibold">🇳🇬 +234</span>
            <input
              id="su-phone"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
              placeholder="080 1234 5678"
              className="w-full bg-transparent px-3 py-3 text-base font-semibold tracking-wide outline-none"
            />
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-muted">How do you mostly use your money?</div>
          <div className="mt-1.5 space-y-2">
            {PROFILES.map((p) => (
              <button
                type="button"
                key={p.personaId}
                onClick={() => setPersonaId(p.personaId)}
                className={`flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left ${
                  personaId === p.personaId ? "border-pp bg-pp-soft" : "border-pp/15"
                }`}
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full ${personaId === p.personaId ? "bg-pp text-white" : "border-2 border-pp/30"}`}>
                  {personaId === p.personaId && <Check size={12} />}
                </span>
                <span>
                  <span className="block text-sm font-bold">{p.label}</span>
                  <span className="block text-xs text-muted">{p.detail}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-muted" htmlFor="su-pin">6-digit PIN</label>
            <input
              id="su-pin"
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              className={`mt-1.5 tracking-[0.4em] ${field}`}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-muted" htmlFor="su-confirm">Confirm PIN</label>
            <input
              id="su-confirm"
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              className={`mt-1.5 tracking-[0.4em] ${field}`}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••••"
            />
          </div>
        </div>

        {error && <p className="text-sm text-bad">{error}</p>}

        <button type="submit" className="w-full rounded-full bg-pp py-3.5 font-bold text-white hover:bg-pp-dark">
          Create account
        </button>
        <p className="text-center text-xs text-muted">Your account is saved on this device.</p>
      </form>
    </div>
  );
}
