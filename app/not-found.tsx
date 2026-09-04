import Link from "next/link";
import { Lens } from "@/components/graphics/Lens";

export default function NotFound() {
  return (
    <div className="gutter grid min-h-svh grid-cols-12 items-center py-28">
      <div className="col-span-12 lg:col-span-5">
        <p className="t-label text-clay">404</p>
        <h1 className="t-h1 mt-4">الصفحة مو موجودة</h1>
        <p className="t-lead mt-4 text-ash">
          يمكن الرابط تغيّر، أو الصفحة انحذفت.
        </p>
        <Link
          href="/"
          className="link-rule mt-8 inline-block text-[0.9375rem] font-medium text-chalk"
        >
          ارجع للرئيسية
        </Link>
      </div>

      <div className="col-span-12 mt-16 flex justify-center text-chalk lg:col-span-5 lg:col-start-8 lg:mt-0">
        <div className="w-56 sm:w-72">
          <Lens />
        </div>
      </div>
    </div>
  );
}
