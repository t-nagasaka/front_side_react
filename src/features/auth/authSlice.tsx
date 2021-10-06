// createAsyncThunkは非同期用
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
// 指定した型データの読み込み
import { PROPS_AUTHEN, PROPS_PROFILE, PROPS_NICKNAME } from "../types";

// !DjangoのUrlパスを環境変数で指定
const apiUrl = process.env.REACT_APP_DEV_API_URL;

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
      state.openProfile;
    },
    // ニックネームデータの状態管理
    editNickname(state, action) {
      state.myprofile.nickName = action.payload;
    },
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

export const selectCount = (state: RootState) => state.counter.value;

export default authSlice.reducer;
