"use client";
import { useActionState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { loginAction, type LoginState } from "../actions";
import { LogoMark } from "@/components/pulse-line";

export default function Login() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <main className="relative grid min-h-screen place-items-center px-4">
      <Image src="/images/login.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-ink/75" />
      <form action={action} className="glass w-full max-w-md rounded-[2rem] p-8 text-white shadow-2xl">
        <div className="flex items-center gap-3"><LogoMark className="h-10 w-10" /><div><h1 className="text-2xl font-semibold">Staff sign in</h1><p className="text-white/70">Senior Care admin</p></div></div>
        {state.error && <p role="alert" className="mt-5 rounded-xl bg-orange-500/20 p-3 font-semibold text-orange-100">{state.error}</p>}
        <label htmlFor="email" className="mt-6 block font-semibold">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="field mt-1.5 !bg-white/95" />
        <label htmlFor="password" className="mt-4 block font-semibold">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="field mt-1.5 !bg-white/95" />
        <button disabled={pending} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-pulse px-6 py-3.5 text-lg font-semibold text-ink disabled:opacity-60">
          {pending && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />} Sign in
        </button>
      </form>
    </main>
  );
}
