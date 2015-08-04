extern void __VERIFIER_error(void);
extern void __VERIFIER_assume(int);
void __VERIFIER_assert(int cond) {
  if (!(cond)) {
      ERROR: __VERIFIER_error();
  }
  return;
}
int __VERIFIER_nondet_int();
void main() {
    int n = __VERIFIER_nondet_int();
    __VERIFIER_assume(0 <= n && n <= 1000);
    int *x = malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) x[i] = 0;
    for (int i = 0; i < n; i++) __VERIFIER_assert(x[i] == 0);
}
