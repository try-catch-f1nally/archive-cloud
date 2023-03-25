export type TokenPayload = {
  user: {
    id: string;
  };
};

export type UserData = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};

export type LoginData = {
  email: string;
  password: string;
}

export type RegisterData = {
  email: string;
  password: string;
};
