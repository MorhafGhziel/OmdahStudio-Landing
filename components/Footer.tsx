import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#0a0a0a] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <Image
              src="/icons/WhiteLogo.svg"
              alt="Omdah Logo"
              width={120}
              height={40}
              className="mb-4"
            />
            <p className="text-sm text-gray-400 font-ibm-plex-sans-arabic text-center md:text-right">
              شركة سعودية، نشتغل على المحتوى المرئي
            </p>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <h3 className="text-xl mb-2 font-ibm-plex-sans-arabic">
              تواصل معنا
            </h3>

            <div className="items-center space-y-2">
              <div className="flex justify-end gap-3 items-center">
                {/* WhatsApp */}
                <Link
                  href="https://wa.me/966558960098"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/icons/whatsapp.svg"
                    alt="WhatsApp"
                    className="w-8 h-auto"
                    width={32}
                    height={32}
                  />
                </Link>

                {/* Instagram */}
                <Link
                  href="https://www.instagram.com/omdah.sa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/icons/instagra.svg"
                    alt="Instagram"
                    className="w-7 h-auto"
                    width={32}
                    height={32}
                  />
                </Link>
              </div>

              {/* Email */}
              <Link
                href="mailto:Info@omdah.sa"
                className="hover:text-gray-300 transition-colors font-ibm-plex-sans-arabic"
              >
                Info@omdah.sa
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
          <p className="font-ibm-plex-sans-arabic">
            © {new Date().getFullYear()} عمدة. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};
