const eslint = require('gulp-eslint');
const gulp = require('gulp');
const prettier = require('gulp-prettier');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

// for fast exit
gulp.on('stop', () => {
  process.exit(0);
});
gulp.on('err', () => {
  process.exit(1);
});

// tsc
gulp.task('tsc', () => {
  return gulp
    .src(['*.ts'], {base: '.'})
    .pipe(tsProject())
    .js.pipe(gulp.dest('.'));
});

// lint
gulp.task('lint', () => {
  return gulp
    .src(['*.ts'])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format());
});

// format
gulp.task('format', () => {
  return gulp
    .src(['*.ts'], {base: '.'})
    .pipe(
      prettier({
        parser: 'typescript',
        arrowParens: 'always',
        bracketSpacing: false,
        insertPragma: false,
        printWidth: 120,
        proseWrap: 'preserve',
        requirePragma: false,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
        useTabs: false,
      })
    )
    .pipe(gulp.dest('.'));
});

