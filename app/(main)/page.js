import Link from "next/link";
import Image from "next/image";
import { Headset, ShoppingCart, RotateCcwClock } from "lucide-react";

export default function Home() {
  return (
    <div>
      <Image
        src="/banner.png"
        alt="banner"
        width={1000}
        height={90}
        className="w-screen h-[70vh] object-cover aspect-video"
      />
      <div className="w-screen px-5">
        <ul className="flex w-auto h-18 my-3 justify-center [&_li]:w-1/5 [&_li]:content-center [&_li]:justify-items-center [&_li]:text-center [&_li]:text-gray-500">
          <li className="border-r-2 border-gray-400">
            <Headset />
            <p>24/7 Support</p>
          </li>
          <li className="border-r-2 border-gray-400">
            <RotateCcwClock />
            <p>Easy Return</p>
          </li>
          <li>
            <ShoppingCart />
            <p>On-time Delivery</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
