import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background p-4">
        <div className="mx-auto grid w-[380px] gap-8">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-2 font-semibold text-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary"><path d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"></path><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path></svg>
              <h1 className="font-bold">BankDash</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
          <LoginForm />
        </div>
    </div>
  );
}
