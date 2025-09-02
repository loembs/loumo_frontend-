import { useAuthError } from '@/hooks/useAuthError';

interface AuthErrorHandlerProps {
  children: React.ReactNode;
}

export const AuthErrorHandler: React.FC<AuthErrorHandlerProps> = ({ children }) => {
  useAuthError();
  
  return <>{children}</>;
};
