// createAsyncThunkは非同期用
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
// 指定した型データの読み込み
import { PROPS_AUTHEN, PROPS_PROFILE, PROPS_NICKNAME } from "../types";

// !DjangoのUrlパスを環境変数で指定
const apiUrl = process.env.REACT_APP_DEV_API_URL;

// 非同期処理はスライスの外で定義する決まり
// createAsyncThunkでaction creatorを生成する
// トークン生成用
export const fetchAsyncLogin = createAsyncThunk(
  // アクション名
  "auth/post",
  // 非同期処理としてasync/awaitを実施
  // authen→(email, password)のオブジェクトを引数として取得
  async (authen: PROPS_AUTHEN) => {
    // axiosでapiのエンドポイントにアクセス
    // (arg1: エンドポイント, arg2: 渡したい情報 arg3:header情報(post、putの場合は必要))
    // 返り値としてJWTのアクセストークンがresに返ってくる
    const res = await axios.post(`${apiUrl}authen/jwt/create`, authen, {
      headers: {
        //   json形式を指定
        "Content-Type": "application/json",
      },
    });
    //   JWTトークンを返却
    console.log(res);
    return res.data;
  }
);

// 新規ユーザー登録用
export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  // authen→(email, password)のオブジェクトを引数として取得
  async (auth: PROPS_AUTHEN) => {
    // 返り値として新規登録のユーザー情報がresに返ってくる
    const res = await axios.post(`${apiUrl}api/register/`, auth, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

// プロフィール作成用
export const fetchAsyncCreateProf = createAsyncThunk(
  "profile/post",
  // nickName(nickName)のオブジェクトを引数として取得
  // 返り値としてJWTのアクセストークンがresに返ってくる
  async (nickName: PROPS_NICKNAME) => {
    //   nickNameは必須のため、値が必要
    const res = await axios.post(`${apiUrl}api/profile/`, nickName, {
      headers: {
        "Content-Type": "application/json",
        //   認証情報としてログイン時に発行してローカルストレージに保存したトークンを渡す
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    // !作成したプロフィールが返ってくる？
    return res.data;
  }
);

// プロフィール更新用
export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/put",
  // profile(id, nickName, img)のオブジェクトを引数として取得
  // 返り値としてJWTのアクセストークンがresに返ってくる
  async (profile: PROPS_PROFILE) => {
    //   空のフォームインスタンスを作成
    const uploadData = new FormData();
    //   引数で渡したprofileのnickNameを追加
    uploadData.append("nickName", profile.nickName);
    //   引数にimgがなければ何もしない、imgがあればimgのパスを追加
    //   式：false && true になる
    profile.img && uploadData.append("img", profile.img, profile.img.name);
    //   エンドポイントと新しいプロフィール情報を与える
    // 返り値として自信(指定したid)のプロフィール情報がresに返ってくる
    const res = await axios.put(
      `${apiUrl}api/profile/${profile.id}`,
      uploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    // コンポーネントを介してextraReducersにbuilderとして返却される
    return res.data;
  }
);

// 自身のプロフィール取得用
export const fetchAsyncGetMyProf = createAsyncThunk("profile/get", async () => {
  const res = await axios.get(`${apiUrl}api/myprofile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  //   Djangoでプロフィールを取得する際にqueryset.filterを使用しており、
  //   返り値が配列のため番号を指定する
  return res.data[0];
});

// プロフィール一覧取得用
export const fetchAsyncGetProfs = createAsyncThunk("profiles/get", async () => {
  const res = await axios.get(`${apiUrl}api/profile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

// ログインモーダルのステートを管理
export const authSlice = createSlice({
  // 関数名
  name: "auth",
  // 初期状態を指定
  initialState: {
    // ログインモーダルのステートを管理
    openSignIn: true,
    // 新規登録モーダルのステートを管理
    openSignUp: false,
    // プロフィール編集用のモーダルステート
    openProfile: false,
    // APIへのローディング状態の制御
    isLoadingAuth: false,
    // プロフィールの状態制御
    myprofile: {
      id: 0,
      nickName: "",
      userProfile: 0,
      created_on: "",
      img: "",
    },
    // プロフィール全件を格納する配列の制御
    // 多対多のいいね機能用？
    profiles: [
      {
        id: 0,
        nickName: "",
        userProfile: 0,
        created_on: "",
        img: "",
      },
    ],
  },
  // fetchで投げるHTTPリクエストの制御用
  reducers: {
    // APIへのローディング状態をtrueに変更する
    fetchCredStart(state) {
      state.isLoadingAuth = true;
    },
    // APIへのローディング状態をfalseに変更する
    fetchCredEnd(state) {
      state.isLoadingAuth = false;
    },
    // サインインのモーダルオープン状態をtrueに変更(開く)
    setOpenSignIn(state) {
      state.openSignIn = true;
    },
    // サインインのモーダルオープン状態をfalseに変更(閉じる)
    resetOpenSignIn(state) {
      state.openSignIn = false;
    },
    // 新規登録のモーダルオープン状態をtrueに変更(開く)
    setOpenSignUp(state) {
      state.openSignUp = true;
    },
    // 新規登録のモーダルオープン状態をfalseに変更(閉じる)
    resetOpenSignUp(state) {
      state.openSignUp = false;
    },
    // プロフィール変更のモーダルオープン状態をtrueに変更(開く)
    setOpenProfile(state) {
      state.openProfile = true;
    },
    // プロフィール変更のモーダルオープン状態をfalseに変更(閉じる)
    resetOpenProfile(state) {
      state.openProfile = false;
    },
    // ニックネームデータの状態管理
    editNickname(state, action) {
      state.myprofile.nickName = action.payload;
    },
  },
  // CreateActionの後処理
  // createThunkからの引数でbuilderに格納
  //   紐付いているThunkで定義されたActionを元にstateを変更する
  extraReducers: (builder) => {
    console.log(builder);
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.setItem("localJWT", action.payload.access);
    });
    builder.addCase(fetchAsyncCreateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
      state.profiles = state.profiles.map((prof) =>
        prof.id === action.payload.id ? action.payload : prof
      );
    });
  },
});

// 指定した関数をエクスポート
export const {
  fetchCredStart,
  fetchCredEnd,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  setOpenProfile,
  resetOpenProfile,
  editNickname,
} = authSlice.actions;

// 最初はinitial_stateで設定した初期値を取得
// 以降は最新のステートを取得
// ルートステートはすべてのステートを参照した値
export const selectIsLoadingAuth = (state: RootState) =>
  state.auth.isLoadingAuth;
export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp;
export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
export const selectProfile = (state: RootState) => state.auth.myprofile;
export const selectProfiles = (state: RootState) => state.auth.profiles;

export default authSlice.reducer;
