"use client"; // nếu dùng Next.js 13 app directory

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import { EffectCards, Pagination } from "swiper/modules";

const feedbackList = [
  {
    id: 1,
    image: "/2.jpg",
  },
  {
    id: 2,
    image: "/1.jpg",
  },
  {
    id: 3,
    image: "/3.jpg",
  },
  // Thêm các feedback khác nếu cần
];

const CardAnimation = () => {
  return (
    <Swiper
      effect={"cards"}
      grabCursor={true}
      modules={[EffectCards, Pagination]}
      className="max-w-[220px] mx-auto relative md:max-w-[360px] lg:max-w-[420px]"
      cardsEffect={{
        perSlideOffset: 10,
        perSlideRotate: 2,
        rotate: true,
        slideShadows: true,
      }}
    >
      {feedbackList.map((feedback) => (
        <SwiperSlide key={feedback.id} className="">
          <div className="flex flex-col items-center bg-white p-4 shadow-lg h-[320px] md:h-[500px] lg:h-[560px]">
            <div className="relative w-full h-full">
              <div className="relative w-full h-full aspect-[3/4]">
                <Image
                  src={feedback.image}
                  fill
                  alt="feedback"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CardAnimation;
