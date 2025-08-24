# Implementation Plan - Monad Memory Card Game

## Stage 1: 基盤構築
**Goal**: 開発環境と基本セットアップ
**Success Criteria**:
- Hardhat + Next.js プロジェクト作成
- RainbowKit でウォレット接続確認
- Linter 設定 (blome)
- Phaser.js or Pixi.js（ゲームフレームワーク）
- NodeはLTS

**Tests**:
- ローカルでウォレット接続成功
- Linter/formatter 実行でエラーなし
**Status**: Complete

## Stage 2: スマートコントラクト
**Goal**: ゲーム進行を管理する基本コントラクト
**Success Criteria**:
- プレイヤーごとにレベルを管理
- 進行状況を記録できる
- Hardhat で Monad testnet にデプロイ可能
**Tests**:
- ローカルテストでプレイヤーがレベルアップする
- デプロイ確認
**Status**: Complete

## Stage 3: フロントエンド (ゲームUI 基本)
**Goal**: 記憶ゲームのUI構築
**Success Criteria**:
- カードを表示 → 10秒後に裏返す
- ユーザーが候補リストからカードを選択可能
- Next.jsのpublic/assets/cardsに画像がなければ、擬似的にDOMで作ってください。適当でいいです。あとでimgタグをそこに置換します

**Tests**:
- 表示タイマーが正しく動作
- 正解/不正解の判定ができる
**Status**: Complete

## Stage 4: フロントエンドとコントラクト統合
**Goal**: UI と Blockchain を接続
**Success Criteria**:
- 成功時にスマートコントラクト側でレベルアップ
- プレイヤーごとの進行状況を取得可能
**Tests**:
- ゲームをクリアすると on-chain 状態が更新される
- 再読み込み後も進行状況を復元可能
**Status**: Complete

## Stage 5: 拡張機能 (任意)
**Goal**: 将来の発展を見据えた拡張
**Ideas**:
- NFT化したカード画像の利用
- Leaderboard (ランキング)
- 難易度調整オプション
**Status**: Complete

## Stage 6: デプロイ環境
**Goal**: Vercelでデプロイできること
**Ideas**:
- 環境変数の用意
- Vercelファイルの用意
- ビルド、デプロイ、開発方法をREADME.mdに記載
