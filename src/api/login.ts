import { BASE_URL } from "./const";
import {
  getAccessTokenFromLocalStorage,
  saveAccessTokenToLocalStorage,
} from "../utils/accessTokenHandler";
import { UserInfo } from "../types/user";

type LoginResult = "success" | "fail";

export type LoginResultWithToken =
  | {
      result: "success";
      access_token: string;
    }
  | {
      result: "fail";
      access_token: null;
    };

export interface LoginRequest {
  username: string;
  password: string;
}

export const loginWithToken = async (
  args: LoginRequest
): Promise<LoginResultWithToken> => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  if (!res.ok) {
    return {
      result: "fail",
      access_token: null,
    };
  }

  const resData = await res.json();
  return {
    result: "success",
    access_token: resData.access_token,
  };
};

export const getCurrentUserInfoWithToken = async (
  token: string
): Promise<UserInfo | null> => {
  const res = await fetch(`${BASE_URL}/profile`, {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return null;
  }

  const resData = await res.json();
  return { ...resData.userInfo };
};

export const login = async (args: LoginRequest): Promise<LoginResult> => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  if (!res.ok) {
    return "fail";
  }

  const resData = await res.json();
  saveAccessTokenToLocalStorage(resData.access_token);

  return "success";
};

export const getCurrentUserInfo = async (): Promise<UserInfo | null> => {
  const token = getAccessTokenFromLocalStorage();

  const res = await fetch(`${BASE_URL}/profile`, {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  console.log(res);
  if (!res.ok) {
    return null;
  }

  const resData = await res.json();
  return { ...resData.userInfo };
};
