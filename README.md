# git stale branch formatter
GitHub のリポジトリで古いブランチ順で csv に書き出すスクリプト(手抜き)

## 使い方
```shell
npm install
```

入ってなかったら依存するコマンドを入れる
```shell
// e.g. brew
brew install gh
```

src/index.ts で以下の変数を適当に変える

```ts
// 対象の git リポジトリ
const targetDirectory = 'path/to/target_git_repository'
// 対象の git リポジトリの GitHub URL
const githubUrl = 'https://github.com/k-ymmt/target_git_repository'
// 出力するファイル名
const outputFileName = 'stale_branches.csv'
// 出力するディレクトリ名
const outputDirectory = '.'
```

実行する
```shell
npm run run
```

あとはお好みのエディタで csv を開く