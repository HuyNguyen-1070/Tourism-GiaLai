export const Footer = () => {
  return (
    <footer className="bg-surface-container-highest border-t border-secondary/30 w-full py-12">
      <div className="px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-container-max mx-auto">
        <div className="col-span-1 md:col-span-1">
          <div className="font-headline-md text-headline-md text-forest-leaf mb-4">
            Gia Lai Heritage
          </div>
          <p className="font-body-md text-on-surface-variant pr-4">
            Preserving the spirit of the Central Highlands through digital accessibility and modern
            tourism standards.
          </p>
        </div>
        <div>
          <h4 className="font-label-md text-label-md text-basalt-soil mb-4">Explore</h4>
          <ul className="space-y-2">
            <li>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors"
                href="#"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors"
                href="#"
              >
                Historical Archive
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-label-md text-label-md text-basalt-soil mb-4">Legal</h4>
          <ul className="space-y-2">
            <li>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors"
                href="#"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors"
                href="#"
              >
                Terms of Use
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-label-md text-label-md text-basalt-soil mb-4">Support</h4>
          <ul className="space-y-2">
            <li>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors"
                href="#"
              >
                Contact Support
              </a>
            </li>
            <li>
              <a
                className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors"
                href="#"
              >
                Help Center
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-margin-desktop mt-12 pt-8 border-t border-secondary/10 text-center">
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          © 2026 Gia Lai Tourism & Culture Department. Preserving the Heritage of the Highlands.
        </p>
      </div>
    </footer>
  );
};
