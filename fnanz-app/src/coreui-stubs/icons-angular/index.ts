export class IconSetService {
  // Minimal stub for compatibility with CoreUI icon service API expectations.
  // Consumers can register icon sets through this service when the real package
  // is unavailable in the execution environment.
  icons: Record<string, unknown> = {};

  add(icons: Record<string, unknown>): void {
    this.icons = { ...this.icons, ...icons };
  }
}
