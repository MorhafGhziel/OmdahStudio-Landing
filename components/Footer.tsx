import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#0a0a0a] text-white py-8 sm:py-12 border-t border-gray-400/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start w-full md:w-auto">
            <Image
              src="/icons/logo_white_v2.svg"
              alt="Omdah Logo"
              width={100}
              height={33}
              className="mb-3 sm:mb-4 w-[100px] sm:w-[120px] h-auto"
            />
            <p className="text-sm sm:text-base text-gray-400 font-ibm-plex-sans-arabic text-center md:text-right max-w-[280px] md:max-w-none">
              شركة سعودية، نشتغل على المحتوى المرئي
            </p>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col items-center md:items-end gap-3 sm:gap-4 w-full md:w-auto">
            <h3 className="text-lg sm:text-xl mb-1 sm:mb-2 font-ibm-plex-sans-arabic">
              تواصل معنا
            </h3>

            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex justify-center md:justify-end gap-4 items-center">
                {/* WhatsApp */}
                <Link
                  href="https://wa.me/966558960098"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity p-1"
                >
                  <Image
                    src="/icons/whatsapp.svg"
                    alt="WhatsApp"
                    className="w-7 sm:w-8 h-auto"
                    width={32}
                    height={32}
                  />
                </Link>

                {/* Instagram */}
                <Link
                  href="https://www.instagram.com/omdah.sa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity p-1"
                >
                  <Image
                    src="/icons/instagra.svg"
                    alt="Instagram"
                    className="w-6 sm:w-7 h-auto"
                    width={32}
                    height={32}
                  />
                </Link>
              </div>

              {/* Email */}
              <Link
                href="mailto:Info@omdah.sa"
                className="hover:text-gray-300 transition-colors font-ibm-plex-sans-arabic text-sm sm:text-base"
              >
                Info@omdah.sa
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-gray-800 text-center text-xs sm:text-sm text-gray-400">
          <p className="font-ibm-plex-sans-arabic">
            © {new Date().getFullYear()} عمدة. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};
