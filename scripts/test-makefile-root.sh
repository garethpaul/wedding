#!/usr/bin/env sh
set -eu
PATH=/usr/bin:/bin
export PATH

ROOT_DIR=$(CDPATH='' cd -- "$(dirname -- "$0")/.." && /bin/pwd -P)
TEMP_ROOT=$(mktemp -d "${TMPDIR:-/tmp}/wedding-make-authority-XXXXXX")
trap 'rm -rf "$TEMP_ROOT"' EXIT HUP INT TERM
unset MAKEFILES MAKEFILE_LIST MAKEFLAGS MFLAGS MAKEOVERRIDES ROOT SHELL NODE NPM

CONTROL_DIR="$TEMP_ROOT/control"
CHECKOUT="$TEMP_ROOT/wedding app's [gate] \"quoted\" \`touch WEDDING_ROOT_MARKER\`"
ATTACKER_ROOT="$TEMP_ROOT/attacker"
AUTHORITY_PATH="$TEMP_ROOT/no-tools"
LOG="$TEMP_ROOT/commands.log"
SHELL_LOG="$TEMP_ROOT/shell.log"
mkdir -p "$CONTROL_DIR" "$CHECKOUT/scripts" "$CHECKOUT/app/node_modules" "$ATTACKER_ROOT" "$AUTHORITY_PATH"
CONTROL_DIR=$(CDPATH='' cd -- "$CONTROL_DIR" && /bin/pwd -P)
CHECKOUT=$(CDPATH='' cd -- "$CHECKOUT" && /bin/pwd -P)
MAKEFILE="$CHECKOUT/Makefile"
cp "$ROOT_DIR/Makefile" "$MAKEFILE"

FAKE_NODE="$TEMP_ROOT/trusted node's \"quoted\" \`touch WEDDING_NODE_MARKER\` \$literal"
FAKE_NPM="$TEMP_ROOT/trusted npm's \"quoted\" \`touch WEDDING_NPM_MARKER\` \$literal"
for tool in "$FAKE_NODE" "$FAKE_NPM"; do
  cat >"$tool" <<'TOOL'
#!/bin/sh
printf '%s|%s|%s\n' "$PWD" "$0" "$*" >> "$WEDDING_COMMAND_LOG"
TOOL
  chmod +x "$tool"
done
cp "$FAKE_NODE" "$CHECKOUT/scripts/check_wedding_contracts.js"
cat >"$CHECKOUT/scripts/test-makefile-root.sh" <<'ROOT_TEST'
#!/bin/sh
printf '%s|%s|root-test\n' "$PWD" "$0" >> "$WEDDING_COMMAND_LOG"
ROOT_TEST
chmod +x "$CHECKOUT/scripts/test-makefile-root.sh"

FAKE_SHELL="$TEMP_ROOT/fake-shell"
cat >"$FAKE_SHELL" <<EOF_SHELL
#!/bin/sh
printf '%s\n' invoked >> '$SHELL_LOG'
exec /bin/sh "\$@"
EOF_SHELL
chmod +x "$FAKE_SHELL"

assert_not_contains() {
  label=$1 needle=$2 file=$3
  if grep -Fq "$needle" "$file"; then
    printf 'forbidden text found in %s\n' "$label" >&2
    return 1
  else
    status=$?
    if [ "$status" -ne 1 ]; then
      printf 'could not inspect %s\n' "$label" >&2
      return 1
    fi
  fi
}

ASSERTION_PROBE="$TEMP_ROOT/forbidden-text-assertion.log"
: >"$ASSERTION_PROBE"
assert_not_contains "empty dependency-skip assertion probe" "$FAKE_NPM" "$ASSERTION_PROBE"
printf '%s\n' "$FAKE_NPM" >"$ASSERTION_PROBE"
if assert_not_contains "dependency-skip assertion probe" "$FAKE_NPM" "$ASSERTION_PROBE" >"$TEMP_ROOT/forbidden-text-assertion.out" 2>&1; then
  printf 'forbidden-text assertion did not fail closed when the fake npm marker was present\n' >&2
  exit 1
fi
grep -Fq 'forbidden text found in dependency-skip assertion probe' "$TEMP_ROOT/forbidden-text-assertion.out"
rm -f "$ASSERTION_PROBE"
if assert_not_contains "missing dependency-skip assertion probe" "$FAKE_NPM" "$ASSERTION_PROBE" >"$TEMP_ROOT/missing-forbidden-text-assertion.out" 2>&1; then
  printf 'forbidden-text assertion did not fail closed when its command log was missing\n' >&2
  exit 1
fi
grep -Fq 'could not inspect missing dependency-skip assertion probe' "$TEMP_ROOT/missing-forbidden-text-assertion.out"

run_case() {
  target=$1 mode=$2 output="$TEMP_ROOT/case.out"
  rm -f "$LOG" "$SHELL_LOG" "$output"
  set +e
  case "$mode" in
    default) (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" WEDDING_COMMAND_LOG="$LOG" /usr/bin/make --no-print-directory -f "$MAKEFILE" "NODE=$FAKE_NODE" "NPM=$FAKE_NPM" "$target") >"$output" 2>&1 ;;
    command-root) (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" WEDDING_COMMAND_LOG="$LOG" /usr/bin/make --no-print-directory -f "$MAKEFILE" ROOT="$ATTACKER_ROOT" "NODE=$FAKE_NODE" "NPM=$FAKE_NPM" "$target") >"$output" 2>&1 ;;
    environment-root) (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" ROOT="$ATTACKER_ROOT" WEDDING_COMMAND_LOG="$LOG" /usr/bin/make --no-print-directory -f "$MAKEFILE" "NODE=$FAKE_NODE" "NPM=$FAKE_NPM" "$target") >"$output" 2>&1 ;;
    command-shell) (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" WEDDING_COMMAND_LOG="$LOG" /usr/bin/make --no-print-directory -f "$MAKEFILE" SHELL="$FAKE_SHELL" "NODE=$FAKE_NODE" "NPM=$FAKE_NPM" "$target") >"$output" 2>&1 ;;
    environment-shell) (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" SHELL="$FAKE_SHELL" WEDDING_COMMAND_LOG="$LOG" /usr/bin/make --no-print-directory -f "$MAKEFILE" "NODE=$FAKE_NODE" "NPM=$FAKE_NPM" "$target") >"$output" 2>&1 ;;
  esac
  status=$?
  set -e
  if [ "$status" -ne 0 ] || [ -e "$SHELL_LOG" ] || ! grep -Fq "$CHECKOUT" "$LOG"; then
    printf 'authority case failed: target=%s mode=%s status=%s\n' "$target" "$mode" "$status" >&2
    cat "$output" >&2
    return 1
  fi
}

executed=0
for target in build check lint root-test test verify; do
  for mode in default command-root environment-root command-shell environment-shell; do
    run_case "$target" "$mode"
    executed=$((executed + 1))
  done
done
[ "$executed" -eq 30 ]

rm -f "$LOG"
(cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" WEDDING_COMMAND_LOG="$LOG" /usr/bin/make --no-print-directory -f "$MAKEFILE" "NODE=$FAKE_NODE" "NPM=$FAKE_NPM" check) >/dev/null 2>&1
grep -Fq "$FAKE_NODE" "$LOG"
grep -Fq "$FAKE_NPM" "$LOG"
for marker in WEDDING_ROOT_MARKER WEDDING_NODE_MARKER WEDDING_NPM_MARKER; do [ ! -e "$CONTROL_DIR/$marker" ]; done

for tool_name in NODE NPM; do
  marker="$TEMP_ROOT/${tool_name}-syntax"
  bad="\$(shell /usr/bin/touch '$marker')"
  if (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" /usr/bin/make --no-print-directory -f "$MAKEFILE" "$tool_name=$bad" lint) >"$TEMP_ROOT/${tool_name}-command.out" 2>&1; then exit 1; fi
  [ ! -e "$marker" ]
  env_marker="$TEMP_ROOT/${tool_name}-environment-syntax"
  env_bad="\$(shell /usr/bin/touch '$env_marker')"
  if [ "$tool_name" = NODE ]; then
    if (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" NODE="$env_bad" /usr/bin/make --environment-overrides --no-print-directory -f "$MAKEFILE" lint) >"$TEMP_ROOT/${tool_name}-environment.out" 2>&1; then exit 1; fi
  else
    if (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" NPM="$env_bad" /usr/bin/make --environment-overrides --no-print-directory -f "$MAKEFILE" build "NODE=$FAKE_NODE") >"$TEMP_ROOT/${tool_name}-environment.out" 2>&1; then exit 1; fi
  fi
  [ ! -e "$env_marker" ]

  brace_marker="$TEMP_ROOT/${tool_name}-brace-syntax"
  brace_bad="\${shell /usr/bin/touch '$brace_marker'}"
  if (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" /usr/bin/make --no-print-directory -f "$MAKEFILE" "$tool_name=$brace_bad" lint) >"$TEMP_ROOT/${tool_name}-brace-command.out" 2>&1; then exit 1; fi
  [ ! -e "$brace_marker" ]
  brace_env_marker="$TEMP_ROOT/${tool_name}-brace-environment-syntax"
  brace_env_bad="\${shell /usr/bin/touch '$brace_env_marker'}"
  if [ "$tool_name" = NODE ]; then
    if (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" NODE="$brace_env_bad" /usr/bin/make --environment-overrides --no-print-directory -f "$MAKEFILE" lint) >"$TEMP_ROOT/${tool_name}-brace-environment.out" 2>&1; then exit 1; fi
  else
    if (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" NPM="$brace_env_bad" /usr/bin/make --environment-overrides --no-print-directory -f "$MAKEFILE" build "NODE=$FAKE_NODE") >"$TEMP_ROOT/${tool_name}-brace-environment.out" 2>&1; then exit 1; fi
  fi
  [ ! -e "$brace_env_marker" ]
done

if (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" /usr/bin/make --no-print-directory -f "$MAKEFILE" MAKEFILE_LIST=/tmp/untrusted check) >"$TEMP_ROOT/list-command.out" 2>&1; then exit 1; fi
grep -Fq 'MAKEFILE_LIST must not be overridden' "$TEMP_ROOT/list-command.out"
if (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" MAKEFILE_LIST=/tmp/untrusted /usr/bin/make --environment-overrides --no-print-directory -f "$MAKEFILE" check) >"$TEMP_ROOT/list-environment.out" 2>&1; then exit 1; fi
grep -Fq 'MAKEFILE_LIST must not be overridden' "$TEMP_ROOT/list-environment.out"

PRE="$TEMP_ROOT/pre.mk"; PRE_MARKER="$TEMP_ROOT/pre-ran"; printf '%s\n' "\$(shell /usr/bin/touch '$PRE_MARKER')" >"$PRE"
if (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" MAKEFILES="$PRE" /usr/bin/make --no-print-directory -f "$MAKEFILE" check) >"$TEMP_ROOT/pre.out" 2>&1; then exit 1; fi
grep -Fq 'MAKEFILES must be empty' "$TEMP_ROOT/pre.out"; [ -e "$PRE_MARKER" ]
EARLY="$TEMP_ROOT/early.mk"; EARLY_MARKER="$TEMP_ROOT/early-ran"; printf '%s\n' "\$(shell /usr/bin/touch '$EARLY_MARKER')" >"$EARLY"
if (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" /usr/bin/make --no-print-directory -f "$EARLY" -f "$MAKEFILE" check) >"$TEMP_ROOT/early.out" 2>&1; then exit 1; fi
[ -e "$EARLY_MARKER" ]

for target in build check lint root-test test verify; do
  later="$TEMP_ROOT/later-$target.mk"
  printf '%s:\n\t@/usr/bin/printf replaced\\n\n' "$target" >"$later"
  if (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" /usr/bin/make --no-print-directory -f "$MAKEFILE" -f "$later" "$target" "NODE=$FAKE_NODE" "NPM=$FAKE_NPM") >"$TEMP_ROOT/later-$target.out" 2>&1; then exit 1; fi
  grep -Fq 'both : and :: entries' "$TEMP_ROOT/later-$target.out"
done

TARGET_NODE="$TEMP_ROOT/target-node"; TARGET_NPM="$TEMP_ROOT/target-npm"; TARGET_LOG="$TEMP_ROOT/target.log"
cat >"$TARGET_NODE" <<'TOOL'
#!/bin/sh
printf node >> "$WEDDING_TARGET_LOG"
exit 1
TOOL
cat >"$TARGET_NPM" <<'TOOL'
#!/bin/sh
printf npm >> "$WEDDING_TARGET_LOG"
exit 1
TOOL
chmod +x "$TARGET_NODE" "$TARGET_NPM"
LATER_VARS="$TEMP_ROOT/later-vars.mk"
cat >"$LATER_VARS" <<LATER_VARS_EOF
build check lint root-test test verify: MAKEFILE_LIST := $MAKEFILE
build check lint root-test test verify: ROOT := $ATTACKER_ROOT
build check lint root-test test verify: NODE := $TARGET_NODE
build check lint root-test test verify: NPM := $TARGET_NPM
LATER_VARS_EOF
rm -f "$LOG" "$TARGET_LOG"
if ! (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" WEDDING_COMMAND_LOG="$LOG" WEDDING_TARGET_LOG="$TARGET_LOG" /usr/bin/make --no-print-directory -f "$MAKEFILE" -f "$LATER_VARS" check "NODE=$FAKE_NODE" "NPM=$FAKE_NPM") >"$TEMP_ROOT/later-vars.out" 2>&1; then
  cat "$TEMP_ROOT/later-vars.out" >&2
  exit 1
fi
grep -Fq "$FAKE_NODE" "$LOG"; grep -Fq "$FAKE_NPM" "$LOG"; [ ! -e "$TARGET_LOG" ]

LATER_SHELL="$TEMP_ROOT/later-shell.mk"
cat >"$LATER_SHELL" <<LATER_SHELL_EOF
build check lint root-test test verify: MAKEFILE_LIST := $MAKEFILE
build check lint root-test test verify: SHELL := $FAKE_SHELL
build check lint root-test test verify: .SHELLFLAGS := -c
LATER_SHELL_EOF
rm -f "$LOG" "$SHELL_LOG"
if ! (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" WEDDING_COMMAND_LOG="$LOG" /usr/bin/make --no-print-directory -f "$MAKEFILE" -f "$LATER_SHELL" check "NODE=$FAKE_NODE" "NPM=$FAKE_NPM") >"$TEMP_ROOT/later-shell.out" 2>&1; then
  cat "$TEMP_ROOT/later-shell.out" >&2
  exit 1
fi
[ ! -e "$SHELL_LOG" ]; grep -Fq "$CHECKOUT" "$LOG"

rm -rf "$CHECKOUT/app/node_modules"; rm -f "$LOG"
(cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" WEDDING_COMMAND_LOG="$LOG" /usr/bin/make --no-print-directory -f "$MAKEFILE" test "NODE=$FAKE_NODE" "NPM=$FAKE_NPM") >"$TEMP_ROOT/skip-test.out" 2>&1
grep -Fq 'Skipping npm test' "$TEMP_ROOT/skip-test.out"
grep -Fq "$FAKE_NODE" "$LOG"
assert_not_contains "skipped npm test command log" "$FAKE_NPM" "$LOG"
rm -f "$LOG"
(cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" WEDDING_COMMAND_LOG="$LOG" /usr/bin/make --no-print-directory -f "$MAKEFILE" build "NODE=$FAKE_NODE" "NPM=$FAKE_NPM") >"$TEMP_ROOT/skip-build.out" 2>&1
grep -Fq 'Skipping CSS build' "$TEMP_ROOT/skip-build.out"
grep -Fq "$FAKE_NODE" "$LOG"
assert_not_contains "skipped CSS build command log" "$FAKE_NPM" "$LOG"

cp "$FAKE_NODE" "$TEMP_ROOT/node"; cp "$FAKE_NPM" "$TEMP_ROOT/npm"; rm -f "$LOG"
(cd "$CONTROL_DIR" && PATH="$TEMP_ROOT:/usr/bin:/bin" WEDDING_COMMAND_LOG="$LOG" /usr/bin/make --no-print-directory -f "$MAKEFILE" lint) >"$TEMP_ROOT/path-node.out" 2>&1
grep -Fq "$TEMP_ROOT/node" "$LOG"
mkdir -p "$CHECKOUT/app/node_modules"; rm -f "$LOG"
(cd "$CONTROL_DIR" && PATH="$TEMP_ROOT:/usr/bin:/bin" WEDDING_COMMAND_LOG="$LOG" /usr/bin/make --no-print-directory -f "$MAKEFILE" build "NODE=$FAKE_NODE") >"$TEMP_ROOT/path-npm.out" 2>&1
grep -Fq "$TEMP_ROOT/npm" "$LOG"

if (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" /usr/bin/make --no-print-directory -f "$MAKEFILE" MAKEFLAGS=-n check) >"$TEMP_ROOT/flags.out" 2>&1; then exit 1; fi
grep -Fq 'MAKEFLAGS must not be overridden' "$TEMP_ROOT/flags.out"
for flag in -n --just-print --dry-run --recon -t --touch -q --question -i --ignore-errors; do
  if (cd "$CONTROL_DIR" && PATH="$AUTHORITY_PATH" /usr/bin/make "$flag" --no-print-directory -f "$MAKEFILE" check) >"$TEMP_ROOT/flag.out" 2>&1; then exit 1; fi
  grep -Fq 'non-executing or error-ignoring MAKEFLAGS are not supported' "$TEMP_ROOT/flag.out"
done

printf '%s\n' 'Make authority tests passed: 30 target/root/shell cases, literal hostile Node and npm paths, 8 raw Make-syntax controls, 2 MAKEFILE_LIST rejections, 2 startup-boundary cases, 6 later recipe-replacement rejections, later root/Node/npm and non-override shell protection, dependency-skip containment, PATH boundary controls, caller MAKEFLAGS rejection, and 10 mode rejections'
