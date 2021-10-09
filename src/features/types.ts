// 型情報をBlobからエクステンド
export interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}

// authSlice.tsで使用する/
export interface PROPS_AUTHEN {
  email: string;
  password: string;
}

export interface PROPS_PROFILE {
  id: number;
  nickName: string;
  img: File | null;
}

export interface PROPS_NICKNAME {
  nickName: string;
}
