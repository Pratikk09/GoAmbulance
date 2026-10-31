interface SignupBoby {
  email: string;
  password: string;
}
interface SignupRes {
  success: boolean;
  message: string;
  token: string;
}

interface LoginBody {
  email: string;
  password: string;
}
interface LoginRes {
  accessToken: string;
  refreshToken: string;
  user: any;
  clinics: any[];
}
