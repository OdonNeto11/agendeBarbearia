import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

const registerSchema = loginSchema.extend({
  fullName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  phone: z.string().min(15, 'Telefone inválido').max(15, 'Telefone inválido'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

interface AlertProps {
  type: 'success' | 'error';
  message: string;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp } = useAuth();
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d)(\d{4})$/, '$1-$2');
      registerForm.setValue('phone', value);
    }
  };

  const handleLogin = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
      if (onAuthSuccess) {
        onAuthSuccess();
      }
      onClose();
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: 'Email ou senha inválidos'
      });
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await signUp(data.email, data.password, data.fullName, data.phone);
      setShowSuccess(true);
      registerForm.reset();
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (error: any) {
      if (error.message.includes('already registered')) {
        setAlert({
          type: 'error',
          message: 'Este email já está cadastrado'
        });
      } else {
        setAlert({
          type: 'error',
          message: 'Erro ao criar conta. Tente novamente.'
        });
      }
    }
  };

  const handleResetPassword = async () => {
    const email = loginForm.getValues('email');
    if (!email) {
      setAlert({
        type: 'error',
        message: 'Digite seu email para recuperar a senha'
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setAlert({
        type: 'success',
        message: 'Email de recuperação enviado. Verifique sua caixa de entrada.'
      });
      setIsResettingPassword(false);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Erro ao enviar email de recuperação. Tente novamente.'
      });
    }
  };

  const handleSwitchToRegister = () => {
    const currentEmail = loginForm.getValues('email');
    setIsLogin(false);
    setAlert(null);
    registerForm.reset();
    if (currentEmail) {
      registerForm.setValue('email', currentEmail);
    }
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[100]">
        <div className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 z-[101]">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              ref={modalRef}
              className="relative bg-zinc-900 p-8 rounded-lg w-full max-w-md mx-auto shadow-xl text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Cadastro Realizado!</h2>
              <p className="text-gray-300">
                Sua conta foi criada com sucesso.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 z-[101]">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            ref={modalRef}
            className="relative bg-zinc-900 p-6 rounded-lg w-full max-w-md mx-auto shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {isResettingPassword ? 'Recuperar Senha' : isLogin ? 'Login' : 'Criar Conta'}
            </h2>

            {alert && (
              <div className={`mb-6 px-4 py-3 rounded flex items-center gap-2 ${
                alert.type === 'success' 
                  ? 'bg-green-500/10 border border-green-500 text-green-500'
                  : 'bg-red-500/10 border border-red-500 text-red-500'
              }`}>
                {alert.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                {alert.message}
              </div>
            )}

            {isResettingPassword ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    {...loginForm.register('email')}
                    className="w-full bg-zinc-800 rounded-md px-4 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsResettingPassword(false)}
                    className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="flex-1 bg-amber-500 text-black font-semibold py-2 rounded-md hover:bg-amber-600 transition-colors"
                  >
                    Enviar Email
                  </button>
                </div>
              </div>
            ) : isLogin ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    {...loginForm.register('email')}
                    className="w-full bg-zinc-800 rounded-md px-4 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                  {loginForm.formState.errors.email && (
                    <span className="text-red-500 text-sm">{loginForm.formState.errors.email.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Senha</label>
                  <input
                    type="password"
                    {...loginForm.register('password')}
                    className="w-full bg-zinc-800 rounded-md px-4 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                  {loginForm.formState.errors.password && (
                    <span className="text-red-500 text-sm">{loginForm.formState.errors.password.message}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsResettingPassword(true)}
                  className="text-amber-500 hover:text-amber-400 text-sm"
                >
                  Esqueci minha senha
                </button>

                <button
                  type="submit"
                  className="w-full bg-amber-500 text-black font-semibold py-2 rounded-md hover:bg-amber-600 transition-colors"
                >
                  Entrar
                </button>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome Completo</label>
                  <input
                    type="text"
                    {...registerForm.register('fullName')}
                    className="w-full bg-zinc-800 rounded-md px-4 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                  {registerForm.formState.errors.fullName && (
                    <span className="text-red-500 text-sm">{registerForm.formState.errors.fullName.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    {...registerForm.register('email')}
                    className="w-full bg-zinc-800 rounded-md px-4 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                  {registerForm.formState.errors.email && (
                    <span className="text-red-500 text-sm">{registerForm.formState.errors.email.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Telefone</label>
                  <input
                    type="tel"
                    {...registerForm.register('phone')}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    className="w-full bg-zinc-800 rounded-md px-4 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                  {registerForm.formState.errors.phone && (
                    <span className="text-red-500 text-sm">{registerForm.formState.errors.phone.message}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Senha</label>
                  <input
                    type="password"
                    {...registerForm.register('password')}
                    className="w-full bg-zinc-800 rounded-md px-4 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                  {registerForm.formState.errors.password && (
                    <span className="text-red-500 text-sm">{registerForm.formState.errors.password.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 text-black font-semibold py-2 rounded-md hover:bg-amber-600 transition-colors"
                >
                  Criar Conta
                </button>
              </form>
            )}

            {!isResettingPassword && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    if (isLogin) {
                      handleSwitchToRegister();
                    } else {
                      setIsLogin(true);
                      setAlert(null);
                    }
                  }}
                  className="text-amber-500 hover:text-amber-400"
                >
                  {isLogin ? 'Criar uma conta' : 'Já tenho uma conta'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}